import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

import * as path from 'path';
var idxFile = path.resolve( './dist/esm/generate/index.js' )
var globals = {}
globals[idxFile] = "Generate"
export default {
  entry: 'dist/esm/generate/index.spec.js',
  dest: 'dist/es3/generate/index.spec.js',
  format: 'iife',
  plugins: [ json(), babel() ],
  external: [
    '@entityforge/validator',
    idxFile
  ],
  globals: globals
};