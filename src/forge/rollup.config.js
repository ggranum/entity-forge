import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';


export default {
  entry: 'dist/esm/forge/index.js',
  dest: 'dist/es3/forge/index.js',
  format: 'iife',
  moduleName: 'Forge',
  plugins: [ json(), babel() ],
  external: [
    '@entityforge/validator',
    '@entityforge/check',
    '@entityforge/generate'
  ],
  globals:{
    '@entityforge/validator': 'Validate',
    '@entityforge/check': 'Check',
    '@entityforge/generate': 'Generate'
  }
};