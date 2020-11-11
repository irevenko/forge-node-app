import fs from 'fs';
import ora from 'ora';
import chalk from 'chalk';
import { execSync } from 'child_process';
import PackageManager from './package_manager';
import {
  mochaChaiCommonFile,
  mochaChaiESFile,
  defaultBabelFile,
  defaultJsFile,
  defaultTsFile,
  jestCommonFile,
  jestESFile,
  jestConfig,
} from '../config/misc';

class ProjectGenerator {
  static handleProjectSettings(
    projectName: string,
    pkgManager: string,
    pkgQuestions: string,
    eslintQuestions: string,
    typeScript: boolean,
    babel: boolean,
    extraSettings?: Array<string>,
    extraOptions?: Array<string>,
    tests?: string
  ): void {
    PackageManager.initPackage(projectName, pkgManager, pkgQuestions);

    if (typeScript) {
      PackageManager.installTsDependencies(pkgManager, projectName);
      ProjectGenerator.initTypeScript(projectName);
    }

    if (babel) {
      PackageManager.addBabel(projectName, pkgManager);
    }

    if (extraOptions) {
      if (extraOptions.includes('git')) {
        ProjectGenerator.initGit(projectName);
      }
      if (extraOptions.includes('README')) {
        ProjectGenerator.addReadme(projectName);
      }
      if (extraOptions.includes('License')) {
        ProjectGenerator.addLicense(projectName);
      }
    }

    ProjectGenerator.createSourceFolder(projectName, typeScript, babel);
    PackageManager.addPackageDetails(projectName);
    PackageManager.createScripts(
      projectName,
      typeScript,
      babel,
      extraSettings,
      tests
    );

    if (tests === 'Jest') {
      ProjectGenerator.createTestsFolder(projectName, typeScript, babel, tests);
      PackageManager.addJest(projectName, pkgManager, typeScript, babel);
    }

    if (tests === 'Mocha + Chai') {
      ProjectGenerator.createTestsFolder(projectName, typeScript, babel, tests);
      PackageManager.addMochaChai(projectName, pkgManager, typeScript, babel);
    }

    if (extraSettings) {
      if (extraSettings.includes('Prettier')) {
        PackageManager.addPrettier(projectName, pkgManager);
      }
      if (
        extraSettings.includes('ESLint') &&
        extraSettings.includes('Prettier')
      ) {
        PackageManager.attachLinterWithPrettier(projectName, pkgManager);
      }
      if (extraSettings.includes('ESLint') && babel) {
        PackageManager.attachLinterWithBabel(projectName, pkgManager);
      }
      if (extraSettings.includes('ESLint')) {
        PackageManager.addEslint(
          projectName,
          pkgManager,
          eslintQuestions,
          typeScript,
          babel,
          extraSettings.includes('Prettier')
        );
      }
      if (extraSettings.includes('dotenv')) {
        PackageManager.addDotenv(projectName, pkgManager, typeScript, babel);
      }
      if (extraSettings.includes('nodemon or ts-node-dev')) {
        PackageManager.addChangesMonitor(projectName, pkgManager, typeScript);
      }
    }

    console.log(chalk.greenBright('🎉 Ready!'));
    console.log(
      chalk.greenBright(`🚀 cd ${projectName} && ${pkgManager} start`)
    );
  }

  static initTypeScript(projectName: string): void {
    execSync(`cd ${projectName} && npx tsc --init`, { stdio: 'ignore' });
  }

  static createSourceFolder(
    projectName: string,
    typeScript: boolean,
    babel: boolean
  ): void {
    const srcSpinner = ora('📂 Creating Source Folder...').start();

    fs.mkdirSync(`${projectName}/src`, { recursive: true });

    typeScript
      ? fs.writeFileSync(`${projectName}/src/index.ts`, defaultTsFile)
      : fs.writeFileSync(`${projectName}/src/index.js`, defaultJsFile);

    if (babel) {
      fs.writeFileSync(`${projectName}/src/index.js`, defaultBabelFile);
    }

    srcSpinner.succeed('📂 Created Source Folder');
  }

  static createTestsFolder(
    projectName: string,
    typeScript: boolean,
    babel: boolean,
    testingFramework: string
  ): void {
    const srcSpinner = ora('📂 Creating Tests Folder...').start();

    fs.mkdirSync(`${projectName}/__tests__`, { recursive: true });

    // eslint-disable-next-line default-case
    switch (testingFramework) {
      case 'Jest':
        if (typeScript) {
          fs.writeFileSync(
            `${projectName}/__tests__/index.test.ts`,
            jestESFile
          );
        } else if (babel) {
          fs.writeFileSync(
            `${projectName}/__tests__/index.test.js`,
            jestESFile
          );
          fs.writeFileSync(`./${projectName}/jest.config.js`, jestConfig);
        } else {
          fs.writeFileSync(
            `${projectName}/__tests__/index.test.js`,
            jestCommonFile
          );
          fs.writeFileSync(`${projectName}/jest.config.js`, jestConfig);
        }
        break;
      case 'Mocha + Chai':
        if (typeScript) {
          fs.writeFileSync(
            `${projectName}/__tests__/index.spec.ts`,
            mochaChaiESFile
          );
        } else if (babel) {
          fs.writeFileSync(
            `${projectName}/__tests__/index.spec.js`,
            mochaChaiESFile
          );
        } else {
          fs.writeFileSync(
            `${projectName}/__tests__/index.spec.js`,
            mochaChaiCommonFile
          );
        }
    }

    srcSpinner.succeed('📂 Created Tests Folder');
  }

  static initGit(projectName: string): void {
    const srcSpinner = ora('📚 Initializing git...').start();

    execSync(`cd ${projectName} && git init`, { stdio: 'ignore' });

    srcSpinner.succeed('📚 Initialized git');
  }

  static addReadme(projectName: string): void {
    const srcSpinner = ora('📄 Adding README...').start();

    fs.writeFileSync(`${projectName}/README.md`, '');

    srcSpinner.succeed('📄 Added README');
  }

  static addLicense(projectName: string): void {
    const srcSpinner = ora('📜 Adding License...').start();

    // run npx license

    srcSpinner.succeed('📜 Added License');
  }
}

export default ProjectGenerator;
