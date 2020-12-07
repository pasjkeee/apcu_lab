## ТЗ

Построить:
+ 3/4 окружности на основе рациональной кривой Безье 2-ой степени.
+ Открытый В-сплайн 2-ой степени, число опорных точек не меньше 11,
параметризация равномерная.

Полигоны обеих кривых совпадают по первой и последней опорным точкам,
графики совмещены
# Документация

Проект состоит из 5и документов:

| Название файла | Описание  | Расположение относительно корневой папки  |
| :-----: | :---------------: | :-: |
| index.html | Основной файл с разметкой страницы | ./ |
| style.css | Стили страницы | ./ |
| script_var.js | Файл с определением переменных среды | ./js/ |
| script_bez.js | Файл с функциями для кривой Безье | ./js/ |
| script_bSpl.js | Файл с функциями для B-spline | ./js/ |

_______

## index.html

В нём осуществляется подключение файла со стилями `.css`:

```html
     <link rel="stylesheet" type="text/css" href="style.css">
```

а также скрипт файлов `.js`

```html
    <script src="js/script_var.js"></script>
    <script src="js/script_bez.js"></script>
    <script src="js/script_bSpl.js"></script>
```

Так же осуществляется разметка блоков canvas, на которых будут отрисовываться кривые

```html
    <canvas id="bezier" width="220" height="220">
    Ваш браузер не поддерживает canvas.
    </canvas>
```

Каждому блоку присвоен уникальный id для обращения из файлов стилей `.css` и скрипт файлов `.js`, заданы ширина `width` и высота `height` блоков.

Так же блок `content` для вывода некоторых теоретических положений.


_______

## style.css

В файле добавлятся стили к блока, заданных в index.html

```css
max-width      /* Максимальная ширина блока */
padding        /* Внутрение отступы от границы блока */
margin         /* Внешние отступы от границы блока */

background     /* Цвет заднего фона */
box-shadow     /* Тени блока */

font-family    /* Шрифт текста */
font-size      /* Размер шрифта */

transition     /* Время анимаций */

display        /* Cвойство, которое определяет, как элемент должен быть показан в документе */
flex-direction /* Свойство flex блока */
align-items    /* Свойство flex блока */
overflow       /* Отображение контента за пределами блока */
```

_______

## script_var.js

В файле задаются необходимые пременные для взаимодействия скрипт `.js` файлов с блоками `canvas` в `index.html`


```javascript
const drawC = document.getElementById('bezier'),
      drawC01 = document.getElementById('bezier01'),
      drawC02 = document.getElementById('bezier02'),
      drawC03 = document.getElementById('bezier03'),
      drawC04 = document.getElementById('bezier04');
const ctx = drawC.getContext('2d'),
      ctx01 = drawC01.getContext('2d'),
      ctx02 = drawC02.getContext('2d'),
      ctx03 = drawC03.getContext('2d'),
      ctx04 = drawC04.getContext('2d');
```

Метод `document.getElementById()` возвращает ссылку на элемент, который имеет атрибут id с указанным значением.

Метод `HTMLCanvasElement.getContext()` возвращает контекст рисования на холсте.
`2d` ведёт к созданию объекта `CanvasRenderingContext2D`, представляющий двумерный контекст.




















