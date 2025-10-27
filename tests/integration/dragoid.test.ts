import fs from 'node:fs/promises'
import { afterEach, describe, it } from 'node:test'
import { type Rejected, executeCMD } from '../utils/cmd.ts'
import assert from 'node:assert'
import pkg from '../../package.json' assert { type: 'json' }
import { EOL, tmpdir } from 'node:os'
import path from 'node:path'

function escapeRegex(string: string) {
  // Escapa caracteres que têm significado especial em regex
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

describe('Test CLI Integration', async () => {
  const cliPath = './src/dragoid.ts'

  it('Should error on start without commands or args', async () => {
    await assert.rejects(executeCMD(cliPath), (err: Rejected) => {
      assert.equal(err.code, 1)
      assert.match(err.stderr, /You need to provide a valid command/)
      return true
    })
  })

  it('Should cli version with success on argument "-v" or "--version"', async () => {
    const shortVersionResponse = await executeCMD(cliPath, ['-v'])
    const longVersionResponse = await executeCMD(cliPath, ['--version'])
    assert.deepEqual(
      shortVersionResponse.stdout.replace(new RegExp(EOL, 'g'), ''),
      pkg.version
    )
    assert.deepEqual(
      longVersionResponse.stdout.replace(new RegExp(EOL, 'g'), ''),
      pkg.version
    )
  })

  it('Should help message with success on "-h" or "--help" argument', async () => {
    const longHelpResponse = await executeCMD(cliPath, ['--help'])
    const shortHelpResponse = await executeCMD(cliPath, ['-h'])
    assert.match(longHelpResponse.stdout, /dragoid.ts <command>/)
    assert.match(shortHelpResponse.stdout, /dragoid.ts <command>/)
  })

  /**
   * DRAGOID PREVIEW COMMAND
   */
  describe('Command preview', async () => {
    it('Should start  the reader/server successfully', async () => {
      const response = await executeCMD(
        cliPath,
        ['preview', '-f=./tests/assets/novel-example.json'],
        {
          readinessTimeoutMs: 32000,
          resolveOnStdout: /Server started successfully/,
          killOnResolve: true,
        }
      )

      assert.match(response.stdout, /Server started successfully/)
    })

    it('Should give an error when command is called without args', async () => {
      await assert.rejects(
        executeCMD(cliPath, ['preview']),
        (err: Rejected) => {
          assert.equal(err.code, 1)
          assert.match(
            err.stderr,
            /Validation error: Missing required argument '--file'. Please provide the path to a JSON file./
          )
          return true
        }
      )
    })

    it('Should error on command start without file', async () => {
      await assert.rejects(
        executeCMD(cliPath, ['preview', '--file=']),
        (err: Rejected) => {
          assert.equal(err.code, 1)
          assert.match(
            err.stderr,
            /Missing required argument '--file'. Please provide the path to a JSON file./
          )
          return true
        }
      )
    })

    it('Must be able to start the server on a port other than the default using the "--port" argument', async () => {
      const customPort = 4000
      const args = [
        'preview',
        '-f=./tests/assets/novel-example.json',
        `--port=${customPort}`,
      ]
      const response = await executeCMD(cliPath, args, {
        readinessTimeoutMs: 16000,
        resolveOnStdout: /http:\/\/127\.0\.0\.1/,
        killOnResolve: true,
      })

      const regex = new RegExp(`http://127\\.0\\.0\\.1:${customPort}`)
      assert.match(response.stdout, regex)
    })

    it('Should start reader/server on 0.0.0.0 host using "-p" or "--public" flag', async () => {
      const config = {
        readinessTimeoutMs: 6000,
        resolveOnStdout: /^(.*\n){4}$/,
        killOnResolve: true,
      }

      const shortFlagResponse = await executeCMD(
        cliPath,
        ['preview', '-f=./tests/assets/novel-example.json', '-p'],
        config
      )

      const longFlagResponse = await executeCMD(
        cliPath,
        ['preview', '-f=./tests/assets/novel-example.json', '--public'],
        config
      )

      assert.match(shortFlagResponse.stdout, /Server started successfully/)
      assert.match(shortFlagResponse.stdout, /http:\/\/127\.0\.0\.1:3010/)
      assert.match(
        shortFlagResponse.stdout,
        /http:\/\/(?:\d{1,3}\.){3}\d{1,3}:3010/
      )

      assert.match(longFlagResponse.stdout, /Server started successfully/)
      assert.match(longFlagResponse.stdout, /http:\/\/127\.0\.0\.1:3010/)
      assert.match(
        longFlagResponse.stdout,
        /http:\/\/(?:\d{1,3}\.){3}\d{1,3}:3010/
      )
    })

    it('Should display the list of arguments supported by the command', async () => {
      const shortArgs = ['preview', '-h']
      const longArgs = ['preview', '--help']

      const shortFlagResponse = await executeCMD(cliPath, shortArgs)
      const longFlagResponse = await executeCMD(cliPath, longArgs)
      assert.match(shortFlagResponse.stdout, /preview \[options\]/)
      assert.match(longFlagResponse.stdout, /preview \[options\]/)
    })
  })

  /**
   * DRAGOID DOWNLOAD COMMAND
   */
  describe('Command download', async () => {
    const outputNovelFileName = 'Mocked Novel.json'
    const outputChapterFileName = 'Mock chapter.json'
    const outputNovelPath = path.resolve(process.cwd(), outputNovelFileName)
    const outputChapterPath = path.resolve(process.cwd(), outputChapterFileName)

    const outputNovelFileNameTxt = 'Mocked Novel.txt'
    const outputChapterFileNameTxt = 'Mock chapter.txt'
    const outputNovelPathTxt = path.resolve(
      process.cwd(),
      outputNovelFileNameTxt
    )
    const outputChapterPathTxt = path.resolve(
      process.cwd(),
      outputChapterFileNameTxt
    )

    const outputNovelFileNameEpub = 'Mocked Novel.epub'
    const outputNovelPathEpub = path.resolve(
      process.cwd(),
      outputNovelFileNameEpub
    )

    afterEach(async () => {
      try {
        await fs.unlink(outputNovelPath).catch(() => {
          /* ignora se não existe */
        })
        await fs.unlink(outputChapterPath).catch(() => {
          /* ignora se não existe */
        })
        await fs.unlink(outputNovelPathTxt).catch(() => {
          /* ignora se não existe */
        })
        await fs.unlink(outputChapterPathTxt).catch(() => {
          /* ignora se não existe */
        })
        await fs.unlink(outputNovelPathEpub).catch(() => {
          /* ignora se não existe */
        })
      } catch (_) {
        // não deveria ocorrer, mas não falha o teste por aqui
      }
    })

    it('Should return error when the command is called without args', async () => {
      await assert.rejects(
        executeCMD(cliPath, ['download']),
        (err: Rejected) => {
          assert.deepEqual(err.code, 1)
          assert.match(
            err.stderr,
            /Validation error:\s*Missing required option\(s\):\s*['"]--mode['"],\s*['"]--url['"],\s*['"]--format['"]/
          )
          return true
        }
      )
    })

    it('Should display the list of arguments supported by the command', async () => {
      const shortArgResponse = await executeCMD(cliPath, ['download', '-h'])
      const longArgResponse = await executeCMD(cliPath, ['download', '--help'])

      assert.strictEqual(shortArgResponse.code, 0)
      assert.strictEqual(longArgResponse.code, 0)
      assert.match(shortArgResponse.stdout, /Download Options/)
      assert.match(longArgResponse.stdout, /Download Options/)
    })

    it('Should display the list of available scrapers', async () => {
      const res = await executeCMD(cliPath, ['download', '--list-crawlers'])
      assert.match(res.stdout, /List Bots/)
    })

    it('Should display the list of available scrapers', async () => {
      const res = await executeCMD(cliPath, ['download', '--list-crawlers'])
      assert.match(res.stdout, /List Bots/)
    })

    it('Must have mock bot in list of registered bots', async () => {
      const command = ['download', '--list-crawlers']
      const res = await executeCMD(cliPath, command, {
        env: { USE_BOT_MOCK: 'true' },
      })
      assert.match(res.stdout, /List Bots/)
      assert.match(res.stdout, /mock-bot/)
    })

    it('Should display the list of output format supported! Required .json for both modes', async () => {
      const res = await executeCMD(cliPath, [
        'download',
        '--list-output-formats',
      ])
      assert.match(
        res.stdout,
        /Supported output formats, organized by download type/
      )
      const isJSon = res.stdout
        .split('Chapter:')
        .filter((arr) => arr.includes('json'))
      assert.deepEqual(
        isJSon.length,
        2,
        'Required output format ".json" not found'
      )
    })

    it('Should download novel with success using mock params and generate file', async () => {
      const safeName = escapeRegex(outputNovelFileName.replace('.json', ''))
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=novel',
        '--format=json',
      ]
      const response = await executeCMD(cliPath, command, {
        env: { USE_BOT_MOCK: 'true' },
      })
      const regex = new RegExp(
        `File "${safeName}" has been written successfully`
      )
      assert.match(response.stdout, regex)
      await fs.access(outputNovelPath)
    })

    it('Should download novel with success and generate .txt file', async () => {
      const format = 'txt'
      const safeName = escapeRegex(
        outputNovelFileNameTxt.replace(`.${format}`, '')
      )
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=novel',
        `--format=${format}`,
      ]
      const response = await executeCMD(cliPath, command, {
        env: { USE_BOT_MOCK: 'true' },
      })
      const regex = new RegExp(
        `File "${safeName}" has been written successfully`
      )
      assert.match(response.stdout, regex)
      await fs.access(outputNovelPathTxt)
    })

    it('Should download novel with success and generate .epub file', async () => {
      const format = 'epub'
      const safeName = escapeRegex(
        outputNovelFileNameEpub.replace(`.${format}`, '')
      )
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=novel',
        `--format=${format}`,
      ]
      const response = await executeCMD(cliPath, command, {
        env: { USE_BOT_MOCK: 'true' },
      })
      const regex = new RegExp(
        `File "${safeName}" has been written successfully`
      )
      assert.match(response.stdout, regex)
      await fs.access(outputNovelPathEpub)
    })

    it('Should download chapter with success using mock params and generate file', async () => {
      const safeName = escapeRegex(outputChapterFileName.replace('.json', ''))
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=chapter',
        '--format=json',
      ]
      const response = await executeCMD(cliPath, command, {
        env: { USE_BOT_MOCK: 'true' },
      })
      const regex = new RegExp(
        `File "${safeName}" has been written successfully`
      )
      assert.match(response.stdout, regex)
      await fs.access(outputChapterPath)
    })

    it('Should download chapter with success and generate .txt file', async () => {
      const format = 'txt'
      const safeName = escapeRegex(
        outputChapterFileNameTxt.replace(`.${format}`, '')
      )
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=chapter',
        `--format=${format}`,
      ]
      const response = await executeCMD(cliPath, command, {
        env: { USE_BOT_MOCK: 'true' },
      })
      const regex = new RegExp(
        `File "${safeName}" has been written successfully`
      )
      assert.match(response.stdout, regex)
      await fs.access(outputChapterPathTxt)
    })

    it('Should download the novel successfully into a custom directory when -p/--path is provided.', async () => {
      const novelFile = 'Mocked Novel.json'
      const format = 'json'
      const newPath = path.resolve(tmpdir(), novelFile)
      const commands = [
        [
          'download',
          '--url=https://mock-bot.com',
          '--mode=novel',
          `--format=${format}`,
          `-p=${tmpdir()}`,
        ],
        [
          'download',
          '--url=https://mock-bot.com',
          '--mode=novel',
          `--format=${format}`,
          `--path=${tmpdir()}`,
        ],
      ]

      for (const command of commands) {
        try {
          const safeName = escapeRegex(novelFile.replace(`.${format}`, ''))
          const response = await executeCMD(cliPath, command, {
            env: { USE_BOT_MOCK: 'true' },
          })
          const regex = new RegExp(
            `File "${safeName}" has been written successfully`
          )
          assert.match(response.stdout, regex)
          await fs.access(newPath)
        } finally {
          await fs.rm(newPath, { force: true }).catch(() => {})
        }
      }
    })

    it('Should fail when the custom path passed in -p/--path does not exist', async () => {
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=novel',
        `--format=json`,
        `-p=./invalid-path`,
      ]
      const opt = { env: { USE_BOT_MOCK: 'true' } }
      await assert.rejects(
        executeCMD(cliPath, command, opt),
        (err: Rejected) => {
          assert.deepEqual(err.code, 1)
          assert.match(
            err.stderr,
            /Provided path does not exist or is not a directory/
          )
          return true
        }
      )
    })

    it('Should return error if all three required arguments are not provide together', async () => {
      const commandOpt1 = ['download', '--url=https://mock-bot.com']
      const commandOpt2 = ['download', '--mode=chapter']
      const commandOpt3 = ['download', '--format=json']
      const commandOpt4 = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=chapter',
      ]
      const commandOpt5 = [
        'download',
        '--url=https://mock-bot.com',
        '--format=json',
      ]
      const commandOpt6 = ['download', '--format=json', '--mode=chapter']

      const commands = [
        commandOpt1,
        commandOpt2,
        commandOpt3,
        commandOpt4,
        commandOpt5,
        commandOpt6,
      ]

      for (const command of commands) {
        await assert.rejects(executeCMD(cliPath, command), (err: Rejected) => {
          assert.deepEqual(err.code, 1)
          assert.match(err.stderr, /Validation error: Missing required option/)
          return true
        })
      }
    })

    it('Should return error if skip or limit arguments are used with --mode=chapter', async () => {
      const command = [
        'download',
        '--url=https://mock-bot.com',
        '--mode=chapter',
        '--format=json',
        '--limit=2',
        '--skip=4',
      ]
      await assert.rejects(
        executeCMD(cliPath, command, { env: { USE_BOT_MOCK: 'true' } }),
        (err: Rejected) => {
          assert.deepEqual(err.code, 1)
          return true
        }
      )
    })
  })
})
