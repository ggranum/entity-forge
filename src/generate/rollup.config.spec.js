import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'dist/esm/generate/index.spec.js',
  dest: 'dist/es3/generate/index.spec.js',
  format: 'iife',
  plugins: [ json(), babel() ],
  external: [
    'validator/index',
    'check/index',
    'generate/index'
  ],
  globals: {
    'check/index': 'Check',
    'validator/index': 'Validator',
    'generate/index': 'Generate'
  }
};