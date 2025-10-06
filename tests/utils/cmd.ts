import { type ChildProcessWithoutNullStreams, spawn } from 'child_process';

interface Options {
  env?: Record<string, string>;
  resolveOnStdout?: RegExp | null;
  readinessTimeoutMs?: number
  killOnResolve?: boolean
}

type Response = Promise<{
  stdout: string;
  stderr: string;
  code: number | null;
  child: ChildProcessWithoutNullStreams
}>

export type Rejected = {
  error: Error;
  stdout: string;
  stderr: string;
  code: number | null;
};

export const executeCMD = (path: string, args: string[] = [], opts: Options = {}): Response => {
  const env = Object.assign({ NODE_ENV: 'test', NODE_NO_WARNINGS: 1 }, opts.env ?? {});
  // chama 'node' separando comando de args
  const nodeExecutable = process.execPath
  const cliArgs = ['--experimental-transform-types', path, ...args]
  const child = spawn(nodeExecutable, cliArgs, { env });

  child.stdin.setDefaultEncoding?.('utf-8');

  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk));
  child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk));



  return new Promise((resolve, reject) => {
    let readinessTimer: NodeJS.Timeout | null = null;
    let settled = false;

    const getOutput = () => ({
      stdout: Buffer.concat(stdoutChunks).toString(),
      stderr: Buffer.concat(stderrChunks).toString(),
    });

    const cleanup = () => {
      if (readinessTimer) {
        clearTimeout(readinessTimer)
        readinessTimer = null
      }

      child.removeAllListeners(); // Simplificado para remover todos os listeners do 'child'
      child.stdout.removeAllListeners();
      child.stderr.removeAllListeners();
    }

    const onError = (error: Error, code: number | null = null) => {
      if (settled) return;
      settled = true;
      reject({ error, ...getOutput(), code })
      cleanup()
    }

    const onSuccess = (code: number | null) => {
      if (settled) return;
      settled = true;
      resolve({ ...getOutput(), code, child })
      cleanup()
    }

    child.on('error', onError);

    if (opts.resolveOnStdout) {
      const regex = opts.resolveOnStdout;

      const onStdout = (chunk: Buffer) => {
        stdoutChunks.push(chunk);
        const current = getOutput().stdout
        if (regex.test(current)) {
          child.stdout.off('data', onStdout);
          if (opts.killOnResolve && !child.killed) {
            child.kill('SIGTERM');
          }
          onSuccess(null)
        }
      }
      child.stdout.removeAllListeners('data');
      child.stdout.on('data', onStdout)

      if (opts.readinessTimeoutMs && opts.readinessTimeoutMs > 0) {
        readinessTimer = setTimeout(() => {
          if (settled) return;
          child.kill('SIGTERM')
          const error = new Error(`Readiness timeout of ${opts.readinessTimeoutMs}ms exceeded`);
          onError(error, null);
        }, opts.readinessTimeoutMs)
      } else {
        child.stdout.on('data', (chunk: Buffer) => stdoutChunks.push(chunk));
      }
    }

    child.on('close', (code, signal) => {
      if (settled) return;

      if (code === 0) {
        onSuccess(code)
      } else {
        const error = new Error(`Process exited with code ${code}${signal ? `, signal ${signal}` : ''}`);
        onError(error, code);
      }
    });
  });
};
