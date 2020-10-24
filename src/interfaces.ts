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
  scripts: {
    start: string;
  };
  main: string;
}
