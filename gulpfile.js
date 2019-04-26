const { src, watch, series, dest } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoPreFixer = require('autoprefixer');
const cssNano = require('cssnano');
const del = require('del');
const rev = require('gulp-rev');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const paths = {
  styles: {
    src: 'src/Assets/sass/**/*.scss',
    dest: 'src/Assets/css/'
  },
  views: {
    src: 'src/views/**/*.html',
  },
};

function cleanFiles() {
  return del([paths.styles.dest]);
}

function styles() {
  return src(paths.styles.src)
    .pipe(sass())
    .pipe(postcss([autoPreFixer(), cssNano()]))
    .pipe(dest(paths.styles.dest))
    .pipe(reload({ stream: true}))
}

function revStyles() {
  return src(`${paths.styles.dest}cold/index.css`)
    .pipe(rev())
    .pipe(dest(`${paths.styles.dest}cold/`));
}

function views() {
  return src(paths.views.src)
      .pipe(reload({ stream: true }))
}

function watchFile() {
  browserSync({
    server: {
      baseDir: ['src', 'views'],
      directory: true,
      // index: '/views/login.html',
    },
  });
  watch(paths.styles.src, series(styles));
  watch(paths.views.src, series(views));
}

exports.serve = series(cleanFiles, styles, revStyles, watchFile );
