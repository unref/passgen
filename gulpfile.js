var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var babel = require('gulp-babel');


gulp.task('css', function() {
  return gulp.src('src/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['env', 'es2015']
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('img', function () {
  return gulp.src('src/imgs/**/*.*')
    .pipe(gulp.dest('dist/imgs'))
})

gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['css', 'js', 'img', 'index'])
});

gulp.task('build', ['css', 'js', 'img', 'index']);
