const { ignore } = require('./node_modules/@jetbrains/eslint-config/consts');

module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
		browser: true,
		jquery: true
	},
	extends: [
		'./node_modules/@jetbrains/eslint-config/index.js',
		'./node_modules/@jetbrains/eslint-config/es6.js',
		'./node_modules/@jetbrains/eslint-config/node.js'
	],
	rules: {
		'import/no-commonjs': ignore,
		'dot-location': ['error', 'property']
	}
};
