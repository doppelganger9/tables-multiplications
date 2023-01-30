#!/usr/bin/env node
import { appendFileSync, lstatSync, existsSync, rmSync, readFileSync } from 'fs';

const distDir = './dist/tables-multiplications/';
const filesToConcatenate = ["polyfills.js", "runtime.js", "main.js"];
const targetAppFile = './dist/table-multiplication-app.js';

if (existsSync(targetAppFile)) {
  console.log("removing existing target : " + targetAppFile);
  rmSync(targetAppFile);
}

if (!existsSync(distDir)) {
  console.error("Dist directory does not exist : " + distDir);
  process.exitCode = 1;
} else {
  filesToConcatenate
  .map((file) => distDir + file)
  .forEach((file) => {
    if (existsSync(file) && lstatSync(file).isFile()) {
      console.log(`appending ${file} to existing target : ${targetAppFile}`);
      appendFileSync(targetAppFile, readFileSync(file).toString()); 
    } else {
      console.error(`file ${file} does not exist or is not a file!`);
    }
  });

  process.exitCode = 0;
  console.log('done!');
}

