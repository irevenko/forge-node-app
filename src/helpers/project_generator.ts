import fs from 'fs';
import { execSync } from 'child_process';
import {
  initPackage,
  installTsDependencies,
  createScripts,
  addEslint,
} from './package_manager';

function createSrcFolder(projectName: string, typeScript: boolean): void {
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

function initTypeScript(projectName: string): void {
  execSync(`cd ${projectName} && tsc --init`);
}

// eslint-disable-next-line no-unused-vars
function handleProjectSettings(
  projectName: string,
  pkgManager: string,
  typeScript: boolean,
  extraSettings: Array<string>
): void {
  console.log('🔨 Initializing The Package...');
  initPackage(projectName, pkgManager);

  if (typeScript) {
    console.log('📥 Setting Up TypeScript');
    installTsDependencies(pkgManager, projectName);
    initTypeScript(projectName);
  }

  console.log('🗂  Creating Folders');
  createSrcFolder(projectName, typeScript);
  console.log('📜 Creating Scripts');
  createScripts(pkgManager, projectName, typeScript);

  if (extraSettings) {
    if (extraSettings[0]) {
      addEslint(projectName, pkgManager);
    }
  }

  console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
}

export default handleProjectSettings;
