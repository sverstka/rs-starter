# SVG спрайты изображений
- tasks/spriteSvg.js - таск, обрабатывающий svg-спрайты

Изображения для svg-спрайтов должны находиться в следующих директориях:
- src/components/**componentName**/img/spriteSvg
- src/assets/img/spriteSvg

---

###### src/components/**componentName**/img/spriteSvg  
В этой директории находятся svg изображения для спрайтов, которые принадлежат
только компоненту **componentName**.

---

###### src/assets/img/spriteSvg  
В этой директории находятся svg изображения для спрайтов, которые являются
общими для нескольких компонентов. То есть, изображения, не принадлежащие одному
конкретному компоненту.

---

## Подключение svg-спрайтов
Svg-спрайты вставляются в html разметку так:

    <svg class="icon icon-logo">
        <use xlink:href="img/spriteSvg.svg#logo"></use>
    </svg>
    
Полифилл svg4everybody подключен в src/assets/js/polyfills/index.js.

Svg-изображения как из директории src/components/**componentName**/img/spriteSvg,
так и из директории src/assets/img/spriteSvg собираются в один общий svg-спрайт
public/img/spriteSvg.svg.

Хочу обратить внимание, что у svg-изображений атрибуты не удаляются во время
сборки в svg-спрайт.

