var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del'),
	runSequence = require('run-sequence'),
	browserSync = require('browser-sync').create();


gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
			baseDir: 'builds/development'
		},
	})
});

gulp.task('jade', function(){
	return gulp.src('src/templates/**/*.jade')
	.pipe(jade())
	.pipe(gulp.dest('builds/development'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('sass', function(){
	return gulp.src('src/assets/sass/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('builds/development/assets/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('scripts', function(){
	gulp.src('src/assets/js/**/*.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('builds/development/assets/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('watch', ['sass', 'jade', 'browser-sync'], function(){
	gulp.watch('src/assets/sass/**/*.scss', ['sass']);
	gulp.watch('src/templates/**/*.jade', ['jade']);
	gulp.watch('src/assets/js/**/*.js', ['scripts']);
});

gulp.task('clean:builds', function(){
	return del.sync('builds');
});

gulp.task('build', function(callback){
	runSequence('clean:builds', ['jade', 'sass', 'scripts', 'watch', 'browser-sync'], 
		callback
	)
});

gulp.task('default', function(callback){
	runSequence(['jade', 'sass', 'scripts', 'watch', 'browser-sync'], 
		callback
	)
});