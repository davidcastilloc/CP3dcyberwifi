const { src, dest, watch, series } = require('gulp')

const pug = require('gulp-pug')
const sass = require('gulp-sass')

const browserSync = require('browser-sync').create()


// Compile pug files into HTML
function html() {
  return src('src/hotspot/**/*')
    .pipe(pug())
    .pipe(dest('dist/hotspot/'))
}

//Compile sass files into CSS
function styles() {
  return src('src/scss/theme.scss')
    .pipe(sass({
      includePaths: ['src/scss'],
      errLogToConsole: true,
      outputStyle: 'compressed',
      onError: browserSync.notify
    }))
    .pipe(dest('dist/hotspot/assets/css'))
    .pipe(browserSync.stream())
}

// Copy assets
// add xml copy to dist dir
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('dist/hotspot/assets'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist/hotspot/',
  })

  watch('src/sass/**/*.scss', styles)
  watch('src/**/*', html)
  watch('src/assets/**/*', assets)
  watch('dist/hotspot/*.html').on('change', browserSync.reload)
}
exports.html = html
exports.styles = styles
exports.watch = watchAndServe
exports.default = series(html, styles, assets, watchAndServe)
