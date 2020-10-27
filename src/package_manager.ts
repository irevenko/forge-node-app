import fs from 'fs';
import ora from 'ora';
import { execSync, spawn } from 'child_process';
import { IPackage } from './interfaces';

class PackageManager {
  static initPackage(projectName: string, pkgManager: string): void {
    const packageSpinner = ora('🔨 Initializing The Package...').start();

    fs.mkdirSync(projectName);
    execSync(`cd ${projectName} && ${pkgManager} init -y`, { stdio: 'ignore' });

    packageSpinner.succeed('🔨 Initialized The Package');
  }

  static createInitialScripts(projectName: string, typeScript: boolean): void {
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
    }

    fs.writeFileSync(
      `${projectName}/package.json`,
      JSON.stringify(pkgJSON, null, 2)
    );

    scriptsSpinner.succeed('📜 Created Scripts');
  }

  static installTsDependencies(pkgManager: string, projectName: string): void {
    const tsSpinner = ora('📥 Setting Up TypeScript...').start();

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i typescript ts-node @types/node -D`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(
        `cd ${projectName} && yarn add typescript ts-node @types/node -D`,
        { stdio: 'ignore' }
      );
    }

    tsSpinner.succeed('📥 Set Up TypeScript');
  }

  static addEslint(projectName: string, pkgManager: string): void {
    const linterSpinner = ora('🔎 Adding ESLint...').start();

    if (pkgManager === 'npm') {
      execSync(
        `cd ${projectName} && npm i eslint eslint-config-node eslint-plugin-node -D`,
        { stdio: 'ignore' }
      );
    }
    if (pkgManager === 'yarn') {
      execSync(
        `cd ${projectName} && yarn add eslint eslint-config-node eslint-plugin-node -D`,
        { stdio: 'ignore' }
      );
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

    fs.writeFileSync(
      `./${projectName}/.prettierrc`,
      '{\n\t"singleQuote": true\n}'
    );

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
      execSync(
        `cd ${projectName} && npm i eslint-config-prettier eslint-plugin-prettier -D`,
        { stdio: 'ignore' }
      );
    }
    if (pkgManager === 'yarn') {
      execSync(
        `cd ${projectName} && yarn add eslint-config-prettier eslint-plugin-prettier -D`,
        { stdio: 'ignore' }
      );
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
      execSync(`cd ${projectName} && npm i dotenv --save`, {
        stdio: 'ignore',
      });
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add dotenv --save`, {
        stdio: 'ignore',
      });
    }

    fs.writeFileSync(`./${projectName}/.env`, 'MSG=HelloWorld');
    typeScript
      ? fs.writeFileSync(
          `./${projectName}/src/index.ts`,
          "import 'dotenv/config'\nconsole.log(process.env.MSG);"
        )
      : fs.writeFileSync(
          `./${projectName}/src/index.js`,
          "require('dotenv').config()\nconsole.log(process.env.MSG);"
        );

    dotenvSpinner.succeed('🔒 Added Dotenv');
  }
}

export default PackageManager;
