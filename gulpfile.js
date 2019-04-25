const { src, watch, series, dest } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoPreFixer = require('autoprefixer');
const cssNano = require('cssnano');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    dest: 'src/css/'
  },
  views: {
    src: 'src/views/**/*.html',
  },
};


function styles() {
  return src(paths.styles.src)
    .pipe(sass())
    .pipe(postcss([autoPreFixer(), cssNano()]))
    .pipe(dest(paths.styles.dest))
    .pipe(reload({ stream: true}))
}

function views() {
  return src(paths.views.src)
      .pipe(reload({ stream: true }))
}

function watchFile() {
  browserSync({
    server: {
      baseDir: ['src'],
      index: '/views/login.html',
    },
  });
  watch(paths.styles.src, series(styles));
  watch(paths.views.src, series(views));
}

exports.serve = series(styles, watchFile);
