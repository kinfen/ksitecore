var browserify = require('browserify');
var gulp = require('gulp');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
	//jshint = require('gulp-jshint'),
	//jshintReporter = require('jshint-stylish'),
	//watch = require('gulp-watch');

/*
 * Create variables for our project paths so we can change in one place
 */
//var paths = {
//	'src':['./models/**/*.js','./routes/**/*.js', 'package.json']
//};

/**
 * Build Tasks
 */

gulp.task('build-packages', function() {
	var packages = require('./prebuild/packages');
	var b = browserify();
	packages.forEach(function(i) { b.require(i); });
	b = b.bundle().pipe(source('packages.js'));
	if (process.env.NODE_ENV === 'production') {
		b.pipe(streamify(uglify()));
	}
	console.log('haha');
	return b.pipe(gulp.dest('./public/dist/js'));
});
//
//// gulp lint
//gulp.task('lint', function(){
//	gulp.src(paths.src)
//		.pipe(jshint())
//		.pipe(jshint.reporter(jshintReporter));
//
//});
//
//// gulp watcher for lint
//gulp.task('watchLint', function () {
//	gulp.src(paths.src)
//		.pipe(watch())
//		.pipe(jshint())
//		.pipe(jshint.reporter(jshintReporter));
//});
