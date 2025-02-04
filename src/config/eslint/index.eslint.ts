import js from './eslint_js';
import ts from './eslint_ts';
import babel from './eslint_babel';
import jsPretty from './eslint_prettier_js';
import tsPretty from './eslint_prettier_ts';
import babelPretty from './eslint_prettier_babel';
import { airBnb } from './airbnb/index.airbnb';
import { google } from './google/index.google';
import { standard } from './standard/index.standard';

const esLint = {
  airBnb,
  google,
  standard,
  js,
  ts,
  babel,
  jsPretty,
  tsPretty,
  babelPretty,
};

export default esLint;
