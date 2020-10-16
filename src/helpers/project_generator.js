const fs = require('fs');
const { execSync } = require('child_process');

function initPackage(projectName, pkgManager) {
  fs.mkdirSync(projectName);
  execSync(`cd ${projectName} && ${pkgManager} init -y`);
}

function createSourceFolder(projectName, typescript) {
  fs.mkdirSync(`${projectName}/src`, { recursive: true });
  if (typescript) {
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

function initTypescript(projectName) {
  execSync(`cd ${projectName} && tsc --init`);
}

// eslint-disable-next-line no-unused-vars
function handleProjectSettings(projectName, pkgManager, typescript, settings) {
  console.log('🔨 Setting up the project...');

  initPackage(projectName, pkgManager);
  if (typescript) {
    initTypescript(projectName, typescript);
  }
  createSourceFolder(projectName, typescript);

  console.log(`🎊🎉 Ready!\n🚀 Go cd ${projectName} && ${pkgManager} start`);
}

module.exports = {
  handleProjectSettings,
};
