import fs from 'fs';
import { execSync } from 'child_process';
import PackageManager from './package_manager';

class ProjectGenerator {
  static handleProjectSettings(
    projectName: string,
    pkgManager: string,
    typeScript: boolean,
    extraSettings?: Array<string>
  ): void {
    PackageManager.initPackage(projectName, pkgManager);

    if (typeScript) {
      PackageManager.installTsDependencies(pkgManager, projectName);
      ProjectGenerator.initTypeScript(projectName);
    }

    ProjectGenerator.createSourceFolder(projectName, typeScript);
    PackageManager.createInitialScripts(pkgManager, projectName, typeScript);

    if (extraSettings) {
      if (
        extraSettings.includes('ESLint') &&
        extraSettings.includes('Prettier')
      ) {
        PackageManager.addPrettier(projectName, pkgManager);
        PackageManager.attachLinterWithPrettier(projectName, pkgManager);
        PackageManager.addEslint(projectName, pkgManager);
      }
      if (extraSettings.includes('ESLint')) {
        PackageManager.addEslint(projectName, pkgManager);
      }
      if (extraSettings.includes('Prettier')) {
        PackageManager.addPrettier(projectName, pkgManager);
      }
      if (extraSettings.includes('dotenv')) {
        PackageManager.addDotenv(projectName, pkgManager, typeScript);
      }
    }
    console.log(`🎊🎉 Ready!\n🚀 cd ${projectName} && ${pkgManager} start`);
  }

  static initTypeScript(projectName: string): void {
    execSync(`cd ${projectName} && npx tsc --init`);
  }

  static createSourceFolder(projectName: string, typeScript: boolean): void {
    console.log('🗂  Creating Folders');
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
