# rs-starter

Стартовый комплект для создания статических сайтов. 


## Некоторые фичи
- **HTML** - все компоненты собираются при помощи npm пакета
['gulp-file-include'](https://www.npmjs.com/package/gulp-file-include).
- **CSS** - в качестве препроцессора для css используется SCSS. scss-файлы
компонентов автоматически прописываются в src/assets/styles/components/_index.scss
- **JS** - используется Webpack, Babel.
- **Спрайты изображений** - растровые и SVG спрайты.


## Идея
Вся верстка состоит из компонентов(блоков).

Каждый компонент находится внутри своей директории src/components/**componentName**.
 
В каждом компоненте предусмотрена такая файловая структура

    src/components/
            └── componentName/                        Непосредственно сам компонент
                ├── img/                              Изображения для этого компонента (поддиректории поддерживает)
                    ├── spriteRaster/                 Директория изображений для растровых спрайтов
                    └── spriteSvg/                    Директория изображений для svg спрайтов
                ├── componentName.html                html-представление компонента
                ├── _componentName.scss               scss-представление компонента
                ├── componentName.js                  js-представление компонента АВТОМАТИЧЕСКИ подключаемое
                └── jsSpecial.js                      js-представление компонента подключаемое ВРУЧНУЮ
                
В самом компоненте может отсутствовать html-разметка. Или стили. Или и то, и
и другое. Возможно, мы в проекте добавили компонент при помощи Javascript,
поэтому в разметке не будет html-разметки. Главное, если в верстке мы увидели
у какого-нибудь элемента класс, состоящий из одного слова(либо несколько слов
через дефис), то это компонент и его нужно искать в src/components.

- html-разметка компонентов собирается при помощи npm пакета
['gulp-file-include'](https://www.npmjs.com/package/gulp-file-include).
    Подробнее docs/html.md.
- scss файлы компонентов АВТОМАТИЧЕСКИ собираются в src/assets/styles/components/_index.scss.  
    Подробнее docs/styles.md.
- js файлы компонентов файлов componentName.js АВТОМАТИЧЕСКИ  прописываются в 
    src/assets/js/components/components.js. Подробнее docs/js.md.
- изображения компонентов автоматически собираются в public/img в директории,
    имеющие такие же названия, как и названия компонентов.  
    Подробнее docs/images.md.
-  спрайты изображений компонентов собираются в public/img в спрайты
    spriteRaster.png и spriteSvg.svg.  
    Подробнее docs/imagesSpriteRaster.md, docs/imagesSpriteSvg.md.
    
    
### Быстрый старт
1. Клонируем этот репозиторий
2. Установка зависимостей:  
`yarn`  
или  
`npm install`
3. Режим разработки:  
`yarn dev`  
или  
`npm run dev`
4. Генерация production версии проекта:  
`yarn prod`  
или  
`npm run prod`
    
    
### Документация
Документация находится в директории docs. 

---

## Пункты, которые не вошли в документацию

###### Расшарить верстку в интернет
В файле projectOptions.js свойству "tunnel" прописываем true. После запуска
сборщика, в консоли выведется что-то подобное:
'Tunnel: https: //cowardly-yak-64.localtunnel.me'. Это будет адрес, перейдя по
которому, мы можем видеть верстку в интернете.


###### Комментирование для разработчиков
Для html-файлов можно использовать комментарии вида:

    <!--dev Комментарий -->
    
Такие комментарии не попадут в собранный html.


###### Использование proxy
Если требуется использование proxy, то в файле projectOptions.js свойству
"proxy" прописываем true, а свойству "proxyName" прописываем имя. Имя прокси
должно быть такое же, как и имя локального сайта.


###### Использование компонента src/components/pageWidget
Этот компонент создан для сопроводительных целей при вёрстке. В нём есть:
- директория pixelPerfect для хранения изображений каждой страницы для
ипользования в Pixel Perfect
- директория psd для хранени psd
- плагин pageWidget.js для быстрой навигации по статичной верстке
