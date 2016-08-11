import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';


export default {
  entry: 'dist/esm/extra/validator/index.js',
  dest: 'dist/es3/extra/validator/index.js',
  format: 'iife',
  moduleName: 'Validator-Extra',
  plugins: [ json(), babel() ],
  globals: {
    'validator/index': 'this'
  }
};