const glp = require('gulp-load-plugins')();
const path = require('path');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');

const projectConfig = require('./projectConfig');
// const projectOptions = require('./projectOptions');

// Определяем режим разработки: 'dev' или 'production и, соответственно,
// присваиваем переменные
const isDevelopment = glp.util.env.type === 'development';
const isProduction = glp.util.env.type === 'production';

let main;
let mode;
let minimize;
if (isDevelopment) {
	mode = 'development';
	minimize = false;
	main = [
		'./src/assets/js/main.js'
	];
} else if (isProduction) {
	mode = 'production';
	minimize = true;
	main = [
		'./src/assets/js/main.js'
	];
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
					loader: 'babel-loader'
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
			minimize,
			minimizer: [
				new TerserPlugin({
					exclude: /node_modules/,
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
		);
	}

	return webpackConfig;
};
