import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'dist/esm/generate/index.js',
  dest: 'dist/es3/generate/index.js',
  format: 'iife',
  moduleName: 'Generate',
  plugins: [ json(), babel() ],
  external: [
    '@entityforge/validator',
    '@entityforge/check'
  ]
};