const fs = require('fs');
const { execSync } = require('child_process');

function initPackageInCurDir(pkgManager) {
  fs.mkdirSync('src');
  fs.writeFileSync(`./src/index.js`, 'console.log("hi");');
  execSync(`${pkgManager} init -y`);
  console.log(`🎊🎉 Ready!\n🚀 Go ${pkgManager} start`);
}

function initPackageInNewDir(projectName, pkgManager) {
  fs.mkdirSync(`${projectName}/src`, { recursive: true });
  fs.writeFileSync(`./${projectName}/src/index.js`, 'console.log("hi");');
  execSync(`cd ${projectName} && ${pkgManager} init -y`);
  console.log(`🎊🎉 Ready!\n🚀 Go cd ${projectName} && ${pkgManager} start`);
}

function handleProjectSettings(
  folderChoice,
  projectName,
  pkgManager,
  ts,
  settings
) {
  console.log(`Your using: ${pkgManager}`);
  console.log(`TS: ${ts}`);
  console.log(`Additional tools: ${settings}`);
  console.log('🔨 Setting up the project...');

  if (folderChoice === 'Create new') {
    initPackageInNewDir(projectName, pkgManager);
  } else {
    initPackageInCurDir(pkgManager);
  }
}

module.exports = {
  handleProjectSettings,
};
