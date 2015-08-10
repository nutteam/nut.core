var gulp = require('gulp');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;

gulp.task('compress', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compress']);
