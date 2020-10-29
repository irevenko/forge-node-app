export const defaultJsFile = 'const n = 5;\nconsole.log(n);';

export const defaultTsFile = 'const n: number = 5;\nconsole.log(n);';

export const dotenvTsFile =
  "import 'dotenv/config';\nconsole.log(process.env.MSG);";

export const dotenvJsFile =
  "require('dotenv').config();\nconsole.log(process.env.MSG);";

export const dotenvFile = 'MSG=HelloWorld';

export const prettierConfig = '{\n\t"singleQuote": true\n}';
