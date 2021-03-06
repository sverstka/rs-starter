# Общая информация по изображениям

В этом файле представлена общая информация по изображениям. О спрайтах
изображений информация находится в файлах docs/imagesSpriteRaster.md и
docs/imagesSpriteSvg.md.

Сборщик обрабатывает изображения форматов jpg, jpeg, gif, png, svg, ico.  
Все изображения находятся в src/assets/img и в
src/components/**componentName**/img.  
Во время dev-разработки изображения не оптимизируются. Оптимизируются только в
режиме prod.

Изображения должны быть только в:
- src/components/**componentName**/img
- src/assets/img

---


###### src/components/**componentName**/img 
Все изображения, которые принадлежат компоненту, должны находиться в директории
самого компонента.  
В каждом компоненте(src/components/**componentName**/) можно создать директорию
img со следующей файловой структурой:

    img/
        ├── spriteRaster/
        └── spriteSvg/
        
Кроме этого, в директорию src/components/**componentName**/img  можно класть
изображения вне директорий, можно создавать свои директории и класть в них
изображения - все изображения будут обработаны.


---


###### src/assets/img  
В этой директории находятся изображения, которые являются общими для нескольких
компонентов. Либо, как пример, favicons. То есть, все изображения, не
принадлежащие одному конкретному компоненту.  
В этой директории можно создать следующую файловую структуру:

    img/
        ├── spriteRaster/
        └── spriteSvg/
        
Кроме этого, в директорию src/assets/img  можно класть изображения вне
директорий, можно создавать свои директории и класть в них изображения - все
изображения будут обработаны.


---


Все изображения из директорий src/components/**componentName**/img и
src/assets/img будут обработаны и перенесены в директорию public/img в
соответствии с названиями компонентов, в соответствии с названиями
директорий в директории src/assets/img. Спрайты изображений будут объединены в
один общий спрайт.

