var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var markdox = require("gulp-markdox");
var concat = require("gulp-concat");

gulp.task('compress', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter());
});

gulp.task('jscs', function() {
  return gulp.src('src/*.js')
    .pipe(jscs());
});

gulp.task("doc", function() {
  return gulp.src("src/*.js")
    .pipe(markdox())
    .pipe(concat("README.md"))
    .pipe(gulp.dest("./"));
});

gulp.task('default', ['lint', 'jscs', 'doc', 'compress']);
