'use strict';

/**
 * @author: Roman Sverstka, http://sverstka.ru
*/


const gulp = require('gulp');
const path = require('path');
const del = require('del');
const buffer = require('vinyl-buffer');
const fs = require('fs');
const browserSync = require('browser-sync').create();
const glp = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const inlineSVG = require('postcss-inline-svg');
const cssMqpacker = require('css-mqpacker');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminOptipng = require('imagemin-optipng');
const sharp = require('sharp');

const webpack = require('webpack');
const webpackConfig = require('./webpack.config')();
const Log = require('./tasks/helpers/logger');

const projectConfig = require('./projectConfig');
const projectOptions = require('./projectOptions');

// Определяем режим разработки: 'dev' или 'production
const isDevelopment = glp.util.env.type === 'development';
const isProduction = glp.util.env.type === 'production';

// =================================================================================================

/* ----- *\
-- CLEAN --
\* ----- */

gulp.task('clean', () => del(projectConfig.root.public));

/* ----- *\
|| CLEAN ||
\* ----- */
// =================================================================================================

/* --------------- *\
-- HTML PROCESSING --
\* --------------- */

gulp.task('html', () => {
	return gulp.src(
		path.join(projectConfig.root.src, projectConfig.html.src, './**/*.html'),
		{ base: path.join(projectConfig.root.src, projectConfig.html.src) }
	)
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'Html compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.fileInclude({
			prefix: '@@',
			basepath: '@file',
			indent: true
		}))
		.pipe(glp.replace(/\n\s*<!--dev[\s\S]+?-->/gm, ''))
		// .pipe(glp.debug({
		// 	title: 'html'
		// }))
		.pipe(gulp.dest(projectConfig.root.public))
		.pipe(browserSync.reload({ stream: true }));
});


/* --------------- *\
|| HTML PROCESSING ||
\* --------------- */

// =================================================================================================

/* ---------------- *\
-- STYLE PROCESSING --
\* ---------------- */

// Processing styles from the folder "components"
gulp.task('stylesComponents', () => {
	// Clearing the connection file from the folder "components"
	const componentsPath = path.join(
		projectConfig.root.src, projectConfig.styles.src, projectConfig.styles.components
	);
	try {
		fs.mkdirSync(componentsPath);
	} catch (err) {
		if (err.code !== 'EEXIST') throw err;
	}

	fs.writeFile(path.join(projectConfig.root.src, projectConfig.styles.src, projectConfig.styles.components, '_index.scss'), '',
		(err) => {
			if (err) throw err;
		});


	return gulp.src(
		path.join(projectConfig.root.src, projectConfig.html.components, './**/*.scss'),
		{ base: './' }
	)
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'StylesComponents compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.importify('_index.scss', {
			cssPreproc: 'scss'
		}))
		.pipe(gulp.dest(
			path.join(
				projectConfig.root.src, projectConfig.styles.src, projectConfig.styles.components
			)
		));
});


// Processing of all styles
gulp.task('stylesAllProcessing', () => {
	return gulp.src([
		path.join(projectConfig.root.src, projectConfig.styles.src, './bundle.min.scss')
	], {
		base: path.join(
			projectConfig.root.src, projectConfig.styles.src
		)
	})
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'Styles compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.if(isDevelopment, glp.sourcemaps.init()))
		.pipe(glp.sass({
			includePaths: ['./node_modules']
		}))
		.pipe(glp.postcss([
			autoprefixer({
				browsers: ['ie >= 10', 'last 2 versions', 'Firefox ESR', 'android >= 4', '> 1%']
			}),
			inlineSVG(),
			cssMqpacker()
		]))
		.pipe(glp.if(isDevelopment, glp.sourcemaps.write()))
		// .pipe(glp.if(isProduction,
		// 	glp.postcss(
		// 		cssMqpacker()
		// 	)))
		.pipe(glp.if(isProduction, glp.purifycss([
			path.join(projectConfig.root.public, './**/*.html'),
			path.join(projectConfig.root.public, projectConfig.js.public, './**/*.js')
		])))
		.pipe(glp.if(isProduction, glp.csso({
			comments: 'first-exclamation'
		})))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.styles.public)))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles', gulp.series('stylesComponents', 'stylesAllProcessing'));

