#!/usr/bin/env bash

set -x
rm -rf ./dist
./node_modules/.bin/tsc -p ./src
./node_modules/.bin/rollup -c ./src/validator/rollup.config.js

./node_modules/.bin/rollup -c ./src/check/rollup.config.js
./node_modules/.bin/rollup -c ./src/check/rollup.config.spec.js


./node_modules/.bin/rollup -c ./src/generate/rollup.config.js
./node_modules/.bin/rollup -c ./src/generate/rollup.config.spec.js

./node_modules/.bin/rollup -c ./src/forge/rollup.config.js
./node_modules/.bin/rollup -c ./src/forge/rollup.config.spec.js

