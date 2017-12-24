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
import data 						from 'gulp-data';
import install 					from 'gulp-install';
import notify 					from 'gulp-notify';
import fs 							from 'fs';
import path 						from 'path';


/**
 * browserSync
 * -----------------------------------------------------------------------------
 */

import browserSync 			from 'browser-sync';


/**
 * PUG
 * -----------------------------------------------------------------------------
 */

import gulpif 					from 'gulp-if';
import pug 							from 'gulp-pug';
const emitty 			= require('emitty').setup('src/views', 'pug');


/**
 * SASS
 * -----------------------------------------------------------------------------
 */

import sass 						from 'gulp-sass';
import sassGlob 				from 'gulp-sass-glob';
import autoprefixer 		from 'gulp-autoprefixer';
import csscomb 					from 'gulp-csscomb';
import sassdoc 					from 'sassdoc';
import converter				from 'sass-convert';

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

gulp.task('image', () =>
	gulp.src(`${folders.src}/img/**/*`)
		.pipe(image({
			zopflipng: false
		}))
		.pipe(gulp.dest(`${folders.build}/img`))
);

// JS

// gulp.task('scripts', () =>
// 	browserify({
// 		entries: 'app/babel/app.js',
// 		debug: true
// 	})
// 	.transform(babelify)
// 	.on('error', notify.onError({
// 			title: 'babelify Error',
// 			message: '<%= error.message %>'
// 	}))
// 	.bundle()
// 	.on('error', notify.onError({
// 			title: 'Bundle Error',
// 			message: '<%= error.message %>'
// 	}))
// 	.pipe(source('bundle.js'))
// 	.pipe(gulp.dest('app/js'))
// );

// gulp.task('scripts:watch', () => {
// 	gulp.watch("app/babel/**/*.js", gulp.series('scripts', reload));
// });


// Your "watch" task
gulp.task(
	'watch', 
	gulp.parallel(
		serve,
		'sass:watch',
		'templates:watch',
		'image'
	)
);

gulp.task(
	'build',
	gulp.parallel(
		'sass',
		'templates'
	)
);

gulp.task('default', gulp.series('watch'));