/* ---------------- *\
|| STYLE PROCESSING ||
\* ---------------- */

// =================================================================================================

/* ------------- *\
-- JS PROCESSING --
\* ------------- */

// Processing javascript from the folder "components"
gulp.task('jsComponents', () => {
	// Clearing the connection file from the file "src/assets/js/components/components.js"
	fs.writeFileSync(
		path.join(projectConfig.root.src, projectConfig.js.src, projectConfig.js.components, './components.js'),
		'// Обратите внимание, что этот файл перезаписывается автоматически.\n' +
		'// Поэтому, все ваши правки в этом файле будут перезаписаны!!!\n\n',
		(err) => {
			if (err) throw err;
		}
	);


	return gulp.src([
		path.join(projectConfig.root.src, projectConfig.js.components, './**/**.js'),
		'!' + path.join(projectConfig.root.src, projectConfig.js.components, './**/jsSpecial.js')
	],
	{ base: './' })
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'jsComponents compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.wait(100))
		.pipe(glp.tap((file) => {
			const fileRelativePath = file.relative.split(path.sep).slice(2).join('/');
			const fileSize = fs.statSync(file.relative.split(path.sep).join('/')).size;
			if (fileSize) {
				return fs.appendFileSync(
					path.join(projectConfig.root.src, projectConfig.js.src, projectConfig.js.components, './components.js'),
					`import '../../..${projectConfig.html.components}/${fileRelativePath}';\n`,
					(err) => {
						if (err) throw err;
					}
				);
			}
		}));
});


// Processing of all javascript
gulp.task('jsAllProcessing', (done) => {
	webpack(webpackConfig, (err, stats) => {
		if (err) new Log('Webpack', err).error();
		new Log('Webpack', stats.toString({
			assets: true,
			chunks: false,
			chunkModules: false,
			colors: true,
			hash: false,
			timings: true,
			version: false
		})).info();
	});

	done();
});


// Export of all javascript
gulp.task('js', gulp.series('jsComponents', 'jsAllProcessing'));

/* ------------- *\
|| JS PROCESSING ||
\* ------------- */

// =================================================================================================

/* ----------------------- *\
-- SPRITERASTER PROCESSING --
\* ----------------------- */

gulp.task('spriteRaster', () => {
	const spriteData =
		gulp.src([
			path.join(projectConfig.root.src, projectConfig.img.src, projectConfig.img.spriteRaster, './**/*.png'),
			path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteRaster, './**/*.png')
		])
			.pipe(glp.plumber({
				errorHandler: glp.notify.onError({
					title: 'SpriteRaster compilation error',
					icon: path.join('./tasks', '/icons/logo.png'),
					message: 'Error: <%= error.message %>',
					sound: false,
					wait: true
				})
			}))
			.pipe(glp.spritesmith({
				imgName: 'spriteRaster.png',
				cssName: '_spriteRaster.scss',
				imgPath: '../' + projectConfig.img.public + '/spriteRaster.png',
				padding: 5

				// retina
				// retinaSrcFilter: [
				// 	path.join(projectConfig.root.src, projectConfig.img.src, projectConfig.img.spriteRaster, './**/*-2x.png'),
				// 	path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteRaster, './**/*-2x.png')
				// ],
				// retinaImgName: 'spriteRaster-2x.png',
				// retinaImgPath: '../' + projectConfig.img.public + '/spriteRaster-2x.png'
			}));

	spriteData.img
		.pipe(buffer())
		.pipe(glp.if(isProduction, glp.imagemin({
			progressive: true
		})))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(browserSync.reload({ stream: true }));

	spriteData.css
		.pipe(gulp.dest(path.join(
			projectConfig.root.src, projectConfig.styles.src, projectConfig.styles.sprites
		)));

	return spriteData;
});

