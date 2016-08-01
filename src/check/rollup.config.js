import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'dist/esm/check/index.js',
  dest: 'dist/es3/check/index.js',
  format: 'iife',
  moduleName: 'Check',
  plugins: [ json(), babel() ],
  external: [
    'validator/index'
  ],
  globals:{
    'validator/index': 'Validator'
  }
};