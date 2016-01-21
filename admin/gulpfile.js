var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	watch = require('gulp-watch');

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json']
};

/**
 * Build Tasks
 */

gulp.task('build-packages', function() {
	var packages = require('./client/packages');
	var b = browserify();
	packages.forEach(function(i) { b.require(i); });
	b = b.bundle().pipe(source('packages.js'));
	if (process.env.NODE_ENV === 'production') {
		b.pipe(streamify(uglify()));
	}
	return b.pipe(gulp.dest('./admin/public/js'));
});

// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));

});

// gulp watcher for lint
gulp.task('watchLint', function () {
	gulp.src(paths.src)
		.pipe(watch())
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});
