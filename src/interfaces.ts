export interface IAnswers {
  projectName: string;
  pkgManager: string;
  pkgQuestions: string;
  eslintQuestions: string;
  typeScript: boolean;
  babel: boolean;
  extraSettings?: Array<string>;
  extraOptions: Array<string>;
  tests?: string;
}

export interface IPackage {
  description?: string;
  author?: string;
  keywords?: Array<string>;
  license?: string;
  // homepage
  // repository: {type, url}
  // bugs {url}
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
