var gulp = require('gulp')
  , fs = require('fs')
  , path = require('path')
  , del = require('del')
  , browserSync = require('browser-sync')
  , merge = require('merge-stream')
  , watch = require('gulp-watch')
  , rename = require('gulp-rename')
  , plumber = require('gulp-plumber')
  , sass = require('gulp-sass')
  , autoprefixer = require('gulp-autoprefixer')
  , minifycss = require('gulp-minify-css')
  , uglify = require('gulp-uglify')
  , jshint = require('gulp-jshint')
  , concat = require('gulp-concat')
  , svgstore = require('gulp-svgstore')
  , svgmin = require('gulp-svgmin')
  , cheerio = require('gulp-cheerio')
  , imagemin = require('gulp-imagemin')
  ;


var reload = browserSync.reload;

// gulp-plumber error handler; won't break the watch-stream
var errorHandler = {
  errorHandler: function (err) {
    console.log(err.toString());
    this.emit('end');
  }
};

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

function getFileGroups(dir) {
  var alreadyReturned = [];
  return fs.readdirSync(dir)
    .filter(function (file) {
      var prefix = file.split('_')[0];
      if ( alreadyReturned.indexOf(prefix) > -1) {
        alreadyReturned.push(prefix);
        return prefix;
      }
    });
}


/* SASS Build
============================== */
gulp.task('sass', function() {
  return gulp.src('static/sass/**/*.scss')
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'ie 9'))
    .pipe(gulp.dest('build/css'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('static/build/css'))
    .pipe(reload({stream: true}));
});


/* JavaScript
 * Concatenate static/js/prefix_*.js into static/build/js/prefix{.min}.js
============================== */
gulp.task('js', function() {
  var groups = getFileGroups('static/js');
  var tasks = groups.map(function (group) {
    return gulp.src('static/js/' + group + '_*.js')
      .pipe(plumber(errorHandler))
      .pipe(jshint())
      .pipe(concat(group + '.js'))
      .pipe(gulp.dest('static/build/js'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('static/build/js'));
  });
  return merge(tasks);
});


/* SVG Min & Map
 * Note: This creates a svgmap _for each directory_ in assets/svg.
 * Also it will add the directory name as a prefix for the symbol ids.
============================== */
gulp.task('svg', function() {
  var folders = getFolders('assets/svg');

  var tasks = folders.map(function (folder) {
    var name = "";

    return gulp.src('assets/svg/' + folder + '/*.svg', { base: 'assets/svg' })
      .pipe(plumber(errorHandler))
      .pipe(rename(function (path) {
        path.basename = folder + '-' + path.basename;
      }))
      .pipe(svgmin())
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(cheerio(function ($) {
        $('svg').attr('style', 'display: none');
      }))
      .pipe(rename(function (path) {
        path.basename = 'map-' + name;
        path.extname = '.svg';
      }))
      .pipe(gulp.dest('assets/build/svg'));
  });

  return merge(tasks);
});


/* Image Optimization
============================== */
gulp.task('img', function() {
  return gulp.src('assets/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/build'));
});


/* Watch
============================== */
gulp.task('watch', function() {

  browserSync({
    proxy: "localhost:8888/logicmedia/"
    // , notify: false // if the browser notifications are annoying
  });

  watch('static/sass/**/*.scss', function() { gulp.start('sass'); });
  watch('assets/svg/**/*.svg', function() { gulp.start('svg'); });
  watch('static/js/*.js', function() { gulp.start('js'); browserSync.reload() });
  watch('./views/**/*.html', function() { reload(); });
});

/* Clean builded files
============================== */
gulp.task('clean', function(cb) {
  del(['static/build/css/*.css', 'static/build/js/*.js', 'assets/build/svg/*.svg', 'assets/build/img/*'], cb)
});


/* Default task
============================== */
gulp.task('default', ['clean'], function() {
  gulp.start('sass', 'js', 'svg');
}, ['watch']);
