module.exports = {
	root: {
		src: './src',
		public: './public',
		componentsDirName: '/components'
	},
	html: {
		src: '/pages',
		components: '/components',
		helpers: '/helpers',
		componentsImg: '/img',
		componentsSpriteRaster: '/img/spriteRaster',
		componentsSpriteSvg: '/img/spriteSvg'
	},
	styles: {
		src: '/assets/styles',
		public: '/css',
		components: '/components',
		sprites: '/utilities/sprites'
	},
	js: {
		src: '/assets/js',
		public: '/js',
		components: '/components',
		extensions: [
			'.js',
			'.json'
		]
	},
	img: {
		src: '/assets/img',
		public: '/img',
		favicons: '/favicons',
		spriteRaster: '/spriteRaster',
		spriteSvg: '/spriteSvg',
		extensions: '/*.{jpg,jpeg,gif,png,svg,ico}'
	},
	fonts: {
		src: '/assets/fonts',
		public: '/fonts'
	}
};
