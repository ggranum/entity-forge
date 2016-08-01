#!/usr/bin/env bash

set -x
./node_modules/.bin/tsc -p ./src/validator
./node_modules/.bin/rollup -c ./src/validator/rollup.config.js


./node_modules/.bin/tsc -p ./src/check
./node_modules/.bin/rollup -c ./src/check/rollup.config.js
./node_modules/.bin/rollup -c ./src/check/rollup.config.spec.js


./node_modules/.bin/tsc -p ./src/generate
./node_modules/.bin/rollup -c ./src/generate/rollup.config.js
./node_modules/.bin/rollup -c ./src/generate/rollup.config.spec.js

./node_modules/.bin/tsc -p ./src/forge
./node_modules/.bin/rollup -c ./src/forge/rollup.config.js
./node_modules/.bin/rollup -c ./src/forge/rollup.config.spec.js


./node_modules/.bin/tsc -p ./src
