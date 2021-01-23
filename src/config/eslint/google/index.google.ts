import esGoogleBabel from './eslint_google_babel';
import esGoogleJs from './eslint_google_js';
import esGoogleTs from './eslint_google_ts';
import esGoogleBabelPretty from './eslint_google_prettier_babel';
import esGoogleJsPretty from './eslint_google_prettier_js';
import esGoogleTsPretty from './eslint_google_prettier_ts';
import { ESLintSpecificConfig } from '../index.eslint';

export const google: ESLintSpecificConfig = {
  js: esGoogleJs,
  ts: esGoogleTs,
  babel: esGoogleBabel,
  jsPretty: esGoogleJsPretty,
  tsPretty: esGoogleTsPretty,
  babelPretty: esGoogleBabelPretty,
};
