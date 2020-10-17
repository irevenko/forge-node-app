const fs = require('fs');
const { execSync } = require('child_process');
const { installTsDependencies } = require('./package_manager');

function initPackage(projectName, pkgManager) {
  fs.mkdirSync(projectName);
  execSync(`cd ${projectName} && ${pkgManager} init -y`);
}

function createSrcFolder(projectName, typeScript) {
  fs.mkdirSync(`${projectName}/src`, { recursive: true });
  if (typeScript) {
    fs.writeFileSync(
      `./${projectName}/src/index.ts`,
      'const n: number = 5;\nconsole.log(n);'
    );
  } else {
    fs.writeFileSync(
      `./${projectName}/src/index.js`,
      'const n = 5;\nconsole.log(n);'
    );
  }
}

function initTypeScript(projectName) {
  execSync(`cd ${projectName} && tsc --init`);
}

// eslint-disable-next-line no-unused-vars
function handleProjectSettings(projectName, pkgManager, typeScript, settings) {
  console.log('🔨 Setting up the project...');

  initPackage(projectName, pkgManager);
  if (typeScript) {
    initTypeScript(projectName, typeScript);
    installTsDependencies(pkgManager, projectName);
  }
  createSrcFolder(projectName, typeScript);

  console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
}

module.exports = {
  handleProjectSettings,
};
