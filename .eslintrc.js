module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
		browser: true,
		jquery: true
	},
	plugins: [],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true
		}
	},
	extends: [
		'airbnb-base'
	],
	rules: {
		'strict': [0, 'global'],
		'func-names': 0,
		'global-require': 0,
		'function-paren-newline': ['error', 'consistent'],
		'comma-dangle': ['error', 'never'],
		'prefer-template': 0,
		'prefer-destructuring': 0,
		'no-console': 0,
		'indent': [2, 'tab', {'SwitchCase': 1}],
		'no-tabs': 0,
		'no-var': 0,
		'no-param-reassign': [2, {'props': false}],
		'no-trailing-spaces': ['error', {'skipBlankLines': true}],
		'arrow-body-style': 0,
		'no-plusplus': 0,
		'import/extensions': 0,
		'import/no-unresolved': 0,
		'import/no-extraneous-dependencies': 0
	}
};
