import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

import * as path from 'path';
export default {
  entry: 'dist/esm/check/index.js',
  dest: 'dist/es3/check/index.js',
  format: 'iife',
  moduleName: 'Check',
  plugins: [ json(), babel() ],
  external: [
    '@entityforge/validator'
  ],
  globals:{
    '@entityforge/validator': 'Validate'
  }
};