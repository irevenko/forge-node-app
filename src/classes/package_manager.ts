/* eslint-disable no-lonely-if */
/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { execSync } from 'child_process';
import { IPackage } from '../interfaces';
import {
  babelDependencies,
  babelLinterDependencies,
  eslintDependencies,
  eslintTsDependencies,
  lintAirBnbDependencies,
  lintFormatDependencies,
  lintGoogleDependencies,
  lintStandardDependencies,
  tsDependencies,
} from '../config/dependencies';
import {
  babelConfig,
  dotenvCommonFile,
  dotenvESFile,
  dotenvFile,
  eslintIgnore,
  prettierConfig,
  prettierIgnore,
} from '../config/misc';
import esLint, { ESLintSpecificConfig } from '../config/eslint/index.eslint';
import { IPackageManager } from '../package_managers';
import { PackageInstallationType } from '../package_managers/base';

class PackageManager {
  static initPackage(
    projectName: string,
    pkgManager: IPackageManager,
    pkgQuestions: string
  ): void {
    const packageSpinner = ora(
      `🔨 Initializing The Package with ${pkgManager.type}...`
    ).start();

    fs.mkdirSync(projectName);

    const goWithDefault = pkgQuestions !== 'Go with defaults';
    pkgManager.init({
      cwd: path.join(process.cwd(), projectName),
      interactive: goWithDefault,
      stdio: goWithDefault ? 'ignore' : 'inherit',
    });

    packageSpinner.succeed(`🔨 Initialized The Package with ${pkgManager.type}`);
  }

  static createScripts(
    projectName: string,
    typeScript: boolean,
    babel: boolean,
    extraLibs?: Array<string>,
    tests?: string
  ): void {
    const scriptsSpinner = ora('📜 Creating Scripts...').start();

    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    pkgJSON.scripts = {};

    if (typeScript) {
      pkgJSON.scripts.start = 'npx ts-node src/index.ts';
    } else if (babel) {
      pkgJSON.scripts.start = 'npx babel-node src/index.js';
    } else {
      pkgJSON.scripts.start = 'node src/index.js';
    }

    typeScript ? (pkgJSON.main = 'index.ts') : (pkgJSON.main = 'index.js');

    if (typeScript) {
      pkgJSON.scripts['start:source'] = 'npx tsc && node out/index.ts';
      pkgJSON.scripts.build = 'npx tsc';
      pkgJSON.scripts.watch = 'npx tsc src/index.ts --watch';
    }

    if (babel) {
      pkgJSON.scripts['start:source'] = 'npm run build && node out/index.js';
      pkgJSON.scripts.build =
        'npx babel src -d out --presets @babel/preset-env';
      pkgJSON.scripts.watch =
        'npx babel src -d out --presets @babel/preset-env -w';
    }

    if (tests === 'Jest') {
      pkgJSON.scripts.test = 'npx jest';
    }

    if (tests === 'Mocha + Chai') {
      if (typeScript) {
        pkgJSON.scripts.test =
          'npx mocha __tests__/**/*.ts -r ts-node/register';
      } else if (babel) {
        pkgJSON.scripts.test =
          'npx mocha __tests__/**/*.js --require @babel/register --require @babel/polyfill';
      } else {
        pkgJSON.scripts.test = 'npx mocha __tests__/**/*.js';
      }
    }

    if (extraLibs!.includes('ESLint')) {
      typeScript
        ? (pkgJSON.scripts.lint = 'npx eslint src/*.ts')
        : (pkgJSON.scripts.lint = 'npx eslint src/*.js');
      typeScript
        ? (pkgJSON.scripts['lint:fix'] = 'npx eslint src/*.ts --fix')
        : (pkgJSON.scripts['lint:fix'] = 'npx eslint src/*.js --fix');
    }

    if (extraLibs!.includes('Prettier')) {
      typeScript
        ? (pkgJSON.scripts.format = 'npx prettier src/*.ts --write')
        : (pkgJSON.scripts.format = 'npx prettier src/*.js --write');
    }

    if (extraLibs!.includes('nodemon or ts-node-dev')) {
      if (typeScript) {
        pkgJSON.scripts.dev = 'npx ts-node-dev --respawn src/index';
      } else if (babel) {
        pkgJSON.scripts.dev = 'npx nodemon --exec babel-node src/index';
      } else {
        pkgJSON.scripts.dev = 'npx nodemon src/index';
      }
    }

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    scriptsSpinner.succeed('📜 Created Scripts');
  }

