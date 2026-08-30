#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const validator_1 = require("./validator");
async function loadDocument(location) {
    if (/^https?:\/\//u.test(location)) {
        const response = await fetch(location, { headers: { accept: 'application/json' } });
        if (!response.ok) {
            throw new Error(`Cannot load OpenAPI document: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    return JSON.parse(await (0, promises_1.readFile)((0, node_path_1.resolve)(location), 'utf8'));
}
async function main() {
    const [command, location] = process.argv.slice(2);
    if (command !== 'validate-openapi' || !location) {
        console.error('Usage: senler-app validate-openapi <file-or-url>');
        process.exitCode = 2;
        return;
    }
    const result = (0, validator_1.validateAppActionOpenApiDocument)(await loadDocument(location));
    for (const issue of result.issues) {
        const output = `${issue.level.toUpperCase()} ${issue.code} ${issue.location}: ${issue.message}`;
        (issue.level === 'error' ? console.error : console.warn)(output);
    }
    if (!result.valid) {
        process.exitCode = 1;
        return;
    }
    console.log(`Valid Senler app action contract: ${result.actions.length} action(s)`);
}
void main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
});
