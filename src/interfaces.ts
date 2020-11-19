export interface IAnswers {
  projectName: string;
  pkgManager: string;
  pkgQuestions: string;
  typeScript: boolean;
  babel: boolean;
  eslintConfig?: string;
  extraLibs?: Array<string>;
  extraOptions?: Array<string>;
  tests?: string;
  licenseType?: string;
  licenseAuthor?: string;
  hostingPlatform?: string;
  platformUsername?: string;
  repositoryName?: string;
  savePreset?: boolean;
  presetName?: string;
}

export interface IPackage {
  description?: string;
  author?: string;
  keywords?: Array<string>;
  license?: string;
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  main: string;
  scripts: {
    'start:source'?: string;
    start?: string;
    dev?: string;
    build?: string;
    test?: string;
    watch?: string;
    format?: string;
    lint?: string;
    'lint:fix'?: string;
  };
}

export interface IPreset {
  [key: string]: {
    projectName: string;
    pkgManager: string;
    pkgQuestions: string;
    typeScript: boolean;
    babel: boolean;
    eslintConfig?: string;
    extraLibs?: Array<string>;
    extraOptions?: Array<string>;
    tests?: string;
    licenseType?: string;
    licenseAuthor?: string;
    hostingPlatform?: string;
    platformUsername?: string;
    repositoryName?: string;
  };
}

export interface IPresetAnswers {
  presetChoice: string;
}
