import { StdioOptions } from 'child_process';

export enum PackageInstallationType {
  DEPENDENCIES = '',
  DEV_DEPENDENCIES = '',
  OPTIONAL = '',
  BUNDLED = '',
}

export type PackageManagerInit = ({
  cwd,
  interactive,
  stdio,
}: {
  cwd: string;
  interactive: boolean;
  stdio: StdioOptions;
}) => Promise<void>;

export type PackageManagerInstall = ({
  cwd,
  packageName,
  type,
  stdio,
}: {
  cwd: string;
  packageName: boolean;
  type: PackageInstallationType;
  stdio: StdioOptions;
}) => Promise<void>;
