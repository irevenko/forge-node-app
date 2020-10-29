export interface IQuestions {
  type: string;
  message: string;
  name: string;
  validate?(value: string): boolean | string;
  choices?: Array<string>;
  default?: boolean;
}

export interface IAnswers {
  projectName: string;
  pkgManager: string;
  typeScript: boolean;
  extraSettings?: Array<string>;
}

export interface IPackage {
  description?: string;
  author?: string;
  keywords?: Array<string>;
  license?: string;
  // repository: {type, url} bugs {url}
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
