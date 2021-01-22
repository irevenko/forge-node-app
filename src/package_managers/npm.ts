import { exec } from 'child_process';
import {
  PackageInstallationType,
  PackageManagerInit,
  PackageManagerInstall,
} from './base';

export const init: PackageManagerInit = ({
  cwd,
  interactive,
  stdio,
}): Promise<void> => {
  return new Promise<void>((resolve, reject) =>
    exec(
      `npm init${interactive ? ' -y' : ''}`,
      { stdio, cwd },
      (err, stdout, stderr) => (err ? reject(err) : resolve())
    )
  );
};

export const install: PackageManagerInstall = ({
  cwd,
  packageName,
  type,
  stdio,
}): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    let installOption = '';
    switch (type) {
      case PackageInstallationType.DEV_DEPENDENCIES:
        installOption = '-D';
        break;
      case PackageInstallationType.OPTIONAL:
        installOption = '-O';
        break;
      case PackageInstallationType.BUNDLED:
        installOption = '-B';
        break;
      default:
        break;
    }
    exec(
      `npm install ${packageName}${installOption ? ` ${installOption}` : ''}`,
      { stdio, cwd },
      (err, stdout, stderr) => (err ? reject(err) : resolve())
    );
  });
};
