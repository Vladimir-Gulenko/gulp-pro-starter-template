/**
 * Fonts from Source to Build
 * -----------------------------------------------------------------------------
 */

import gulp 						from 'gulp';
import folders					from './folders';
import {server, reload, serve} from './browserSync';


gulp.task('fonts', () =>
	gulp.src(`${folders.src}/fonts/**/*`)
		.pipe(gulp.dest(`${folders.build}/fonts`))
);

gulp.task('fonts:watch', () =>
	gulp.watch(`${folders.src}/fonts/**/*`, gulp.series('fonts', reload))
);