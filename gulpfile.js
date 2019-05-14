const gulp = require('gulp');
const path = require('path');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');


const $ = gulpLoadPlugins();
const paths = { dist: 'dist' };
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';


gulp.task('css', function() {
  return gulp.src('src/**/*.css')
    .pipe($.autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe($.if(isDevelopment, $.sourcemaps.init()))
    .pipe($.babel({
      presets: ['env', 'es2015']
    }))
    .pipe($.if(isDevelopment, $.sourcemaps.write()))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('img', function () {
  return gulp.src('src/imgs/**/*.*')
    .pipe(gulp.dest(`${paths.dist}/imgs`))
})

gulp.task('index', function () {
  return gulp.src('src/index.html')
    .pipe(gulp.dest(paths.dist))
})

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['css', 'js', 'img', 'index'])
});

gulp.task('clean', (_) => {
    del([`${paths.dist}/*`], {dot: true});
    _();
});

gulp.task('build', gulp.series('clean', 'css', 'js', 'img', 'index'));