  static addPackageDetails(
    projectName: string,
    licenseType?: string,
    licenseAuthor?: string,
    git?: boolean,
    hostingPLatform?: string,
    platformUsername?: string,
    repositoryName?: string
  ): void {
    const detailsSpinner = ora('📋 Creating Package Details...').start();

    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    pkgJSON.description = 'YOUR DESCRIPTION';
    pkgJSON.license = licenseType || 'YOUR LICENSE';
    pkgJSON.author = licenseAuthor || 'YOUR NAME <YOUR EMAIL>';
    pkgJSON.keywords = ['key', 'words'];

    if (git) {
      pkgJSON.repository = {
        type: 'git',
        url: `https://${hostingPLatform!.toLowerCase()}.com/${platformUsername}/${repositoryName}`,
      };
      pkgJSON.bugs = {
        url: `https://${hostingPLatform!.toLowerCase()}.com/${platformUsername}/${repositoryName}/issues`,
      };
    }

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    detailsSpinner.succeed('📋 Created Package Details');
  }

  static installTsDependencies(
    pkgManager: IPackageManager,
    projectName: string
  ): void {
    const tsSpinner = ora('📥 Setting Up TypeScript...').start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: tsDependencies,
    });

    tsSpinner.succeed('📥 Set Up TypeScript');
  }

  static addBabel(projectName: string, pkgManager: IPackageManager): void {
    const babelSpinner = ora('🐠 Adding Babel...').start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: babelDependencies,
    });

    fs.writeFileSync(`${projectName}/.babelrc`, babelConfig);

    babelSpinner.succeed('🐠 Added Babel');
  }

  private static addEslintSpecificConfig(
    projectName: string,
    pkgManager: IPackageManager,
    dependencies: string | undefined,
    eslintStyle: ESLintSpecificConfig,
    typeScript: boolean,
    babel: boolean,
    prettier: boolean
  ): void {
    let eslintJsonConfig;
    if (typeScript && prettier) {
      eslintJsonConfig = eslintStyle.tsPretty;
    } else if (typeScript) {
      eslintJsonConfig = eslintStyle.ts;
    } else if (babel && prettier) {
      eslintJsonConfig = eslintStyle.babelPretty;
    } else if (babel) {
      eslintJsonConfig = eslintStyle.babel;
    } else if (prettier) {
      eslintJsonConfig = eslintStyle.jsPretty;
    } else {
      eslintJsonConfig = eslintStyle.js;
    }

    fs.writeFileSync(
      `${projectName}/.eslintrc.json`,
      JSON.stringify(eslintJsonConfig, null, 2)
    );
    if (dependencies) {
      pkgManager.install({
        cwd: path.join(process.cwd(), projectName),
        type: PackageInstallationType.DEV_DEPENDENCIES,
        stdio: 'ignore',
        packageName: dependencies,
      });
    }
  }

  static addEslint(
    projectName: string,
    pkgManager: IPackageManager,
    eslintConfig: string,
    typeScript: boolean,
    babel: boolean,
    prettier: boolean
  ): void {
    const linterSpinner = ora('🔎 Adding ESLint...').start();

    fs.writeFileSync(`${projectName}/.eslintignore`, eslintIgnore);

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: `${eslintDependencies}${
        typeScript ? ` ${eslintTsDependencies}` : ''
      }`,
    });

    let eslintSpecificConfig: ESLintSpecificConfig | undefined;
    let eslintSpecificDependencies: string | undefined;

    switch (eslintConfig) {
      case 'Only Errors':
        eslintSpecificConfig = esLint;
        break;
      case 'AirBNB':
        eslintSpecificConfig = esLint.airBnb;
        eslintSpecificDependencies = lintAirBnbDependencies;
        break;
      case 'Google':
        eslintSpecificConfig = esLint.google;
        eslintSpecificDependencies = lintGoogleDependencies;
        break;
      case 'Standard':
        eslintSpecificConfig = esLint.standard;
        eslintSpecificDependencies = lintStandardDependencies;
        break;
    }

    if (eslintSpecificConfig) {
      PackageManager.addEslintSpecificConfig(
        projectName,
        pkgManager,
        eslintSpecificDependencies,
        eslintSpecificConfig,
        typeScript,
        babel,
        prettier
      );
    }

    linterSpinner.succeed('🔎 Added ESLint');
  }

  static addPrettier(projectName: string, pkgManager: IPackageManager): void {
    const prettierSpinner = ora('🧹 Adding Prettier...').start();

    fs.writeFileSync(`${projectName}/.prettierignore`, prettierIgnore);
    fs.writeFileSync(`${projectName}/.prettierrc`, prettierConfig);

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: 'prettier',
    });

    prettierSpinner.succeed('🧹 Added Prettier');
  }

  static attachLinterWithPrettier(
    projectName: string,
    pkgManager: IPackageManager
  ): void {
    const linterPrettierSpinner = ora(
      '🖇 Connecting ESLint with Prettier...'
    ).start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: lintFormatDependencies,
    });

    linterPrettierSpinner.succeed('🖇 Connected ESLint with Prettier');
  }

  static attachLinterWithBabel(
    projectName: string,
    pkgManager: IPackageManager
  ): void {
    const linterPrettierSpinner = ora(
      '🖇 Connecting ESLint with Babel...'
    ).start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: babelLinterDependencies,
    });

    linterPrettierSpinner.succeed('🖇 Connected ESLint with Babel');
  }

  static addDotenv(
    projectName: string,
    pkgManager: IPackageManager,
    typeScript: boolean,
    babel: boolean
  ): void {
    const dotenvSpinner = ora('🔒 Adding Dotenv...').start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: 'dotenv',
    });

    fs.writeFileSync(`${projectName}/.env`, dotenvFile);

    if (typeScript) {
      fs.appendFileSync(`${projectName}/src/index.ts`, dotenvESFile);
    } else if (babel) {
      fs.appendFileSync(`${projectName}/src/index.js`, dotenvESFile);
    } else {
      fs.appendFileSync(`${projectName}/src/index.js`, dotenvCommonFile);
    }

    dotenvSpinner.succeed('🔒 Added Dotenv');
  }

  static addChangesMonitor(
    projectName: string,
    pkgManager: IPackageManager,
    typeScript: boolean
  ): void {
    const nodemonSpinner = ora('🔁 Adding Changes Montitor...').start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: typeScript ? 'ts-node-dev' : 'nodemon',
    });

    nodemonSpinner.succeed('🔁 Added Changes Monitor');
  }

  static addJest(
    projectName: string,
    pkgManager: IPackageManager,
    typeScript: boolean,
    babel: boolean
  ): void {
    const jestSpinner = ora('🃏 Adding Jest...').start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: `jest${typeScript ? ' @types/jest ts-jest' : ''}${
        babel ? ' jest-babel' : ''
      }`,
    });

    if (typeScript) {
      execSync(`cd ${projectName} && npx ts-jest config:init`, {
        stdio: 'ignore',
      });
      fs.renameSync(
        `${projectName}/jest.config.js`,
        `${projectName}/jest.config.ts`
      );
    }

    jestSpinner.succeed('🃏 Added Jest');
  }

  static addMochaChai(
    projectName: string,
    pkgManager: IPackageManager,
    typeScript: boolean,
    babel: boolean
  ): void {
    const mochaChaiSpinner = ora('🍵 Adding Mocha & Chai...').start();

    pkgManager.install({
      cwd: path.join(process.cwd(), projectName),
      type: PackageInstallationType.DEV_DEPENDENCIES,
      stdio: 'ignore',
      packageName: `jest mocha chai${
        typeScript ? ' @types/mocha @types/chai' : ''
      }${babel ? ' @babel/register @babel/polyfill' : ''}`,
    });

    mochaChaiSpinner.succeed('🍵 Added Mocha & Chai');
  }
}

export default PackageManager;
