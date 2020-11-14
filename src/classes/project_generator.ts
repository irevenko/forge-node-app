import fs from 'fs';
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
    repositoryName?: string
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
          eslintConfig!,
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

  static initGit(
    projectName: string,
    hostingPlatform: string,
    platformUsername: string,
    repositoryName: string
  ): void {
    const srcSpinner = ora('📚 Initializing git...').start();

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

    srcSpinner.succeed('📚 Initialized git');
  }

  static addReadme(projectName: string): void {
    const srcSpinner = ora('📄 Creating README...').start();

    fs.writeFileSync(`${projectName}/README.md`, `# ${projectName}`);

    srcSpinner.succeed('📄 Created README');
  }

  static addLicense(
    projectName: string,
    licenseType: string,
    licenseAuthor: string
  ): void {
    const srcSpinner = ora('📜 Creating License...').start();

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

    srcSpinner.succeed('📜 Created License');
  }
}

export default ProjectGenerator;
