#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_1 = require("./lib/hashing/hash");
const holdem_1 = require("./lib/range/holdem");
const range_1 = require("./lib/range/range");
const preflop_1 = require("./lib/range/preflop");
function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === 'gen-hash') {
            parsed.command = 'gen-hash';
        }
        else if (arg === '--output' || arg === '-o') {
            parsed.output = args[++i];
        }
        else if (arg === '--range' || arg === '-r') {
            parsed.range = args[++i];
        }
        else if (arg === '--help' || arg === '-h') {
            parsed.help = true;
        }
    }
    return parsed;
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
`);
}
function createRange(rangeStr) {
    if (!rangeStr) {
        // Default to any2 (all hands)
        return holdem_1.HoldemRange.fromPokerRange(range_1.any2);
    }
    try {
        const preflopRange = preflop_1.PreflopRange.fromStr(rangeStr);
        return holdem_1.HoldemRange.fromPokerRange(range_1.PokerRange.fromPreflop(preflopRange));
    }
    catch (error) {
        console.error(`Invalid range format: ${rangeStr}`);
        process.exit(1);
    }
}
async function main() {
    const args = parseArgs();
    if (args.help) {
        printHelp();
        return;
    }
    if (!args.command || args.command !== 'gen-hash') {
        console.error('Command required. Use "gen-hash" or --help for usage.');
        process.exit(1);
    }
    const outputPath = args.output || 'equity-hash.json';
    const vsRange = createRange(args.range);
    console.log('Generating equity hash...');
    console.log(`Range: ${args.range || 'any2 (all hands)'}`);
    console.log(`Output: ${outputPath}`);
    const startTime = Date.now();
    try {
        const { writeFileSync } = await Promise.resolve().then(() => __importStar(require('fs')));
        const { resolve } = await Promise.resolve().then(() => __importStar(require('path')));
        const hash = (0, hash_1.generateEquityHash)(vsRange);
        const outputFullPath = resolve(outputPath);
        writeFileSync(outputFullPath, JSON.stringify(hash, null, 2));
        const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ Equity hash generated successfully in ${elapsedTime}s`);
        console.log(`📁 Output saved to: ${outputFullPath}`);
    }
    catch (error) {
        console.error('❌ Error generating equity hash:', error);
        process.exit(1);
    }
}
main().catch(console.error);
