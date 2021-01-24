import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getLicense } from 'license';
import { execSync } from 'child_process';
import PackageManager from './package_manager';
import { IPackageManager, factory } from '../package_managers';
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
import tsConfig from '../config/ts_config';
import { IPreset, IAnswers } from '../interfaces';

class ProjectGenerator {
  static handleProjectSettings(
    projectName: string,
    pkgManagerName: string,
    pkgQuestions: string,
    typeScript: boolean,
    babel: boolean,
    eslintConfig?: string,
    extraLibs?: Array<string>,
    extraOptions?: Array<string>,
    tests?: string,
    licenseType?: string,
    licenseAuthor?: string,
    hostingPlatform?: string,
    platformUsername?: string,
    repositoryName?: string,
    savePreset?: boolean,
    presetName?: string
  ): void {
    const packageManager: IPackageManager = factory(pkgManagerName);
    PackageManager.initPackage(projectName, packageManager, pkgQuestions);

    if (typeScript) {
      PackageManager.installTsDependencies(packageManager, projectName);
      ProjectGenerator.initTypeScript(projectName);
    }

    if (babel) {
      PackageManager.addBabel(projectName, packageManager);
    }

    if (extraOptions) {
      if (extraOptions.includes('git')) {
        ProjectGenerator.initGit(
          projectName,
          hostingPlatform!,
          platformUsername!,
          repositoryName!
        );
      }
      if (extraOptions.includes('README')) {
        ProjectGenerator.addReadme(projectName);
      }
      if (extraOptions.includes('LICENSE')) {
        ProjectGenerator.addLicense(projectName, licenseType!, licenseAuthor!);
      }
    }

    ProjectGenerator.createSourceFolder(projectName, typeScript, babel);
    PackageManager.addPackageDetails(
      projectName,
      licenseType!,
      licenseAuthor!,
      extraOptions!.includes('git'),
      hostingPlatform,
      platformUsername,
      repositoryName
    );
    PackageManager.createScripts(
      projectName,
      typeScript,
      babel,
      extraLibs,
      tests
    );

    if (tests === 'Jest') {
      ProjectGenerator.createTestsFolder(projectName, typeScript, babel, tests);
      PackageManager.addJest(projectName, packageManager, typeScript, babel);
    }

    if (tests === 'Mocha + Chai') {
      ProjectGenerator.createTestsFolder(projectName, typeScript, babel, tests);
      PackageManager.addMochaChai(
        projectName,
        packageManager,
        typeScript,
        babel
      );
    }

    if (extraLibs!.includes('Prettier')) {
      PackageManager.addPrettier(projectName, packageManager);
    }
    if (extraLibs!.includes('ESLint') && extraLibs!.includes('Prettier')) {
      PackageManager.attachLinterWithPrettier(projectName, packageManager);
    }
    if (extraLibs!.includes('ESLint') && babel) {
      PackageManager.attachLinterWithBabel(projectName, packageManager);
    }
    if (extraLibs!.includes('ESLint')) {
      PackageManager.addEslint(
        projectName,
        packageManager,
        eslintConfig!,
        typeScript,
        babel,
        extraLibs!.includes('Prettier')
      );
    }
    if (extraLibs!.includes('dotenv')) {
      PackageManager.addDotenv(projectName, packageManager, typeScript, babel);
    }
    if (extraLibs!.includes('nodemon or ts-node-dev')) {
      PackageManager.addChangesMonitor(projectName, packageManager, typeScript);
    }

    if (savePreset) {
      ProjectGenerator.savePreset(presetName!, {
        projectName,
        pkgManager: pkgManagerName,
        pkgQuestions,
        typeScript,
        babel,
        eslintConfig,
        extraLibs,
        extraOptions,
        tests,
        licenseType,
        licenseAuthor,
        hostingPlatform,
        platformUsername,
        repositoryName,
      });
    }

    console.log(chalk.greenBright('🎉 Ready!'));
    console.log(
      chalk.greenBright(`🚀 cd ${projectName} && ${pkgManagerName} start`)
    );

    if (extraOptions!.includes('git')) {
      console.log(chalk.redBright('Dont forget to create repo at:'));
      console.log(
        chalk.cyanBright(
          `https://${hostingPlatform!.toLowerCase()}.com/${platformUsername}/${repositoryName}`
        )
      );
      console.log(
        chalk.redBright('Do not forget to push your files to the repo')
      );
      console.log(
        chalk.cyanBright('git add . && git commit -m "Initial commit"')
      );
      console.log(chalk.cyanBright('git push origin master'));
    }
  }

