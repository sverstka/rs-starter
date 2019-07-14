module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-css-modules'
	],
	plugins: [
		'stylelint-order'
	],
	rules: {
		'comment-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: [
					'after-comment',
					'stylelint-commands'
				]
			}
		],
		'declaration-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['after-declaration']
			}
		],
		'selector-max-specificity': '0,2,0',
		'order/order': [
			'custom-properties',
			'declarations'
		],
		'number-leading-zero': 'never'
	}
};
