var
  gulp       = require('gulp-param')(require('gulp'), process.argv),
  requireDir = require('require-dir')('./gulp-tasks'),
  download   = require('gulp-download'),
  TEMPDIR    = './data/raw'
;

