export const defaultJsFile =
  'const n = 5;\nconsole.log(n);\nmodule.exports = n;\n';

export const defaultBabelFile = 'export const n = 5;\nconsole.log(n);\n';

export const defaultTsFile = 'export const n: number = 5;\nconsole.log(n);\n';

export const dotenvESFile =
  "import 'dotenv/config';\nconsole.log(process.env.MSG);\n";

export const dotenvCommonFile =
  "require('dotenv').config();\nconsole.log(process.env.MSG);\n";

export const dotenvFile = 'MSG=HelloWorld';

export const prettierConfig = '{\n\t"singleQuote": true\n}';

export const prettierIgnore =
  '/node_modules/\n/out/\n/dist/\n/build/**\n/coverage/**\n/templates/**\n/__tests__/**\n.eslintrc.js\n';

export const eslintIgnore =
  '/node_modules/\n/out/\n/dist/\n/build/**\n/coverage/**\n/templates/**\n/__tests__/**\n';

export const babelConfig = '{\n\t "presets": ["@babel/preset-env"]\n}';

export const jestCommonFile =
  "const n = require('../src/index');\ntest('n is equal 5', () => {\n  expect(n).toBe(5);\n});";

export const jestESFile =
  "import { n } from '../src/index';\ntest('n is equal 5', () => {\n  expect(n).toBe(5);\n});";

export const jestConfig = "module.exports = {\n\ttestEnvironment: 'node'\n};";
