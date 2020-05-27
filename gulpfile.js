const {
		src,
		dest,
		watch,
		series
} = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create()
const minify = require('gulp-minify');

// Compile pug files into HTML
function html() {
		return src('src/hotspot/**/*.pug')
				.pipe(pug())
				.pipe(dest('dist/hotspot/'))
}

function minifiedhtml() {
		return src('dist/hotspot/**/*.html')
				.pipe(htmlmin({
						collapseWhitespace: true
				}))
				.pipe(dest('dist/hotspot/'))
}

// Copy assets
// add xml copy to dist dir
function assets() {
		return src('src/assets/**/*')
				.pipe(dest('dist/hotspot/assets'))
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
}

//Compile sass files into CSS
function minjs() {
		return src('src/assets/pagos/*.js')
				.pipe(minify({
						ext: {
								src: '-debug.js',
								min: '.js'
						},
						exclude: ['vue.js'],
						ignoreFiles: ['.combo.js', '-min.js']
				}))
				.pipe(dest('dist/hotspot/assets/pagos'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
		browserSync.init({
				server: 'dist/hotspot/',
		})
		watch('src/sass/**/*', styles)
		watch('src/assets/pagos/**/*', minjs)
		watch(['src/**/*.pug', 'src/**/*.html'], html, minifiedhtml)
		watch('dist/hotspot/**/*.*').on('change', browserSync.reload)
}

exports.html = html
exports.minifiedhtml = minifiedhtml
exports.js = minjs
exports.styles = styles
exports.watch = watchAndServe
exports.default = series(html, minifiedhtml, assets, minjs, styles, watchAndServe)
