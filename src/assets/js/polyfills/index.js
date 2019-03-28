import './forEach';

import svg4everybody from 'svg4everybody';
import { detect } from 'detect-browser';

//= ============================================================================

const browser = detect();

//= ============================================================================

// Проверка поддержки браузером свойства стиля
// @source https://stackoverflow.com/questions/36191797/how-to-check-if-css-value-is-supported-by-the-browser
function stylePropertySupport(prop) {
	return prop in document.body.style;
}

//= ============================================================================

// Подключаем полифилл 'object-fit-images'
if (!stylePropertySupport('object-fit') || browser.name === 'ie' || browser.name === 'edge') {
	require.ensure([], (require) => {
		const objectFitImages = require('object-fit-images');

		objectFitImages();
	});
}

//= ============================================================================

// Подключаем полифилл svg4everybody
svg4everybody();

//= ============================================================================

