import { type Argv } from 'yargs'

export abstract class DefaultCommand {
  commandEntry!: string
  describe!: string
  parserInputs!: (args: Argv<Record<string, unknown>>) => void
  handler!: () => void
}
