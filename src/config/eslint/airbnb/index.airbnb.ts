import esAirBnbBabel from './eslint_airbnb_babel';
import esAirBnbJs from './eslint_airbnb_js';
import esAirBnbTs from './eslint_airbnb_ts';
import esAirBnbBabelPretty from './eslint_airbnb_prettier_babel';
import esAirBnbJsPretty from './eslint_airbnb_prettier_js';
import esAirBnbTsPretty from './eslint_airbnb_prettier_ts';

// eslint-disable-next-line import/prefer-default-export
export const airBnb = {
  js: esAirBnbJs,
  ts: esAirBnbTs,
  babel: esAirBnbBabel,
  jsPretty: esAirBnbJsPretty,
  tsPretty: esAirBnbTsPretty,
  babelPretty: esAirBnbBabelPretty,
};
