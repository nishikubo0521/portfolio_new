var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function(){
  return sass('public/styles/scss/',{style:'expanded'})
    .on('error', function(err){
      console.error('Error !', err.message);
    })
    .pipe(gulp.dest('public/styles/css/'))
    .pipe(reload({stream: true}));
});

gulp.task('serve', function(){
  browserSync({
    server: './'
  });

  gulp.watch('public/styles/scss/*.scss',['sass']);
  gulp.watch('*.html').on('change',reload);
  gulp.watch('scripts/*.js').on('change',reload);
});

var gls = require('gulp-live-server');

gulp.task('app', function(){
  var server =  gls.new('index.js');
  server.start();

  gulp.watch('public/styles/scss/*.scss',['sass']);
});