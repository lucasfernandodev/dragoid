import { describe, it } from "node:test";
import { executeCMD } from "../utils/cmd.ts";
import assert from "node:assert";
import pkg from "../../package.json" assert { type: "json" };
import { EOL } from "node:os";

describe('Dragoid E2E', async () => {
  it('Should error on start without commands or args', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.rejects(executeCMD('./src/dragoid.ts'), (err: any) => {
      assert.equal(err.code, 1);
      assert.match(err.stderr, /You need to provide a valid command/);
      return true; // importante: indicar que a validação passou
    })
  })

  it('Should cli version with success on argument "-v" or "--version"', async () => {
    const shortVersionResponse = await executeCMD('./src/dragoid.ts', ['-v'])
    const longVersionResponse = await executeCMD('./src/dragoid.ts', ['--version'])
    assert.deepEqual(shortVersionResponse.stdout.replaceAll(EOL, ''), pkg.version)
    assert.deepEqual(longVersionResponse.stdout.replaceAll(EOL, ''), pkg.version)
  })

  it('Should help message with success on "--help" argument', async () => {
    const longHelpResponse = await executeCMD('./src/dragoid.ts', ['--help']);
    const shortHelpResponse = await executeCMD('./src/dragoid.ts', ['-h']);
    assert.match(longHelpResponse.stdout, /dragoid.ts <command>/)
    assert.match(shortHelpResponse.stdout, /dragoid.ts <command>/)
  })

  it("Should preview command start server with success", async () => {
    const response = await executeCMD('./src/dragoid.ts', ['preview', '-f=./tests/assets/novel-example.json'], {
      readinessTimeoutMs: 6000,
      resolveOnStdout: /Server started successfully/
    });

    const child = response.child;

    assert.match(response.stdout, /Server started successfully/)
    child.kill('SIGINT')
  })

  it('Should error on preview command start without file', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.rejects(executeCMD('./src/dragoid.ts', ['preview', '--file=']), (err: any) => {
      assert.equal(err.code, 1);
      assert.match(err.stderr, /Missing required argument '--file'. Please provide the path to a JSON file./)
      return true; // importante: indicar que a validação passou
    })
  })
})