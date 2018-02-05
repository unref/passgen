var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('css', function() {
  return gulp.src('src/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('docs'))
});

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env', 'es2015']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('docs'))
})

gulp.task('img', function () {
  return gulp.src('src/imgs/**/*.*')
    .pipe(gulp.dest('docs/imgs'))
})

gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('docs'))
})

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['css', 'js', 'img', 'index'])
});

gulp.task('build', ['css', 'js', 'img', 'index']);

