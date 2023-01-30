#!/usr/bin/env node
import { existsSync, readfileSync, writeFileSync } from 'fs';

const staticIndexHtmlFile = './static/index.html';
const searchThis = `<base href="/"`;
const replaceWithThis = `<base href="/tables-multiplications/"`;

if (existsSync(staticIndexHtmlFile)) {
  const fileContents = readfileSync(staticIndexHtmlFile).toString();
  const changedFileContents = fileContents.replace(searchThis, replaceWithThis);
  writeFileSync(staticIndexHtmlFile, changedFileContents);
  console.log('replaced base url in static index.html file for GitHub Pages deployment');
  process.exitCode = 0;
} else {
  console.error('did not find static index.html file!');
  process.exitCode = 1;
}
