// Генератор компонента.

// Структура компонента:
// componentName/                      		# Сам компонент
//          ├── img/						# Изображения для этого компонента (поддиректории поддерживает)
// 				├── spriteRaster/			# Директория для растровых спрайтов
// 				└── spriteSvg/				# Директория для спрайта svg
//			├── componentName.html          # Html-представление компонента
//          ├── _componentName.scss         # Css-представление компонента
//          ├── componentName.js			# Js-представление компонента
//          └── jsSpecial.js				# Js-файл со скриптами, которые подкл. вручную

// Using: node crc [component name]

const fs = require('fs');
const mkdirp = require('mkdirp');

const projectConfig = require('./projectConfig.js');
const dirs = projectConfig.root;

const componentName = process.argv[2]; // get the name of the component
const directoriesList = ['img', 'spriteRaster', 'spriteSvg'];
const filesList = ['html', 'scss', 'js', 'jsSpecial'];


// Create component
if (componentName) {
	const componentPath = `${dirs.src + dirs.componentsDirName}/${componentName}/`;

	mkdirp(componentPath, (err) => {
		if (err) {
			console.error(`[sverstka.ru] Отмена операции: ${err}`);
		}
		else {
			console.log(`[sverstka.ru] Создание директории ${componentPath}`);

			//==================================================================

			// Create directories
			let directoryPath;
			directoriesList.forEach((directory) => {
				if (directory === 'spriteRaster') {
					directoryPath = `${componentPath}img/spriteRaster/`;
				} else if (directory === 'spriteSvg') {
					directoryPath = `${componentPath}img/spriteSvg/`;
				} else {
					directoryPath = `${componentPath + directory}`;
				}

				if (fileExist(directoryPath) === false) {
					let directoryPathInner = directoryPath;
					mkdirp(directoryPath, (err) => {
						if (err) {
							return console.log(`[sverstka.ru] Директория НЕ СОЗДАНА: ${err}`);
						} else {
							console.log(`[sverstka.ru] Создание директории: ${directoryPathInner}`)
						}
					});
				} else {
					console.log(`[sverstka.ru] Создание директории: ${directoryPath} НЕ СОЗДАНА (уже существует) `);
				}
			});

			//==================================================================

			// Create files
			let filePath;
			filesList.forEach((file) => {
				if (file === 'scss') {
					filePath = `${componentPath}_${componentName}.${file}`;
				} else if (file === 'js') {
					filePath = `${componentPath}${componentName}.js`;
				} else if (file === 'jsSpecial') {
					filePath = `${componentPath}jsSpecial.js`;
				} else {
					filePath = `${componentPath + componentName}.${file}`;
				}

				// Add content to files
				let fileContent = '';
				if (file === 'html') {
					// fileContent = `<!--DEV ${componentName} -->`;
					fileContent = `
<!-- end .${componentName} -->
`;
				} else if (file === 'scss') {
					fileContent = `.${componentName} {
  &__ {}
}


// modifiers
.${componentName}--modifiersName {

  &.${componentName} {
  }

  .${componentName} {
    &__ {
    }
  }
}`;
				} else {
					fileContent = '';
				}

				// Create a file if it does not already exist
				if (fileExist(filePath) === false) {
					let filePathInner = filePath;
					fs.writeFile(filePath, fileContent, (err) => {
						if (err) {
							return console.log(`[sverstka.ru] файл НЕ СОЗДАН: ${err}`);
						} else {
							console.log(`[sverstka.ru] Создание файла: ${filePathInner}`);
						}
					});
				} else {
					console.log(`[sverstka.ru] Создание файла: ${filePath} файл НЕ СОЗДАН (уже существует)`);
				}

			});

			//==================================================================
		}
	})

} else {
	console.log('[sverstka.ru] Отмена операции: не указано имя компонента');
}


// Check exist
function fileExist(path) {
	const fs = require('fs');
	try {
		fs.statSync(path);
	} catch (err) {
		return !(err && err.code === 'ENOENT');
	}
}
