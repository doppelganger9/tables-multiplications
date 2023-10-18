#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const shortSHA = execSync("git rev-parse --short HEAD").toString().trim();
const lastCommitTime = execSync("git log -1 --pretty=format:'%cd'  --date=format:'%Y-%m-%dT%H:%M:%S.000%z'").toString().trim();
const versionInfo = {
    shortSHA,
    lastCommitTime
}
console.log("[git-info.mjs]: shortSHA = " + shortSHA);
console.log("[git-info.mjs]: lastCommitTime = " + lastCommitTime);
const versionInfoJson = JSON.stringify(versionInfo, null, 2);
writeFileSync('./src/git-version.json', versionInfoJson);
console.log("[git-info.mjs]: wrote git info into ./src/git-version.json" );
