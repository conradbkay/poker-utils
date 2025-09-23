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
exports.init = exports.initFromPathSync = exports.initFromPath = exports.RANKS_DATA = void 0;
exports.RANKS_DATA = null;
let usedPath = null; // file never changes so don't load it more than once
const initFromPath = async (path) => {
    try {
        if (path && path !== usedPath) {
            const { readFile } = await Promise.resolve().then(() => __importStar(require('fs/promises')));
            exports.RANKS_DATA = await readFile(path);
            usedPath = path;
        }
    }
    catch (err) {
        console.error('could not initialize HandRanks - likely running in browser environment');
    }
};
exports.initFromPath = initFromPath;
const initFromPathSync = (path) => {
    try {
        if (path && path !== usedPath) {
            // Dynamic require to avoid bundling fs in browser builds
            const fs = (function () {
                return require('fs');
            })();
            exports.RANKS_DATA = fs.readFileSync(path);
            usedPath = path;
        }
    }
    catch (err) {
        console.error('could not initialize HandRanks - likely running in browser environment');
    }
};
exports.initFromPathSync = initFromPathSync;
const init = (data) => {
    exports.RANKS_DATA = data;
};
exports.init = init;