  static initTypeScript(projectName: string): void {
    execSync(`cd ${projectName} && npx tsc --init`, { stdio: 'ignore' });
    fs.writeFileSync(
      `${projectName}/tsconfig.json`,
      JSON.stringify(tsConfig, null, 2)
    );
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
    const testsSpinner = ora('📂 Creating Tests Folder...').start();

    fs.mkdirSync(`${projectName}/__tests__`, { recursive: true });

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

    testsSpinner.succeed('📂 Created Tests Folder');
  }

  static initGit(
    projectName: string,
    hostingPlatform: string,
    platformUsername: string,
    repositoryName: string
  ): void {
    const gitSpinner = ora('📚 Initializing git...').start();

    execSync(`cd ${projectName} && git init`, { stdio: 'ignore' });

    switch (hostingPlatform) {
      case 'GitHub':
        execSync(
          `cd ${projectName} && git remote add origin https://github.com/${platformUsername}/${repositoryName}.git`,
          { stdio: 'ignore' }
        );
        break;
      case 'GitLab':
        execSync(
          `cd ${projectName} && git remote add origin https://gitlab.com/${platformUsername}/${repositoryName}.git`,
          { stdio: 'ignore' }
        );
        break;
    }

    execSync(`cd ${projectName} && npx gitignore node`, { stdio: 'ignore' });

    gitSpinner.succeed('📚 Initialized git');
  }

  static addReadme(projectName: string): void {
    const readmeSpinner = ora('📄 Creating README...').start();

    fs.writeFileSync(`${projectName}/README.md`, `# ${projectName}`);

    readmeSpinner.succeed('📄 Created README');
  }

  static addLicense(
    projectName: string,
    licenseType: string,
    licenseAuthor: string
  ): void {
    const licenseSpinner = ora('📜 Creating License...').start();

    switch (licenseType) {
      case 'MIT':
        fs.writeFileSync(
          `${projectName}/LICENSE`,
          getLicense('MIT', {
            author: licenseAuthor || '<your name>',
            year: `${new Date().getFullYear()}`,
          })
        );
        break;
      case 'Apache-2.0':
        fs.writeFileSync(
          `${projectName}/LICENSE`,
          getLicense('Apache-2.0', {
            author: licenseAuthor || '<your name>',
            year: `${new Date().getFullYear()}`,
          })
        );
        break;
      case 'GPL-3.0':
        fs.writeFileSync(
          `${projectName}/LICENSE`,
          getLicense('GPL-3.0', {
            author: licenseAuthor || '<your name>',
            year: `${new Date().getFullYear()}`,
          })
        );
        break;
      case 'ISC':
        fs.writeFileSync(
          `${projectName}/LICENSE`,
          getLicense('ISC', {
            author: licenseAuthor || '<your name>',
            year: `${new Date().getFullYear()}`,
          })
        );
        break;
      case 'BSD-3-Clause':
        fs.writeFileSync(
          `${projectName}/LICENSE`,
          getLicense('BSD-3-Clause', {
            author: licenseAuthor || '<your name>',
            year: `${new Date().getFullYear()}`,
          })
        );
        break;
    }

    licenseSpinner.succeed('📜 Created License');
  }

