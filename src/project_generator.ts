import fs from 'fs';
import { execSync } from 'child_process';
import {
  installTsDependencies,
  addPrettier,
  addEslint,
  attachLinterWithPrettier,
} from './dependencies';
import { createInitialScripts, initPackage } from './package_manager';

function initTypeScript(projectName: string): void {
  execSync(`cd ${projectName} && tsc --init`);
}

function createSourceFolder(projectName: string, typeScript: boolean): void {
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
  createSourceFolder(projectName, typeScript);

  console.log('📜 Creating Scripts');
  createInitialScripts(pkgManager, projectName, typeScript);

  if (extraSettings) {
    if (
      extraSettings.includes('ESLint') &&
      extraSettings.includes('Prettier')
    ) {
      addPrettier(projectName, pkgManager);
      attachLinterWithPrettier(projectName, pkgManager);
      addEslint(projectName, projectName);
      console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
    }
    if (extraSettings.includes('ESLint')) {
      addEslint(projectName, projectName);
      console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
    }
    if (extraSettings.includes('Prettier')) {
      addPrettier(projectName, projectName);
      console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
    }
  }
}

export default handleProjectSettings;
