module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss'
  ],
  ignoreFiles: [],
  rules: {
    'block-no-empty': null,
    'number-leading-zero': 'never',
    'declaration-empty-line-before': 'never',
    'selector-pseudo-element-colon-notation': 'single',
    'color-no-invalid-hex': true,
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    'function-comma-space-after': 'always',
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',
    'media-feature-name-no-vendor-prefix': true,
    'max-empty-lines': 5,
    'number-no-trailing-zeros': true,
    'property-no-vendor-prefix': true,
    'selector-list-comma-space-before': 'never',
    'selector-list-comma-newline-after': 'always',
    'comment-whitespace-inside': 'never',
    'string-quotes': [
      'single',
      {
        message: 'Кавычки должны быть одинарные'
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {ignorePseudoClasses: ['input-placeholder']}
    ],
    'value-no-vendor-prefix': true,
    'scss/at-rule-no-unknown': [
      true,
      {
        'ignoreAtRules': [
          'elseif'
        ]
      }
    ]
  }
};
