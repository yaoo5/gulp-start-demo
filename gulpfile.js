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
    base: 'src/',
    watch: '**/*.scss',
    src: 'index.scss',
    dest: 'lib/'
  },
  views: {
    base: 'test/',
    src: 'test/**/*.html',
  },
};

function cleanFiles() {
  return del([paths.styles.dest]);
}

function styles() {
  return src(`${paths.styles.base}${paths.styles.src}`)
    .pipe(sass())
    .pipe(postcss([autoPreFixer(), cssNano()]))
    .pipe(dest(paths.styles.dest))
    .pipe(reload({ stream: true}))
}

function testStyles() {
  return src(`${paths.styles.dest}index.css`)
    // .pipe(rev())
    .pipe(dest(paths.views.base))
}



function views() {
  return src(paths.views.src)
      .pipe(reload({ stream: true }))
}

function watchFile() {
  browserSync({
    server: {
      baseDir: ['test', 'lib'],
      directory: true,
    },
  });
  watch(`${paths.styles.base}${paths.styles.watch}`, series(styles, testStyles));
  watch(paths.views.src, series(views));
}

exports.serve = series(cleanFiles, styles, testStyles, watchFile );
