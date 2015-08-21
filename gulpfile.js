//////////////////////////////////////////////////
// load gulp
//////////////////////////////////////////////////

var gulp = require('gulp');

//////////////////////////////////////////////////
// load other gulp stuffs
//////////////////////////////////////////////////

var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

//////////////////////////////////////////////////
// tasks
//////////////////////////////////////////////////

gulp.task('default', ['watch']);

gulp.task('styles', function() {
  gulp.src('public/css/src/**/*.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/css/dist/'))
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/css/dist/'));
});

gulp.task('watch', function() {
  gulp.watch('public/css/src/**/*.css', ['styles']);
});