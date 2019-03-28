Я понимаю, что уже пора забыть про растровые спрайты, но, нужно не забывать, что
в проекте не исключены сложные градиенты, а svg и градиенты... У них сложные
взаимоотношения. Поэтому:

# Растровые спрайты изображений
- tasks/spriteRaster.js - таск, обрабатывающий растровые спрайты
   
Изображения для растровых спрайтов должны находиться в следующих директориях:
- src/components/**componentName**/img/spriteRaster/
- src/assets/img/spriteRaster/

---

###### src/components/**componentName**/img/spriteRaster/  
В этой директории находятся изображения для спрайтов, которые принадлежат только
компоненту **componentName**.

---

###### src/assets/img/spriteRaster/  
В этой директории находятся изображения для спрайтов, которые являются общими
для нескольких компонентов. То есть, изображения, не принадлежащие одному
конкретному компоненту.

---

## Подключение растровых спрайтов
 В файле src/components/**componentName**/**_componentName**.scss изображение
 подключается таким образом: 
  
     @include sprite($componentName);

Изображения для растровых спрайтов из директорий
src/components/**componentName**/img/spriteRaster/ и
src/assets/img/spriteRaster/ собираются в один общий спрайт.