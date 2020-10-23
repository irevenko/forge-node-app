import fs from 'fs';
import { execSync } from 'child_process';

interface IPackage {
  scripts: {
    start: string;
  };
  main: string;
}

export function initPackage(projectName: string, pkgManager: string): void {
  fs.mkdirSync(projectName);
  execSync(`cd ${projectName} && ${pkgManager} init -y`);
}

export function createInitialScripts(
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
