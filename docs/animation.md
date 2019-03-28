# Работа с анимацией

В директории src/assets/styles/vendor/animation находятся файлы библиотек с css
анимацией. Эти библиотеки **НЕ** подключены к стилям. Просто выбираем вручную
нужную анимацию и вставляем стили этой анимации в требуемый компонент.

Это такие популярные библиотеки, как:  
1. animate.css  
    Страница, на которой можно выбрать анимацию:
    https://daneden.github.io/animate.css/

    Гитхаб:
    https://github.com/daneden/animate.css

2. magic.css
    Страница, на которой можно выбрать анимацию:
    https://minimamente.com/example/magic_animations/

    Гитхаб:
    https://github.com/miniMAC/magic

3. mimic.css
    Страница, на которой можно выбрать анимацию:
    https://erictreacy.me/mimic.css/

    Гитхаб:
    https://github.com/erictreacy/mimic.css

4. tuesday.css
    Страница, на которой можно выбрать анимацию:
    http://shakrmedia.github.io/tuesday/
    Инструкция по использованию:
    https://making.shakr.com/making-tuesday-building-a-css-animation-library-from-scratch-196e5273cb3a

    Гитхаб:
    https://github.com/shakrmedia/tuesday
    
    
#### Как пользоваться.
###### При скролле
Вы можете использовать эти файлы на своё усмотрение. То, что написано ниже -
скорее инструкция для меня.  
Элементу, к которому планируется применение анимации, с помощью js присваиваем
класс .hidden либо .visible. Затем, при скролле с помощью js к этому элементу
присваиваем классы .animated, класс выбранной анимации из библиотек, которые
находятся в src/assets/styles/vendor/animation. Выбранную анимацию css
прописываем в src/assets/styles/states/_animation.scss. Также, в зависимости от
того появляется элемент в результате анимации, либо исчезает - присваиваем с
помощью js либо .hidden, либо .visible этому элементу.

###### При ховере
Я думаю, что здесь можно ничего не писать)

