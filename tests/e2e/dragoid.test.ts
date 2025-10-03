import { describe, it } from "node:test";
import { executeCMD } from "../utils/cmd.ts";
import assert from "node:assert";
import pkg from "../../package.json" assert { type: "json" };
import { EOL } from "node:os";

describe('Dragoid E2E', async () => {

  const cliPath = './src/dragoid.ts'

  it('Should error on start without commands or args', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await assert.rejects(executeCMD(cliPath), (err: any) => {
      assert.equal(err.code, 1);
      assert.match(err.stderr, /You need to provide a valid command/);
      return true;
    })
  })

  it('Should cli version with success on argument "-v" or "--version"', async () => {
    const shortVersionResponse = await executeCMD(cliPath, ['-v'])
    const longVersionResponse = await executeCMD(cliPath, ['--version'])
    assert.deepEqual(shortVersionResponse.stdout.replaceAll(EOL, ''), pkg.version)
    assert.deepEqual(longVersionResponse.stdout.replaceAll(EOL, ''), pkg.version)
  })

  it('Should help message with success on "-h" or "--help" argument', async () => {
    const longHelpResponse = await executeCMD(cliPath, ['--help']);
    const shortHelpResponse = await executeCMD(cliPath, ['-h']);
    assert.match(longHelpResponse.stdout, /dragoid.ts <command>/)
    assert.match(shortHelpResponse.stdout, /dragoid.ts <command>/)
  })

  it('Should "preview command" start server with success', async () => {
    const response = await executeCMD(cliPath, ['preview', '-f=./tests/assets/novel-example.json'], {
      readinessTimeoutMs: 32000,
      resolveOnStdout: /Server started successfully/,
      killOnResolve: true
    });

    assert.match(response.stdout, /Server started successfully/);
  })

  it('Should give an error when preview command is called without arguments', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await assert.rejects(executeCMD(cliPath, ['preview']), (err: any) => {
      assert.equal(err.code, 1);
      assert.match(err.stderr, /Validation error: Missing required argument '--file'. Please provide the path to a JSON file./)
      return true
    })
  })

  it('Should error on preview command start without file', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await assert.rejects(executeCMD(cliPath, ['preview', '--file=']), (err: any) => {
      assert.equal(err.code, 1);
      assert.match(err.stderr, /Missing required argument '--file'. Please provide the path to a JSON file./)
      return true;
    })
  })

  it('Must be able to start the server on a port other than the default using the "--port" argument', async () => {
    const customPort = 4000;
    const args = ['preview', '-f=./tests/assets/novel-example.json', `--port=${customPort}`]
    const response = await executeCMD(cliPath, args, {
      readinessTimeoutMs: 16000,
      resolveOnStdout: /http:\/\/127\.0\.0\.1/,
      killOnResolve: true
    })

    const regex = new RegExp(`http://127\\.0\\.0\\.1:${customPort}`);
    assert.match(response.stdout, regex)
  })

  it('Should start preview server on 0.0.0.0 host using "-p" or "--public" flag', async () => {
    const shortFlagResponse = await executeCMD(
      cliPath,
      ['preview', '-f=./tests/assets/novel-example.json', '-p'],
      {
        readinessTimeoutMs: 6000,
        resolveOnStdout: /^(.*\n){4}$/,
        killOnResolve: true
      })

    const longFlagResponse = await executeCMD(
      cliPath,
      ['preview', '-f=./tests/assets/novel-example.json', '--public'],
      {
        readinessTimeoutMs: 6000,
        resolveOnStdout: /^(.*\n){4}$/,
        killOnResolve: true
      })

    assert.match(shortFlagResponse.stdout, /Server started successfully/)
    assert.match(shortFlagResponse.stdout, /http:\/\/127\.0\.0\.1:3010/)
    assert.match(shortFlagResponse.stdout, /http:\/\/(?:\d{1,3}\.){3}\d{1,3}:3010/);

    assert.match(longFlagResponse.stdout, /Server started successfully/)
    assert.match(longFlagResponse.stdout, /http:\/\/127\.0\.0\.1:3010/)
    assert.match(longFlagResponse.stdout, /http:\/\/(?:\d{1,3}\.){3}\d{1,3}:3010/);
  })
})