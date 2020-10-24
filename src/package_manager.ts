import fs from 'fs';
import { execSync, spawn } from 'child_process';
import { IPackage } from './interfaces';

class PackageManager {
  static initPackage(projectName: string, pkgManager: string): void {
    fs.mkdirSync(projectName);
    execSync(`cd ${projectName} && ${pkgManager} init -y`);
  }

  static createInitialScripts(
    pkgManager: string,
    projectName: string,
    typeScript: boolean
  ): void {
    const pkgJSON: IPackage = JSON.parse(
      fs.readFileSync(`${projectName}/package.json`, 'utf8')
    );

    if (pkgManager === 'npm') {
      typeScript
        ? (pkgJSON.scripts.start = 'ts-node src/index.ts')
        : (pkgJSON.scripts.start = 'node src/index.js');

      typeScript ? (pkgJSON.main = 'index.ts') : (pkgJSON.main = 'index.js');

      fs.writeFileSync(
        `${projectName}/package.json`,
        JSON.stringify(pkgJSON, null, 2)
      );
    }

    if (pkgManager === 'yarn') {
      pkgJSON.scripts = { start: '' };
      typeScript
        ? (pkgJSON.scripts.start = 'ts-node src/index.ts')
        : (pkgJSON.scripts.start = 'node src/index.js');

      typeScript ? (pkgJSON.main = 'index.ts') : (pkgJSON.main = 'index.js');

      fs.writeFileSync(
        `${projectName}/package.json`,
        JSON.stringify(pkgJSON, null, 2)
      );
    }
  }

  static installTsDependencies(pkgManager: string, projectName: string): void {
    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i typescript ts-node @types/node -D`);
    }
    if (pkgManager === 'yarn') {
      execSync(
        `cd ${projectName} && yarn add typescript ts-node @types/node -D`
      );
    }
  }

  static addEslint(projectName: string, pkgManager: string): void {
    console.log('🔎 Adding ESLint');

    if (pkgManager === 'npm') {
      execSync(
        `cd ${projectName} && npm i eslint eslint-config-node eslint-plugin-node -D`
      );
    }
    if (pkgManager === 'yarn') {
      execSync(
        `cd ${projectName} && yarn add eslint eslint-config-node eslint-plugin-node -D`
      );
    }

    process.chdir(projectName); // Beacuse execSync does not change dir directly
    spawn('npx', ['eslint', '--init'], { stdio: 'inherit' });
  }

  static addPrettier(projectName: string, pkgManager: string): void {
    console.log('🧹 Adding Prettier');

    if (pkgManager === 'npm') {
      execSync(`cd ${projectName} && npm i prettier -D`);
    }
    if (pkgManager === 'yarn') {
      execSync(`cd ${projectName} && yarn add prettier -D`);
    }

    fs.writeFileSync(
      `./${projectName}/.prettierrc`,
      '{\n\t"singleQuote": true\n}'
    );
  }

  static attachLinterWithPrettier(
    projectName: string,
    pkgManager: string
  ): void {
    console.log('🖇 Connecting ESLint with Prettier');

    if (pkgManager === 'npm') {
      execSync(
        `cd ${projectName} && npm i eslint-config-prettier eslint-plugin-prettier -D`
      );
    }
    if (pkgManager === 'yarn') {
      execSync(
        `cd ${projectName} && yarn add eslint-config-prettier eslint-plugin-prettier -D`
      );
    }
  }
}

export default PackageManager;
