import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'dist/esm/forge/index.spec.js',
  dest: 'dist/es3/forge/index.spec.js',
  format: 'iife',
  moduleName: 'ForgeSpec',
  plugins: [ json(), babel() ],
  external: [
    'validator/index',
    'generate/index',
    'forge/index',
  ],
  globals: {
    'validator/index': 'Validator',
    'generate/index': 'Generate',
    'forge/index': 'Forge'
  }
};