#!/usr/bin/env node

import { Cli } from './continue/cli.ts'
import { crawlerReadnovelfull } from './crawlers/readnovelfull.ts'

// STARTIGN CLI
const cli = new Cli(process.argv, [crawlerReadnovelfull])
cli.handle()