  static savePreset(presetName: string, settings: IAnswers): void {
    const savePresetSpinner = ora('💾 Saving preset...').start();

    const {
      projectName,
      pkgManager,
      pkgQuestions,
      typeScript,
      babel,
      eslintConfig,
      extraLibs,
      extraOptions,
      tests,
      licenseType,
      licenseAuthor,
      hostingPlatform,
      platformUsername,
      repositoryName,
    } = settings;

    if (!fs.existsSync(path.join(homedir(), '.forge-node-app-rc'))) {
      fs.writeFileSync(path.join(homedir(), '.forge-node-app-rc'), '{\n}');
    }

    const presetsConfig: IPreset = JSON.parse(
      fs.readFileSync(`${path.join(homedir())}/.forge-node-app-rc`, 'utf-8')
    );

    presetsConfig[presetName] = {
      projectName,
      pkgManager,
      pkgQuestions,
      typeScript,
      babel,
      eslintConfig,
      extraLibs,
      extraOptions,
      tests,
      licenseType,
      licenseAuthor,
      hostingPlatform,
      platformUsername,
      repositoryName,
    };

    fs.writeFileSync(
      path.join(homedir(), '.forge-node-app-rc'),
      JSON.stringify(presetsConfig, null, 2)
    );

    savePresetSpinner.succeed(`💾 Saved preset: ${presetName}`);
  }

  static loadPresets(): Array<string> {
    if (!fs.existsSync(path.join(homedir(), '.forge-node-app-rc'))) {
      fs.writeFileSync(path.join(homedir(), '.forge-node-app-rc'), '{\n}');
    }

    const presets: IPreset = JSON.parse(
      fs.readFileSync(`${path.join(homedir())}/.forge-node-app-rc`, 'utf-8')
    );

    return Object.keys(presets);
  }

  static handleProjectWithCustomPreset(presetName: string): void {
    const presets: IPreset = JSON.parse(
      fs.readFileSync(`${path.join(homedir())}/.forge-node-app-rc`, 'utf-8')
    );

    ProjectGenerator.handleProjectSettings(
      presets[presetName].projectName,
      presets[presetName].pkgManager,
      presets[presetName].pkgQuestions,
      presets[presetName].typeScript,
      presets[presetName].babel,
      presets[presetName].eslintConfig,
      presets[presetName].extraLibs,
      presets[presetName].extraOptions,
      presets[presetName].tests,
      presets[presetName].licenseType,
      presets[presetName].licenseAuthor,
      presets[presetName].hostingPlatform,
      presets[presetName].platformUsername,
      presets[presetName].repositoryName
    );

    console.log(`🔧 Generated app using ${presetName} preset`);
  }

  static handleProjectWithDefaultPreset(presetName: string): void {
    switch (presetName) {
      case 'Default (yarn, TypeScript, ESLint (Errors only), Jest)':
        ProjectGenerator.handleProjectSettings(
          'node-app',
          'yarn',
          'Go with defaults',
          true,
          false,
          'Only Errors',
          ['ESLint', 'Unit Tests'],
          undefined,
          'Jest'
        );
        break;
      case 'Default (npm, JavaScript, ESLint (AirBNB), Mocha + Chai)':
        ProjectGenerator.handleProjectSettings(
          'node-app',
          'npm',
          'Go with defaults',
          false,
          false,
          'AirBNB',
          ['ESLint', 'Unit Tests'],
          undefined,
          'Mocha + Chai'
        );
        break;
      case 'Default (npm, Babel, ESLint (AirBNB), nodemon)':
        ProjectGenerator.handleProjectSettings(
          'node-app',
          'npm',
          'Go with defaults',
          false,
          true,
          'AirBNB',
          ['ESLint', 'Unit Tests', 'nodemon or ts-node-dev'],
          undefined
        );
        break;
    }
    console.log(`🔧 Generated app using ${presetName} preset`);
  }
}

export default ProjectGenerator;