/* ----------------------- *\
|| SpriteRaster PROCESSING ||
\* ----------------------- */

// =================================================================================================

/* -------------------- *\
-- SpriteSvg PROCESSING --
\* -------------------- */

gulp.task('spriteSvg', () => {
	return gulp.src([
		path.join(projectConfig.root.src, projectConfig.img.src, projectConfig.img.spriteSvg, './*.svg'),
		path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteSvg, './*.svg')
	])
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'SpriteSvg compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.svgSprite({
			svg: {
				xmlDeclaration: false
			},
			shape: {
				id: {
					separator: ''
				},
				dimension: {
					maxWidth: 32,
					maxHeight: 32
				}
			},
			mode: {
				symbol: {
					sprite: '../spriteSvg.svg',
					render: {
						scss: {
							dest: path.join('../../../', projectConfig.root.src, projectConfig.styles.src, projectConfig.styles.sprites, './_spriteSvg.scss'),
							template: path.join(projectConfig.root.src, projectConfig.styles.src, projectConfig.styles.sprites, './_spriteSvg.template.mustache')
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(browserSync.reload({ stream: true }));
});

/* -------------------- *\
|| SpriteSvg PROCESSING ||
\* -------------------- */

// =================================================================================================

/* -------------------- *\
-- ImgAssets PROCESSING --
\* -------------------- */

gulp.task('imgAssetsToWebp', () => {
	return gulp.src([
			projectConfig.root.src + projectConfig.img.src + '/**/*.{jpg,png}',
			'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.favicons + '/**/*.*',
			'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteRaster + '/**/*.*',
			'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteSvg + '/**/*.*'
		])
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'imgAssetsToWebp compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.changed(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(glp.webp({
			quality: 80,
			// preset: 'photo',
			method: 6
		}))
		// .pipe(glp.debug({
		// 	title: 'imgAssetsToWebp'
		// }))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(browserSync.reload({ stream: true }));
});


gulp.task('imgAssetsStandard', () => {
	return gulp.src([
		projectConfig.root.src + projectConfig.img.src + '/**' + projectConfig.img.extensions,
		'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteRaster + '/**/*.*',
		'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteSvg + '/**/*.*'
	])
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'imgAssetsStandard compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.changed(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(glp.if(isProduction, glp.imagemin([
			glp.imagemin.gifsicle({ interlaced: true }),
			imageminJpegRecompress({
				progressive: true,
				max: 85,
				min: 75
			}),
			imageminOptipng({ optimizationLevel: 3 }),
			glp.imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		])))
		// .pipe(glp.debug({
		// 	title: 'imgAssetsStandard'
		// }))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('imgAssets', gulp.series('imgAssetsToWebp', 'imgAssetsStandard'));

/* -------------------- *\
|| ImgAssets PROCESSING ||
\* -------------------- */

// =================================================================================================

/* ------------------------ *\
-- ImgComponents PROCESSING --
\* ------------------------ */

gulp.task('imgComponentsToWebp', () => {
	return gulp.src([
		path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsImg, './**/*.{jpg,png}'),
		'!' + path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteRaster, './**'),
		'!' + path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteSvg, './**')
	]
		, { base: path.join(projectConfig.root.src, projectConfig.root.componentsDirName) })
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'imgComponentsToWebp compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.rename((pathEl) => {
			const dirSep = require('path').sep;
			const dirs = pathEl.dirname.split(dirSep);

			dirs.splice(1, 1);
			pathEl.dirname = dirs.join(dirSep);
			return pathEl.dirname;
		}))
		.pipe(glp.changed(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(glp.webp({
			quality: 80,
			// preset: 'photo',
			method: 6
		}))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(browserSync.reload({ stream: true }));
});


