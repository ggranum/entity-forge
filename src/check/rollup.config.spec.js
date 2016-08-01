import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'dist/esm/check/index.spec.js',
  dest: 'dist/es3/check/index.spec.js',
  format: 'iife',
  moduleName: 'CheckSpec',
  plugins: [ json(), babel() ],
  external: [
    'check/index',
    'validator/index'
],
  globals: {
    'validator/index': 'Validator',
    'check/index': 'Check'
  }
};