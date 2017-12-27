/**
 * Clean
 * -----------------------------------------------------------------------------
 */

import gulp 						from 'gulp';
import folders					from './folders';
import del 							from 'del';

gulp.task('clean', () =>
	del(`${folders.build}`, {force: true})
);