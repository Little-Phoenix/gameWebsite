const gulp = require('gulp')
const jade = require('gulp-jade')
const sass = require('gulp-sass')
const watch = require('gulp-watch')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const clean = require('gulp-clean')
const minifyCss = require('gulp-cssnano')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
// const webpack = require('webpack')
// const webpackConfig = require('./webpack.config');

// gulp.task('webpack', function(){
//   return gulp.src('./src')
//              .pipe(webpack(webpackConfig))
//             //  .pipe(gulp.dest('dest'))
// })

gulp.task('sass', () => {
	gulp.src(['./public/style/main.sass', './app/components/**/*.sass'])
    .pipe(concat('min.sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
			autoprefixer({
				browsers: ['last 2 versions', 'last 10 iOS versions'] ,
				add: true,
				remove: true
			})
		]))
		.pipe(minifyCss({ zindex: false }))
		.pipe(gulp.dest('dist/style'))
	gulp.src(['./public/style/main.sass', './app/components/**/*.sass'])
		.pipe(concat('min.sass'))
		.pipe(gulp.dest('dist/style'))
})

gulp.task('html', () => {
	gulp.src('./app/views/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./dist/views/'))
})

gulp.task('image', () => {
	gulp.src('./dist/img/*', { read: false })
    .pipe(clean())
	gulp.src('./public/img/**')
    .pipe(watch('./public/img/**'))
    .pipe(
			imagemin({
				optimizationLevel: 5,
				progressive: true
			})
		)
    .pipe(gulp.dest('./dist/img/'))
})

gulp.task('sass:watch', () => {
	watch('./app/**/*.sass', () => {
		gulp.start('sass')
	})
})

gulp.task('html:watch', () => {
	watch('./app/**/*.jade', () => {
		gulp.start('html')
	})
})

gulp.task('image:watch', () => {
	watch('./public/img/**', () => {
		gulp.start('image')
	})
})

gulp.task('default', [ 'html', 'sass', 'image', 'html:watch', 'sass:watch', 'image:watch'], () => {

})
