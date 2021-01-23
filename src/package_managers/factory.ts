import BasePackageManager from './base';

import { PackageManagerType } from './package_manager_type';
import NPM from './npm';
import YARN from './yarn';

export const factory = (
  packageManagerType: PackageManagerType | string
): BasePackageManager => {
  switch (packageManagerType) {
    case 'npm':
      return NPM;
    case 'yarn':
      return YARN;
    default:
      throw new Error(`Invalid package manager type ${packageManagerType}`);
  }
};