gulp.task('imgComponentsStandard', () => {
	return gulp.src([
		path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsImg, './**/', projectConfig.img.extensions),
		'!' + path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteRaster, './**'),
		'!' + path.join(projectConfig.root.src, projectConfig.html.components, './**/', projectConfig.html.componentsSpriteSvg, './**')
	]
		, { base: path.join(projectConfig.root.src, projectConfig.root.componentsDirName) })
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'imgComponentsStandard compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.rename((pathEl) => {
			const dirSep = require('path').sep;
			const dirs = pathEl.dirname.split(dirSep);

			dirs.splice(1, 1);
			pathEl.dirname = dirs.join(dirSep);
			return pathEl.dirname;
		}))
		.pipe(glp.changed(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(glp.if(isProduction, glp.imagemin([
			glp.imagemin.gifsicle({ interlaced: true }),
			imageminJpegRecompress({
				progressive: true,
				max: 85,
				min: 75
			}),
			imageminOptipng({ optimizationLevel: 3 }),
			glp.imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		])))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.img.public)))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('imgComponents', gulp.series('imgComponentsToWebp', 'imgComponentsStandard'));

/* ------------------------ *\
|| ImgComponents PROCESSING ||
\* ------------------------ */

// =================================================================================================

/* ---------------- *\
-- FONTS PROCESSING --
\* ---------------- */

gulp.task('fonts', () => {
	return gulp.src(
		path.join(projectConfig.root.src, projectConfig.fonts.src, './**/*.{woff2,woff,ttf}'),
		{ base: path.join(projectConfig.root.src, projectConfig.fonts.src) }
	)
		.pipe(glp.plumber({
			errorHandler: glp.notify.onError({
				title: 'Fonts compilation error',
				icon: path.join('./tasks', '/icons/logo.png'),
				message: 'Error: <%= error.message %>',
				sound: false,
				wait: true
			})
		}))
		.pipe(glp.changed(path.join(projectConfig.root.public, projectConfig.fonts.public)))
		// .pipe(glp.debug({
		// 	title: 'fonts'
		// }))
		.pipe(gulp.dest(path.join(projectConfig.root.public, projectConfig.fonts.public)))
		.pipe(browserSync.reload({ stream: true }));
});

/* ---------------- *\
|| FONTS PROCESSING ||
\* ---------------- */

// =================================================================================================

/* -------- *\
-- WATCHERS --
\* -------- */

