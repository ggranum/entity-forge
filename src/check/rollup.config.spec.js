import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import * as path from 'path';

var idxFile = path.resolve( './dist/esm/check/index.js' )
var globals = {
  '@entityforge/validator': 'Validate'
}
globals[idxFile] = "Check"
export default {
  entry: 'dist/esm/check/index.spec.js',
  dest: 'dist/es3/check/index.spec.js',
  format: 'iife',
  moduleName: 'CheckSpec',
  plugins: [ json(), babel() ],
  external: [
    idxFile
  ],
  globals: globals
};