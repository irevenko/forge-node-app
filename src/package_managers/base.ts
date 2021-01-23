import { StdioOptions } from 'child_process';
import { PackageManagerType } from './package_manager_type';

export enum PackageInstallationType {
  DEPENDENCIES,
  DEV_DEPENDENCIES,
  OPTIONAL,
}

export type PackageManagerInit = ({
  cwd,
  interactive,
  stdio,
}: {
  cwd: string;
  interactive: boolean;
  stdio: StdioOptions;
}) => Buffer;

export type PackageManagerInstall = ({
  cwd,
  packageName,
  type,
  stdio,
}: {
  cwd: string;
  packageName: string;
  type: PackageInstallationType;
  stdio: StdioOptions;
}) => Buffer;

export default interface IPackageManager {
  type: PackageManagerType;
  init: PackageManagerInit;
  install: PackageManagerInstall;
}
