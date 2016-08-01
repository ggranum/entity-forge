import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';


export default {
  entry: 'dist/esm/forge/index.js',
  dest: 'dist/es3/forge/index.js',
  format: 'iife',
  moduleName: 'Forge',
  plugins: [ json(), babel() ],
  external: [
    'validator/index',
    'check/index',
    'generate/index'
  ],
  globals:{
    'validator/index': 'Validator',
    'check/index': 'Check',
    'generate/index': 'Generate'
  }
};