/* eslint-disable prettier/prettier */
const { execSync } = require('child_process');
const fs = require('fs');

function initPackage(projectName, pkgManager) {
  fs.mkdirSync(projectName);
  execSync(`cd ${projectName} && ${pkgManager} init -y`);
}

function installTsDependencies(pkgManager, projectName) {
  if (pkgManager === 'npm') { 
    execSync(`cd ${projectName} && npm i typescript ts-node @types/node -D`);
  }
  if (pkgManager === 'yarn') {
    execSync(`cd ${projectName} && yarn add typescript ts-node @types/node -D`);
  }
  
}

function createScripts(pkgManager, projectName, typeScript) {
  const package = JSON.parse(fs.readFileSync(`${projectName}/package.json`, 'utf8'));

  if (pkgManager === 'npm') {
    typeScript
      ? package.scripts.start = "ts-node src/index.ts"
      : package.scripts.start = "node src/index.js";
    fs.writeFileSync(`${projectName}/package.json`, JSON.stringify(package, null, 2));
  }

  if (pkgManager === 'yarn') {
    package.scripts = {};
    typeScript
      ? package.scripts.start = "ts-node src/index.ts"
      : package.scripts.start = "node src/index.js";
    fs.writeFileSync(`${projectName}/package.json`, JSON.stringify(package, null, 2));
  }
}


module.exports = { installTsDependencies, createScripts, initPackage };
