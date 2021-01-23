import { execSync } from 'child_process';
import BasePackageManager, {
  PackageInstallationType,
  PackageManagerInit,
  PackageManagerInstall,
} from './base';

export const init: PackageManagerInit = ({
  cwd,
  interactive,
  stdio,
}): Buffer => {
  return execSync(`npm init${interactive ? '' : ' -y'}`, { stdio, cwd });
};

export const install: PackageManagerInstall = ({
  cwd,
  packageName,
  type,
  stdio,
}): Buffer => {
  let installOption = '';
  switch (type) {
    case PackageInstallationType.DEV_DEPENDENCIES:
      installOption = '-D';
      break;
    case PackageInstallationType.OPTIONAL:
      installOption = '-O';
      break;
    default:
      break;
  }
  return execSync(
    `npm install ${packageName}${installOption ? ` ${installOption}` : ''}`,
    { stdio, cwd }
  );
};

export default {
  type: 'npm',
  init,
  install,
} as BasePackageManager;
