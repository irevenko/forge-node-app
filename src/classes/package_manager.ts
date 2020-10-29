import fs from 'fs';
import ora from 'ora';
import { execSync, spawn } from 'child_process';
import { IPackage } from '../interfaces';
import {
  eslintDependencies,
  lintFormatDependencies,
  tsDependencies,
} from '../config/dependencies';
import {
  dotenvJsFile,
  dotenvFile,
  dotenvTsFile,
  prettierConfig,
} from '../config/misc';

class PackageManager {
  static initPackage(projectName: string, pkgManager: string): void {
    const packageSpinner = ora('🔨 Initializing The Package...').start();

    fs.mkdirSync(projectName);
    execSync(`cd ${projectName} && ${pkgManager} init -y`, { stdio: 'ignore' });

    packageSpinner.succeed('🔨 Initialized The Package');
  }

  static createScripts(
    projectName: string,
    typeScript: boolean,
    extraSettings?: Array<string>
  ): void {
    const scriptsSpinner = ora('📜 Creating Scripts...').start();

    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    pkgJSON.scripts = {};

    typeScript
      ? (pkgJSON.scripts.start = 'ts-node src/index.ts')
      : (pkgJSON.scripts.start = 'node src/index.js');

    typeScript ? (pkgJSON.main = 'index.ts') : (pkgJSON.main = 'index.js');

    if (typeScript) {
      pkgJSON.scripts.build = 'tsc';
      pkgJSON.scripts.watch = 'tsc src/*.ts --watch';
      pkgJSON.scripts['start:source'] = 'tsc && node out/index.js';
    }

    if (extraSettings!.includes('ESLint')) {
      typeScript
        ? (pkgJSON.scripts.lint = 'eslint src/*.ts')
        : (pkgJSON.scripts.lint = 'eslint src/*.js');
      typeScript
        ? (pkgJSON.scripts['lint:fix'] = 'eslint src/*.ts --fix')
        : (pkgJSON.scripts['lint:fix'] = 'eslint src/*.js --fix');
    }

    if (extraSettings!.includes('Prettier')) {
      typeScript
        ? (pkgJSON.scripts.format = "prettier 'src/*.ts' --write")
        : (pkgJSON.scripts.format = "prettier 'src/*.js' --write");
    }

    if (extraSettings!.includes('nodemon || ts-node-dev')) {
      typeScript
        ? (pkgJSON.scripts.dev = 'ts-node-dev src/')
        : (pkgJSON.scripts.dev = 'nodemon src/');
    }

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    scriptsSpinner.succeed('📜 Created Scripts');
  }

  static addPackageDetails(projectName: string): void {
    const scriptsSpinner = ora('📋 Adding Package Details...').start();

    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    pkgJSON.description = '<YOUR DESCRIPTION>';
    pkgJSON.author = '<YOUR CREDENTIALS>';
    pkgJSON.keywords = ['key', 'words'];

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    scriptsSpinner.succeed('📋 Added Package Details');
  }

  static installTsDependencies(pkgManager: string, projectName: string): void {
    const tsSpinner = ora('📥 Setting Up TypeScript...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${tsDependencies}`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${tsDependencies}`, {
        stdio: 'ignore',
      });
    }

    tsSpinner.succeed('📥 Set Up TypeScript');
  }

  static addEslint(projectName: string, pkgManager: string): void {
    const linterSpinner = ora('🔎 Adding ESLint...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${eslintDependencies} -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${eslintDependencies} -D`, {
        stdio: 'ignore',
      });
    }

    linterSpinner.succeed('🔎 Added ESLint');
    process.chdir(projectName); // Beacuse execSync does not change dir directly
    spawn('npx', ['eslint', '--init'], { stdio: 'inherit' });
  }

  static addPrettier(projectName: string, pkgManager: string): void {
    const prettierSpinner = ora('🧹 Adding Prettier...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i prettier -D`, { stdio: 'ignore' });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add prettier -D`, {
        stdio: 'ignore',
      });
    }

    fs.writeFileSync(`./${projectName}/.prettierrc`, prettierConfig);

    prettierSpinner.succeed('🧹 Added Prettier');
  }

  static attachLinterWithPrettier(
    projectName: string,
    pkgManager: string
  ): void {
    const linterPrettierSpinner = ora(
      '🖇 Connecting ESLint with Prettier...'
    ).start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i ${lintFormatDependencies} -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add ${lintFormatDependencies} -D`, {
        stdio: 'ignore',
      });
    }

    linterPrettierSpinner.succeed('🖇 Connected ESLint with Prettier');
  }

  static addDotenv(
    projectName: string,
    pkgManager: string,
    typeScript: boolean
  ): void {
    const dotenvSpinner = ora('🔒 Adding Dotenv...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i dotenv -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add dotenv -D`, {
        stdio: 'ignore',
      });
    }

    fs.writeFileSync(`./${projectName}/.env`, dotenvFile);
    typeScript
      ? fs.writeFileSync(`./${projectName}/src/index.ts`, dotenvTsFile)
      : fs.writeFileSync(`./${projectName}/src/index.js`, dotenvJsFile);

    dotenvSpinner.succeed('🔒 Added Dotenv');
  }

  static addChangesMonitor(
    projectName: string,
    pkgManager: string,
    typeScript: boolean
  ): void {
    const nodemonSpinner = ora('🔁 Adding Changes Montitor...').start();

    if (pkgManager === 'npm') {
      typeScript
        ? execSync(`cd ${projectName} && npm i ts-node-dev -D`, {
            stdio: 'ignore',
          })
        : execSync(`cd ${projectName} && npm i nodemon -D`, {
            stdio: 'ignore',
          });
    }
    if (pkgManager === 'yarn') {
      typeScript
        ? execSync(`cd ${projectName} && yarn add ts-node-dev -D`, {
            stdio: 'ignore',
          })
        : execSync(`cd ${projectName} && yarn add nodemon -D`, {
            stdio: 'ignore',
          });
    }

    nodemonSpinner.succeed('🔁 Added Changes Monitor');
  }
}

export default PackageManager;
