const fs = require('fs');
const { execSync } = require('child_process');
const {
  initPackage,
  installTsDependencies,
  createScripts,
} = require('./package_manager');

function createSrcFolder(projectName, typeScript) {
  fs.mkdirSync(`${projectName}/src`, { recursive: true });
  typeScript
    ? fs.writeFileSync(
        `./${projectName}/src/index.ts`,
        'const n: number = 5;\nconsole.log(n);'
      )
    : fs.writeFileSync(
        `./${projectName}/src/index.js`,
        'const n = 5;\nconsole.log(n);'
      );
}

function initTypeScript(projectName) {
  execSync(`cd ${projectName} && tsc --init`);
}

// eslint-disable-next-line no-unused-vars
function handleProjectSettings(projectName, pkgManager, typeScript, settings) {
  console.log('🔨 Initializing The Package...');
  initPackage(projectName, pkgManager);

  if (typeScript) {
    console.log('📥 Setting Up TypeScript');
    installTsDependencies(pkgManager, projectName);
    initTypeScript(projectName, typeScript);
  }

  console.log('🗂  Creating Folders');
  createSrcFolder(projectName, typeScript);
  console.log('📜 Creating Scripts');
  createScripts(pkgManager, projectName, typeScript);

  console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
}

module.exports = {
  handleProjectSettings,
};
