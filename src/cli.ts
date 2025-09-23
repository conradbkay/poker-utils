#!/usr/bin/env node

import { generateEquityHash } from './lib/hashing/hash'
import { HoldemRange } from './lib/range/holdem'
import { any2, PokerRange } from './lib/range/range'
import { PreflopRange } from './lib/range/preflop'

interface CLIArgs {
  command?: string
  output?: string
  range?: string
  help?: boolean
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2)
  const parsed: CLIArgs = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === 'gen-hash') {
      parsed.command = 'gen-hash'
    } else if (arg === '--output' || arg === '-o') {
      parsed.output = args[++i]
    } else if (arg === '--range' || arg === '-r') {
      parsed.range = args[++i]
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true
    }
  }

  return parsed
}

function printHelp() {
  console.log(`
poker-utils CLI

Usage:
  npx poker-utils gen-hash [options]

Commands:
  gen-hash    Generate equity hash for all flops against a range

Options:
  -o, --output <path>    Output file path (default: equity-hash.json)
  -r, --range <range>    Range to calculate equity against (default: any2)
                         Expects a Pio compatible string (uses PreflopRange.fromStr())
  -h, --help            Show help

Examples:
  npx poker-utils gen-hash
  npx poker-utils gen-hash --output my-hash.json
`)
}

function createRange(rangeStr?: string): HoldemRange {
  if (!rangeStr) {
    // Default to any2 (all hands)
    return HoldemRange.fromPokerRange(any2)
  }

  try {
    const preflopRange = PreflopRange.fromStr(rangeStr)
    return HoldemRange.fromPokerRange(PokerRange.fromPreflop(preflopRange))
  } catch (error) {
    console.error(`Invalid range format: ${rangeStr}`)
    process.exit(1)
  }
}

async function main() {
  const args = parseArgs()

  if (args.help) {
    printHelp()
    return
  }

  if (!args.command || args.command !== 'gen-hash') {
    console.error('Command required. Use "gen-hash" or --help for usage.')
    process.exit(1)
  }

  const outputPath = args.output || 'equity-hash.json'
  const vsRange = createRange(args.range)

  console.log('Generating equity hash...')
  console.log(`Range: ${args.range || 'any2 (all hands)'}`)
  console.log(`Output: ${outputPath}`)

  const startTime = Date.now()

  try {
    const { writeFileSync } = await import('fs')
    const { resolve } = await import('path')

    const hash = generateEquityHash(vsRange)
    const outputFullPath = resolve(outputPath)

    writeFileSync(outputFullPath, JSON.stringify(hash, null, 2))

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`✅ Equity hash generated successfully in ${elapsedTime}s`)
    console.log(`📁 Output saved to: ${outputFullPath}`)
  } catch (error) {
    console.error('❌ Error generating equity hash:', error)
    process.exit(1)
  }
}

main().catch(console.error)
