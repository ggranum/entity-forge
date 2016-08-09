import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'dist/esm/validator/index.spec.js',
  dest: 'dist/es3/validator/index.spec.js',
  format: 'iife',
  moduleName: 'ValidatorSpec',
  plugins: [ json(), babel() ],
  external: [
    'validator/index'
  ],
  globals: {
    'validator/index': 'Validator'
  }
};