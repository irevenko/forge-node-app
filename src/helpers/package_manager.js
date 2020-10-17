const { execSync } = require('child_process');

function installTsDependencies(pkgManager, projectName) {
  if (pkgManager === 'npm') {
    execSync(`cd ${projectName} && npm i typescript ts-node @types/node -D`);
  } else {
    execSync(`cd ${projectName} && yarn add typescript ts-node @types/node -D`);
  }
}

module.exports = { installTsDependencies };
