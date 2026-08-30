#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateAppActionOpenApiDocument } from './validator';

async function loadDocument(location: string): Promise<unknown> {
  if (/^https?:\/\//u.test(location)) {
    const response = await fetch(location, { headers: { accept: 'application/json' } });
    if (!response.ok) {
      throw new Error(`Cannot load OpenAPI document: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
  return JSON.parse(await readFile(resolve(location), 'utf8')) as unknown;
}

async function main(): Promise<void> {
  const [command, location] = process.argv.slice(2);
  if (command !== 'validate-openapi' || !location) {
    console.error('Usage: senler-app validate-openapi <file-or-url>');
    process.exitCode = 2;
    return;
  }
  const result = validateAppActionOpenApiDocument(await loadDocument(location));
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

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
