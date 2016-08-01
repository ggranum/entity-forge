import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';


export default {
  entry: 'dist/esm/validator/index.js',
  dest: 'dist/es3/validator/index.js',
  format: 'iife',
  moduleName: 'Validator',
  plugins: [ json(), babel() ],
  globals: {
    'validator/index': 'this'
  }
};