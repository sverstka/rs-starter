const glp = require('gulp-load-plugins')();
const path = require('path');
const webpack = require('webpack');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const PolyfillInjectorPlugin = require('webpack-polyfill-injector');

const projectConfig = require('./projectConfig');
// const projectOptions = require('./projectOptions');

// Определяем режим разработки: 'dev' или 'production и, соответственно,
// присваиваем переменные
const isDevelopment = glp.util.env.type === 'development';
const isProduction = glp.util.env.type === 'production';

var main;
var mode;
if (isDevelopment) {
	mode = 'development';
	main = [
		'./src/assets/js/main.js'
	];
} else if (isProduction) {
	mode = 'production';
	main = [
		'./src/assets/js/main.js'
	];
	// main = `webpack-polyfill-injector?${JSON.stringify({
	// 	modules: [
	// 		'./src/assets/js/main.js'
	// 	]
	// })}!`;
}


module.exports = () => {
	const webpackConfig = {
		entry: {
			main
		},
		mode,
		output: {
			publicPath: 'js/',
			path: path.resolve(__dirname, 'public/js'),
			filename: '[name].min.js',
			chunkFilename: '[name].min.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: [['es2015', { modules: false }]],
						plugins: ['syntax-dynamic-import']
					}
				}
			]
		},
		resolve: {
			modules: [
				'node_modules'
			],
			extensions: projectConfig.js.extensions
		},

		// optimization: {
		// 	splitChunks: {
		// 		cacheGroups: {
		// 			vendor: {
		// 				test: /[\\/]node_modules[\\/]/,
		// 				name: 'vendor',
		// 				chunks: 'initial'
		// 			}
		// 		}
		// 	}
		// },
		optimization: {
			minimizer: [
				new UglifyJSPlugin({
					uglifyOptions: {
						output: {
							comments: false
						}
					},
					parallel: true
				})
			]
		},

		plugins: [
			new webpack.ProvidePlugin({
				// $: 'jquery',
				// jQuery: 'jquery',
				// 'window.jQuery': 'jquery',
				// KUTE: 'kute.js'
			})
		]
	};

	if (isProduction) {
		webpackConfig.plugins.push(
			// new PolyfillInjectorPlugin({
			// 	polyfills: [
			// 		// Polyfills - https://github.com/Financial-Times/polyfill-service/tree/master/packages/polyfill-library/polyfills
			// 		// Polyfill names - https://polyfill.io/v2/docs/examples , https://polyfill.io/v3/url-builder/
			// 	],
			// 	// filename: 'polyfills/polyfill.'
			// 	filename: 'z-polyfill.'
			// })
		);
	}

	return webpackConfig;
};
