import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

import * as path from 'path';

var indexPath = path.resolve( './dist/esm/check/index.js' )
export default {
  entry: 'dist/esm/check/check.spec.js',
  dest: 'dist/es3/check/specs.js',
  format: 'iife',
  moduleName: 'CheckSpec',
  plugins: [ json(), babel() ],
  external: [
    indexPath
  ],
  globals: function (id) {
    if(id == '@entityforge/validator'){
      return 'Validator'
    } else if(id == indexPath){
      return 'Check'
    }
  }
};