gulp.task('watch', (done) => {
	// Watching styles
	gulp.watch([
		projectConfig.root.src + projectConfig.styles.src + '/**/*.scss',
		projectConfig.root.src + projectConfig.styles.components + '/**/*.scss',
		'!' + projectConfig.root.src + projectConfig.styles.src + projectConfig.styles.components + '/_index.scss'
	], gulp.series('styles'));


	// Watching js
	gulp.watch([
		projectConfig.root.src + projectConfig.js.src + '/**/*.js',
		projectConfig.root.src + projectConfig.js.components + '/**/*.js',
		'!' + projectConfig.root.src + projectConfig.js.src + projectConfig.js.components + '/components.js'
	],
	gulp.series('js', reload));


	// Watching html
	gulp.watch([
		projectConfig.root.src + projectConfig.html.src + '/**/*.html',
		projectConfig.root.src + projectConfig.html.components + '/**/*.html'
	],
	gulp.series('html'));


	// Watching spriteRaster
	gulp.watch([
		projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteRaster + '/*.png',
		projectConfig.root.src + projectConfig.html.components + '/**' + projectConfig.html.componentsSpriteRaster + '/*.png'
	],
	gulp.series('spriteRaster'));


	// Watching spriteSvg
	gulp.watch([
		`${projectConfig.root.src}${projectConfig.img.src}${projectConfig.img.spriteSvg}/*.svg`,
		`${projectConfig.root.src}${projectConfig.html.components}/**${projectConfig.html.componentsSpriteSvg}/*.svg`
	],
	gulp.series('spriteSvg'));


	// Watching images from the components
	gulp.watch([
		`!${projectConfig.root.src}${projectConfig.html.components}/**/${projectConfig.html.componentsSpriteRaster}/**/*.*`,
		`!${projectConfig.root.src}${projectConfig.html.components}/**/${projectConfig.html.componentsSpriteSvg}/**/*.*`,
		`${projectConfig.root.src}${projectConfig.html.components}/**${projectConfig.html.componentsImg}/**${projectConfig.img.extensions}`
	],
	gulp.series('imgComponents'));


	// Watching images from the assets
	gulp.watch([
		projectConfig.root.src + projectConfig.img.src + '/**' + projectConfig.img.extensions,
		'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteRaster + '/*.*',
		'!' + projectConfig.root.src + projectConfig.img.src + projectConfig.img.spriteSvg + '/*.*'
	],
	gulp.series('imgAssets'));


	// Watching fonts
	gulp.watch(
		projectConfig.root.src + projectConfig.fonts.src + '/**/*.*',
		gulp.series('fonts')
	);


	done();
});

/* -------- *\
|| WATCHERS ||
\* -------- */
// =================================================================================================

/* ------------ *\
-- SERVE CONFIG --
\* ------------ */

const serverConfig = {
	logPrefix: 'sverstka.ru'
};

// https://github.com/BrowserSync/browser-sync/issues/646
if (projectOptions.proxy) {
	Object.assign(serverConfig, {
		open: 'external',
		host: projectOptions.proxyName,
		proxy: projectOptions.proxyName,
		serveStatic: ['public']
	});
}

if (projectOptions.tunnel) {
	Object.assign(serverConfig, {
		tunnel: true
		// tunnel: 'sverstka'
	});
}

if (!projectOptions.proxy) {
	Object.assign(serverConfig, {
		server: {
			baseDir: projectConfig.root.public
		}
	});
}

gulp.task('serve', (done) => {
	browserSync.init(serverConfig);

	done();
});

/* ------------ *\
|| SERVE CONFIG ||
\* ------------ */

// =================================================================================================

// Перезагрузка браузера
function reload(done) {
	browserSync.reload();
	done();
}

// =================================================================================================

// Таск для production-версии
gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('html', 'js', 'spriteRaster', 'spriteSvg', 'imgAssets', 'imgComponents', 'fonts'),
	'styles'
));

// Задача по умолчанию
gulp.task('default', gulp.series(
	'build',
	gulp.parallel(
		'watch',
		'serve'
	)
));



// =================================================================================================

// Таск для одноразовой обработки изображений
gulp.task('resizeImg', (done) => {

	// Директория, в которой находятся оригиналы изображений
	const directory = path.join('./src/components/gallery/img/thumbs/');
	// Директория, в которую отправляются обработанные изображения
	const toDirectory = path.join('./src/components/gallery/img/thumbs');

	fs.readdirSync(directory).forEach(file => {
		let fileName = file.match('(.+?)\.[^\.]+$');

		sharp(`${directory}/${file}`)
			.clone()
			.resize(575) // width, height
			.toFile(`${toDirectory}/to-sm/${fileName[1]}.jpg`);

		sharp(`${directory}/${file}`)
			.clone()
			.resize(475)
			.toFile(`${toDirectory}/to-lg/${fileName[1]}.jpg`);

		sharp(`${directory}/${file}`)
			.clone()
			.resize(358)
			.toFile(`${toDirectory}/to-xl/${fileName[1]}.jpg`);

		sharp(`${directory}/${file}`)
			.clone()
			.resize(405)
			.toFile(`${toDirectory}/to-xxl/${fileName[1]}.jpg`);

		sharp(`${directory}/${file}`)
			.clone()
			.resize(335)
			.toFile(`${toDirectory}/xxl/${fileName[1]}.jpg`);
	});


	done();
});

// =================================================================================================
