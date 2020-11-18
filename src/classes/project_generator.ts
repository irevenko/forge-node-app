import fs from 'fs';
import { homedir } from 'os';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { getLicense } from 'license';
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
import tsConfig from '../config/ts_config';
import { IPreset } from '../interfaces';

class ProjectGenerator {
  static handleProjectSettings(
    projectName: string,
    pkgManager: string,
    pkgQuestions: string,
    typeScript: boolean,
    babel: boolean,
    eslintConfig?: string,
    extraSettings?: Array<string>,
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
      extraOptions?.includes('git'),
      hostingPlatform,
      platformUsername,
      repositoryName
    );
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

    if (extraSettings!.includes('Prettier')) {
      PackageManager.addPrettier(projectName, pkgManager);
    }
    if (
      extraSettings!.includes('ESLint') &&
      extraSettings!.includes('Prettier')
    ) {
      PackageManager.attachLinterWithPrettier(projectName, pkgManager);
    }
    if (extraSettings!.includes('ESLint') && babel) {
      PackageManager.attachLinterWithBabel(projectName, pkgManager);
    }
    if (extraSettings!.includes('ESLint')) {
      PackageManager.addEslint(
        projectName,
        pkgManager,
        eslintConfig!,
        typeScript,
        babel,
        extraSettings!.includes('Prettier')
      );
    }
    if (extraSettings!.includes('dotenv')) {
      PackageManager.addDotenv(projectName, pkgManager, typeScript, babel);
    }
    if (extraSettings!.includes('nodemon or ts-node-dev')) {
      PackageManager.addChangesMonitor(projectName, pkgManager, typeScript);
    }

    if (savePreset) {
      ProjectGenerator.savePreset(presetName!);
    }

    console.log(chalk.greenBright('🎉 Ready!'));
    console.log(
      chalk.greenBright(`🚀 cd ${projectName} && ${pkgManager} start`)
    );

    if (extraOptions?.includes('git')) {
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

    // eslint-disable-next-line default-case
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

    // eslint-disable-next-line default-case
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

  static savePreset(presetName: string): void {
    const savePresetSpinner = ora('Saving preset...').start();

    if (!fs.existsSync(path.join(homedir(), '.forge-node-app-rc'))) {
      fs.writeFileSync(path.join(homedir(), '.forge-node-app-rc'), '{\n}');
    } else {
      const presetsConfig: { [key: string]: any } = JSON.parse(
        fs.readFileSync(`${path.join(homedir())}/.forge-node-app-rc`, 'utf-8')
      );

      presetsConfig[presetName] = {};

      fs.writeFileSync(
        path.join(homedir(), '.forge-node-app-rc'),
        JSON.stringify(presetsConfig, null, 2)
      );
    }

    savePresetSpinner.succeed('Saved preset');
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
    const presetProjectSpinner = ora(
      `Generating app using ${presetName} preset...`
    ).start();

    // read preset file and ProjectGenerator.handleProjectSettings using specific preset

    presetProjectSpinner.succeed(`Generated app using ${presetName} preset`);
  }

  static handleProjectWithDefaultPreset(presetName: string): void {
    const presetProjectSpinner = ora(
      `Generating app using ${presetName}`
    ).start();

    // eslint-disable-next-line default-case
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

    presetProjectSpinner.succeed(`Generated app using ${presetName}`);
  }
}

export default ProjectGenerator;
