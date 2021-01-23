import esStandardBabel from './eslint_standard_babel';
import esStandardJs from './eslint_standard_js';
import esStandardTs from './eslint_standard_ts';
import esStandardBabelPretty from './eslint_standard_prettier_babel';
import esStandardJsPretty from './eslint_standard_prettier_js';
import esStandardTsPretty from './eslint_standard_prettier_ts';
import { ESLintSpecificConfig } from '../index.eslint';

export const standard: ESLintSpecificConfig = {
  js: esStandardJs,
  ts: esStandardTs,
  babel: esStandardBabel,
  jsPretty: esStandardJsPretty,
  tsPretty: esStandardTsPretty,
  babelPretty: esStandardBabelPretty,
};
