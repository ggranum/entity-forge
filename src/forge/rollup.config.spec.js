import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import * as path from 'path';

var idxFile = path.resolve( './dist/esm/forge/index.js' )
var globals = {
  '@entityforge/validator': 'Validate'
}
globals[idxFile] = "Forge"
export default {
  entry: 'dist/esm/forge/index.spec.js',
  dest: 'dist/es3/forge/index.spec.js',
  format: 'iife',
  moduleName: 'ForgeSpec',
  plugins: [ json(), babel() ],
  external: [
    '@entityforge/validator',
    idxFile
  ],
  globals: globals
};