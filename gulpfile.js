"use strict";
const gulp = require('gulp');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');


gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});


gulp.task('default', [], function(cb) {
  runSequence('clean', 'build', cb);
});