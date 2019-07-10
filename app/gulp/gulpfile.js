// gulp watch 	=> Parsing + Browser-Sync
// gulp dist 	=> Concat + MiniJS + MiniCSS

var gulp 				= require('gulp'),
	sass 				= require('gulp-sass'),
	plumber 			= require('gulp-plumber'),
	gutil 				= require('gulp-util'),
	autoprefixer 		= require('autoprefixer'),
	// postcss nécassaire à autoprefix
	postcss 			= require('gulp-postcss'),
	browserSync			= require('browser-sync'),
	useref 				= require('gulp-useref'),
	uglify 				= require('gulp-uglify'),
	minifyCSS 			= require('gulp-minify-css'),
	imagemin 			= require('gulp-imagemin');

var files = {
	'src': '../',
	'dist': '../../dist/'
};

// function gutil lié à Plumber
var onError = function (error) {
	gutil.beep();
	gutil.log(gutil.colors.red(error.message));
};

// Parsing -> gulp sass
gulp.task('sass', function () {
	return gulp.src(files.src + 'css/*.+(scss|sass)')
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(postcss([autoprefixer('> 1%', 'last 2 versions')]))
		.pipe(gulp.dest(files.src + 'css/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Tache Browser-Sync -> gulp browserSync
gulp.task('browserSync', function () {
	browserSync({
		server: {
			baseDir: files.src
		}
	})
});

// Watch - Parsing + Browser-Sync -> gulp watch
gulp.task('watch', ['browserSync', 'sass'], function () { // ['array', 'ofTask', 'toComplete', 'beforeWatch']
	gulp.watch(files.src + 'css/*.+(scss|sass)', ['sass']);
	gulp.watch(files.src + '*.+(html|php)', browserSync.reload);
	gulp.watch(files.src + 'js/**/*.js', browserSync.reload);
});

// Useref - Concaténation -> gulp concat
//	 Add		<!-- build:css css/cssCombined.min.css -->
//	 on         <!-- endbuild -->
//	 html or 	<!--build:js js/jsCombined.min.js  -->
//	 php file   <!-- endbuild -->
gulp.task('concat', function () {
	return gulp.src(files.src + '*.+(html|php)')
		.pipe(useref())
		.pipe(gulp.dest(files.dist));
});

// Tache Uglify - Minification -> gulp miniJs
gulp.task('miniJs', ['concat'], function () {
	return gulp.src(files.dist + 'js/jsCombined.min.js')
		.pipe(uglify())
		.pipe(gulp.dest(files.dist + 'js'));
});

// Tache MinifyCSS - Minification -> gulp miniCss
gulp.task('miniCss', ['concat'], function () {
	return gulp.src(files.dist + 'css/cssCombined.min.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest(files.dist + 'css'));
});

// Dist - Concat + MiniJS + MiniCSS -> gulp dist
gulp.task('dist', ['concat', 'miniJs', 'miniCss']);

// Tache ImageMin - Optimize all img format - gulp imgMin
gulp.task('imgMin', function () {
	return gulp.src(files.src + 'img/**/*.+(png|jpg|gif|svg|jpeg)')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{
				removeViewBox: true
			}]
		}))
		.pipe(gulp.dest(files.dist + 'img'));
});

//cleanCSS

// gulp-cache

// del

// run-sequence

// gulp-load-plugins
