'use strict';


/**
 * Set paths
 * -----------------------------------------------------------------------------
 */

const folders = {
	build: 'build',
	src: 'src'
};


/**
 * General
 * -----------------------------------------------------------------------------
 */

import gulp 						from 'gulp';
import install 					from 'gulp-install';
import notify 					from 'gulp-notify';
import fs 							from 'fs';
import path 						from 'path';
import del 							from 'del';


/**
 * browserSync
 * -----------------------------------------------------------------------------
 */

import browserSync 			from 'browser-sync';


/**
 * PUG
 * -----------------------------------------------------------------------------
 */

import pug 							from 'gulp-pug';


/**
 * SASS
 * -----------------------------------------------------------------------------
 */

import sass 						from 'gulp-sass';
import sassGlob 				from 'gulp-sass-glob';
import autoprefixer 		from 'gulp-autoprefixer';
import csscomb 					from 'gulp-csscomb';

/**
 * JS
 * -----------------------------------------------------------------------------
 */

import babel 						from 'gulp-babel';
import browserify 			from 'browserify';
import source 					from 'vinyl-source-stream';
import babelify 				from "babelify";

/**
 * Image
 * -----------------------------------------------------------------------------
 */

import image from 'gulp-image';


/**
 * Init server
 * -----------------------------------------------------------------------------
 */

const server = browserSync.create();

function reload(done) {
	server.reload();
	done();
}
function serve(done) {
	
	global.watch = true;

	server.init({
		server: {
			baseDir: `./${folders.build}`
		},
		notify: false
	});

	done();
}


/**
 * Install packages
 * -----------------------------------------------------------------------------
 */

gulp.src(['./package.json'])
	.pipe(install())


/**
 * SASS
 * -----------------------------------------------------------------------------
 */

gulp.task('sass', () => gulp
	.src(`${folders.src}/sass/**/*.+(sass|scss)`)
	.pipe(sassGlob())
	.pipe(sass({
		outputStyle: 'expanded'
	}).on('error', sass.logError))
	.pipe(csscomb())
	.pipe(autoprefixer({
		browsers: ['last 15 versions'],
		cascade: false
	}))
	.pipe(gulp.dest(`${folders.build}/css`))
);


/**
 * SASS (watch)
 * -----------------------------------------------------------------------------
 */
gulp.task('sass:watch', () => {
	gulp.watch(`${folders.src}/sass/**/*.+(sass|scss)`, gulp.series('sass', reload));
});


/**
 * PUG
 * -----------------------------------------------------------------------------
 */

// gulp.task('templates', () =>
// 	new Promise((resolve, reject) => {
// 		emitty.scan(global.emittyChangedFile).then(() => {
// 			gulp.src(`${folders.src}/views/site/**/*.pug`)
// 				.pipe(gulpif(global.watch, emitty.filter(global.emittyChangedFile)))
// 				.pipe(pug({ basedir: `${__dirname}/${folders.src}/views`, pretty: true }))
// 				.on('error', notify.onError({
// 						title: 'PUG Error',
// 						message: '<%= error.message %>'
// 				}))
// 				.pipe(gulp.dest(`${folders.build}`))
// 				.on('end', resolve)
// 				.on('error', reject);
// 		});
// 	})
// );

// gulp.task('templates:watch', () => {
// 	gulp.watch(`${folders.src}/views/**/*.pug`, gulp.series('templates'))
// 		.on('all', (event, filepath) => {
// 			global.emittyChangedFile = filepath;
// 		})
// });
gulp.task('templates', () =>
	gulp.src(`${folders.src}/views/site/**/*.pug`)
		.pipe(pug({ basedir: `${__dirname}/${folders.src}/views`, pretty: true }))
		.on('error', notify.onError({
				title: 'PUG Error',
				message: '<%= error.message %>'
		}))
		.pipe(gulp.dest(`${folders.build}`))
);

gulp.task('templates:watch', () => {
	gulp.watch(`${folders.src}/views/**/*.pug`, gulp.series('templates', reload))
		.on('all', (event, filepath) => {
			global.emittyChangedFile = filepath;
		})
});


/**
 * Optimize PNG, JPEG, GIF, SVG images.
 * -----------------------------------------------------------------------------
 */

gulp.task('image', () => {
	del(`${folders.build}/img`, {force: true})
	gulp.src(`${folders.src}/img/**/*`)
		.pipe(image({
			zopflipng: false
		}))
		.pipe(gulp.dest(`${folders.build}/img`))
});

gulp.task('image:watch', () =>
	gulp.watch(`${folders.src}/img/**/*`, gulp.series('image', reload))
);


/**
 * JS
 * -----------------------------------------------------------------------------
 */

gulp.task('scripts', () =>
	gulp.src(`${folders.src}/js/*.js`)
		.pipe(babel())
		.on('error', notify.onError({
			title: 'Babel Error',
			message: '<%= error.message %>'
		}))
		.pipe(gulp.dest(`${folders.build}/js`))
);

gulp.task('scripts:watch', () =>
	gulp.watch(`${folders.src}/js/*.js`, gulp.series('scripts', reload))
);

gulp.task('bundle', () =>{
	browserify({
		entries: `${folders.src}/js/bundle/bundle.js`,
		debug: true
	})
	.on('error', notify.onError({
			title: 'Browserify Error',
			message: '<%= error.message %>'
	}))
	.transform(babelify)
	.on('error', notify.onError({
		title: 'Babelify Error',
		message: '<%= error.message %>'
	}))
	.bundle()
	.on('error', notify.onError({
			title: 'Bundle Error',
			message: '<%= error.message %>'
	}))
	.pipe(source('bundle.js'))
	.pipe(gulp.dest(`${folders.build}/js`))
});

gulp.task('bundle:watch', () =>
	gulp.watch(`${folders.src}/js/bundle/**/*.js`, gulp.series('bundle', reload))
);

gulp.task('bundle-modules', () =>
	gulp.src(`${folders.src}/js/bundle/modules/**/*.js`)
		.pipe(babel())
		.pipe(gulp.dest(`${folders.build}/js/modules`))
);

gulp.task('bundle-modules:watch', () =>
	gulp.watch(`${folders.src}/js/bundle/modules/**/*.js`, gulp.series('bundle', reload))
);

// gulp.task('bundle-modules', () =>
// 	gulp.src(`${folders.src}/js/bundle/modules/**/*.js`)
// 		.pipe()
// );

/**
 * Fonts from Source to Build
 * -----------------------------------------------------------------------------
 */

gulp.task('fonts', () =>
	gulp.src(`${folders.src}/fonts/**/*`)
		.pipe(gulp.dest(`${folders.build}/fonts`))
);

gulp.task('fonts:watch', () =>
	gulp.watch(`${folders.src}/fonts/**/*`, gulp.series('fonts', reload))
);

// Your "watch" task
gulp.task(
	'watch', 
	gulp.parallel(
		serve,
		'sass',
		'templates',
		'scripts',
		'bundle',
		'bundle-modules',
		'image',
		'fonts',
		'sass:watch',
		'templates:watch',
		'scripts:watch',
		'bundle:watch',
		'bundle-modules:watch',
		'image:watch',
		'fonts:watch'
	)
);

gulp.task('clean', () =>
	del(`${folders.build}`, {force: true})
);

gulp.task(
	'build',
	gulp.series(
		'clean',
		gulp.parallel(
			'sass',
			'templates',
			'scripts',
			'image',
			'fonts'
		)
	)
);

gulp.task('default', gulp.series('watch'));