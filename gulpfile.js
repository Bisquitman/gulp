const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
// const babel = require('gulp-babel');

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      "overrideBrowserslist": [
        "> 1%",
        "ie >= 8",
        "edge >= 15",
        "ie_mob >= 10",
        "ff >= 45",
        "chrome >= 45",
        "safari >= 7",
        "opera >= 23",
        "ios >= 7",
        "android >= 4",
        "bb >= 10"
      ]
    }))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
}
function js() {
  return src([
    'src/js/**.js'
  ])
    /*.pipe(babel({presets: ["@babel/preset-env"]}))*/
    .pipe(concat('main.js'))
    .pipe(dest('dist/js/'))
}

function img() {
  return src([
    'src/img/**/*.*'
  ])
    .pipe(dest('dist/img/'))
}

function assets() {
  return src([
    'src/assets/**/*.*'
  ])
    .pipe(dest('dist/assets/'))
}

function clear() {
  return del('dist')
}

function serve() {
  sync.init({
    tunnel: true,
    server: {
      baseDir: './dist'
    }
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/parts/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  watch('src/js/**.js', series(js)).on('change', sync.reload)
  watch('src/img/**/*.*', series(img)).on('change', sync.reload)
}

exports.build = series(clear, scss, html, js, img, assets)
exports.serve = series(clear, scss, html, js, img, assets, serve)
exports.clear = clear