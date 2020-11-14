import esStandardBabel from './eslint_standard_babel';
import esStandardJs from './eslint_standard_js';
import esStandardTs from './eslint_standard_ts';
import esStandardBabelPretty from './eslint_standard_prettier_babel';
import esStandardJsPretty from './eslint_standard_prettier_js';
import esStandardTsPretty from './eslint_standard_prettier_ts';

// eslint-disable-next-line import/prefer-default-export
export const standard = {
  js: esStandardJs,
  ts: esStandardTs,
  babel: esStandardBabel,
  jsPretty: esStandardJsPretty,
  tsPretty: esStandardTsPretty,
  babelPretty: esStandardBabelPretty,
};
