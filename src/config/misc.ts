export const defaultJsFile =
  'const n = 5;\nconsole.log(n);\nmodule.exports = n;\n';

export const defaultBabelFile = 'export const n = 5;\nconsole.log(n);\n';

export const defaultTsFile = 'export const n: number = 5;\nconsole.log(n);\n';

export const dotenvTsFile =
  "import 'dotenv/config';\nconsole.log(process.env.MSG);\n";

export const dotenvJsFile =
  "require('dotenv').config();\nconsole.log(process.env.MSG);\n";

export const dotenvFile = 'MSG=HelloWorld';

export const prettierConfig = '{\n\t"singleQuote": true\n}';

export const prettierIgnore =
  '/node_modules/\n/out/\n/dist/\n/build/**\n/coverage/**\n/templates/**\n/tests/**\n.eslintrc.js\n';

export const eslintIgnore =
  '/node_modules/\n/out/\n/dist/\n/build/**\n/coverage/**\n/templates/**\n/tests/**\n';

export const babelConfig = '{\n\t "presets": ["@babel/preset-env"]\n}';

export const jestJsFile =
  "const n = require('../src/index');\ntest('n is equal 5', () => {\n  expect(n).toBe(5);\n});";

export const jestTsFile =
  "import { n } from '../src/index';\ntest('n is equal 5', () => {\n  expect(n).toBe(5);\n});";
