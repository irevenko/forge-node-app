import fs from 'fs';
import { execSync, spawn } from 'child_process';

export function installTsDependencies(
  pkgManager: string,
  projectName: string
): void {
  if (pkgManager === 'npm') {
    execSync(`cd ${projectName} && npm i typescript ts-node @types/node -D`);
  }
  if (pkgManager === 'yarn') {
    execSync(`cd ${projectName} && yarn add typescript ts-node @types/node -D`);
  }
}

export function addEslint(projectName: string, pkgManager: string): void {
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

export function addPrettier(projectName: string, pkgManager: string): void {
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

export function attachLinterWithPrettier(
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
