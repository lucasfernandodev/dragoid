import { type ChildProcessWithoutNullStreams, spawn } from 'child_process';

interface Options {
  env?: Record<string, string>;
  resolveOnStdout?: RegExp | null;
  readinessTimeoutMs?: number
}

type Response = Promise<{
  stdout: string;
  stderr: string;
  code: number | null;
  child: ChildProcessWithoutNullStreams
}>

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

    const cleanup = () => {
      if (readinessTimer) {
        clearTimeout(readinessTimer)
        readinessTimer = null
      }
    }

    child.on('error', (err) => {
      // erro ao spawn — devolve info útil
      cleanup()
      reject({ error: err, stdout: Buffer.concat(stdoutChunks).toString(), stderr: Buffer.concat(stderrChunks).toString(), code: null });
    });

    if (opts.resolveOnStdout) {
      const regex = opts.resolveOnStdout;
      const onStdout = () => {
        const current = Buffer.concat(stdoutChunks).toString()
        if (regex.test(current)) {
          cleanup()
          resolve({ stdout: current, stderr: Buffer.concat(stderrChunks).toString(), code: null, child })
        }
      }
      child.stdout.on('data', onStdout)

      if (opts.readinessTimeoutMs && opts.readinessTimeoutMs > 0) {
        readinessTimer = setTimeout(() => {
          child.stdout.off('data', onStdout);
          reject({ error: new Error('readiness timeout'), stdout: Buffer.concat(stdoutChunks).toString(), stderr: Buffer.concat(stderrChunks).toString(), code: null });
        }, opts.readinessTimeoutMs)
      }
    }

    child.on('close', (code, signal) => {
      cleanup()
      const stdout = Buffer.concat(stdoutChunks).toString();
      const stderr = Buffer.concat(stderrChunks).toString();

      if (code === 0) {
        resolve({ stdout, stderr, code, child });
      } else {
        reject({ error: new Error(`Process exited with code ${code}${signal ? `, signal ${signal}` : ''}`), stdout, stderr, code });
      }
    });
  });
};
