# Javascript в сборщике

Файлы JS должны находиться в следующих директориях:  
- src/components/**componentName/**
- src/assets/js

---

###### src/components/**componentName/**  
В этой директории находится js-файл **componentName.js**, в котором пишется
js-код только для компонента **componentName**. В этот файл можно импортировать
плагины из node_modules. Как пример:

    import 'waypoints/lib/noframework.waypoints';
    import baguetteBox from 'baguettebox.js';

>В файл src/assets/js/components/components.js **АВТОМАТИЧЕСКИ** импортируются все js-файлы из компонентов:
**componentName/componentName.js**  

Также, в каждом компоненте предусмотрен файл jsSpecial.js, который необходимо подключать **ВРУЧНУЮ**.
Этот файл подключается вручную в src/assets/js/components-special/index.js таким образом:

    import '../../../components/btn/jsSpecial';

Файл **componentName/jsSpecial.js**  иногда бывает необходим. Например, необходимо последовательно
выполнить js-анимацию, которая принадлежит разным компонентам. Как пример:

    import animationToTop from 'animationToTop/jsSpecial';
    import animationToBottom from 'animationToBottom/jsSpecial';

    animationToTop(2500).chain(animationToBottom);
    
---

###### src/assets/js  
Данная директория имеет следующую структуру:


    src/assets/js/
        ├── components/                       директория подключения js компонентов
            ├── index.js                      файл подключения js компонентов
            ├── componentName.js              js-представление компонента АВТОМАТИЧЕСКИ подключаемое
            └── jsSpecial.js                  js-представление компонента подключаемое ВРУЧНУЮ
        ├── counters/                         директория счетчиков на сайт
            ├── bingWebmaster.js
            ├── googleAnalytics.js
            ├── googleSearchConsole.js
            ├── index.js                      файл подключения счетчиков на сайт
            ├── liveinternet.js
            ├── mailWebmaster.js
            ├── yandexMetrika.js
            └── yandexWebmaster.js
        ├── custom/                           директория пользовательских/собственных скриптов(костылей)
            └── index.js                      файл подключения кастомных скриптов
        ├── polyfills/                        директория полифиллов
            └── index.js                      файл подключения полифиллов
        ├── vendors/                          директория для вендорных библиотек/плагинов и т.д.
            └── index.js                      файл подключения вендоров
        └── main.js                           файл подключения всего js

---

Если желаете увидеть в консоли логгирование Webpack, то в файле gulpfile.js расскомментируйте 'new Log'.
