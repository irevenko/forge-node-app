import fs from 'fs';
import { execSync } from 'child_process';
import PackageManager from './package_manager';

class ProjectGenerator {
  constructor(
    readonly projectName: string,
    readonly pkgManager: string,
    readonly typeScript: boolean,
    readonly extraSettings?: Array<string>
  ) {
    console.log('🔨 Initializing The Package...');
    PackageManager.initPackage(projectName, pkgManager);

    if (typeScript) {
      console.log('📥 Setting Up TypeScript');
      PackageManager.installTsDependencies(pkgManager, projectName);
      ProjectGenerator.initTypeScript(projectName);
    }

    console.log('🗂  Creating Folders');
    ProjectGenerator.createSourceFolder(projectName, typeScript);

    console.log('📜 Creating Scripts');
    PackageManager.createInitialScripts(pkgManager, projectName, typeScript);

    if (extraSettings) {
      if (
        extraSettings.includes('ESLint') &&
        extraSettings.includes('Prettier')
      ) {
        PackageManager.addPrettier(projectName, pkgManager);
        PackageManager.attachLinterWithPrettier(projectName, pkgManager);
        PackageManager.addEslint(projectName, projectName);
      }
      if (extraSettings.includes('ESLint')) {
        PackageManager.addEslint(projectName, projectName);
      }
      if (extraSettings.includes('Prettier')) {
        PackageManager.addPrettier(projectName, projectName);
      }
    }
    console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
  }

  static initTypeScript(projectName: string): void {
    execSync(`cd ${projectName} && npx tsc --init`);
  }

  static createSourceFolder(projectName: string, typeScript: boolean): void {
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
}

export default ProjectGenerator;
