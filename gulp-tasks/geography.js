var
  gulp         = require('gulp-param')(require('gulp'), process.argv),
  download     = require('gulp-download'),
  replace      = require('gulp-replace'),
  insert       = require('gulp-insert'),
  parse        = require('csv-parse'),
  jsonRefactor = require('gulp-json-refactor'),
  rename       = require('gulp-rename')
  TEMPDIR      = './data/raw'
;

var geography = [
  {
    url: 'http://www2.census.gov/geo/docs/reference/codes/files/national_county.txt',
    filename: 'counties.csv',
    headers: 'state_abbreviation,state_fips_short,county_fips_short,county_name,county_fips_class_code',
    csv: {
      delimiter: ',',
      objname: 'county_fips_short'
    },
    refactor: {
    }
  },
  {
    url: 'http://www2.census.gov/geo/docs/reference/state.txt',
    filename: 'states.csv',
    headers: 'state_fips|state_abbreviation|state_name|state_ens',
    csv: {
      delimiter: '|'
    },
    refactor: {
    }
  }
];

gulp.task('geography', function() {
  geography.forEach(function(obj) {
    download(obj.url)
      .pipe(rename(obj.filename))
      .pipe(insert.prepend(obj.headers))
      .pipe(parse(obj.csv))
      .pipe(rename({extname: '.json'}))
      .pipe(gulp.dest(TEMPDIR))
  });
});

