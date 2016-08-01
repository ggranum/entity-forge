import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'build/validator/index.js',
  format: 'cjs',
  dest: 'dist/validator/validator.js',
  plugins: [ json(), babel() ],
};