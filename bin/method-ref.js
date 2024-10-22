#!/usr/bin/env node

import { prepareMethodsInfoFromDirectory } from '../lib/index.js';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Please provide a directory path.");
    process.exit(1);
}

const dirPath = path.resolve(args[0]);

try {
    const methodsInfo = prepareMethodsInfoFromDirectory(dirPath);
    console.log(methodsInfo);
} catch (error) {
    console.error("Error parsing files:", error);
    process.exit(1);
}
