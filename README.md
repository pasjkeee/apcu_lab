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


_______

## script_bez.js

### Немного теории:
Кривая Безье является частным случаем многочленов Бернштейна, представляет собой параметрическую кривую и задаётся выражением:

![Иллюстрация к проекту](https://wikimedia.org/api/rest_v1/media/math/render/svg/3ee11d1b4d207a9b6fd9463bbbc9cbd649c07294)

n — количество опорных точек;

i — номер опорной точки;

t — шаг на котором мы считаем положение кривой. К примеру, при построении кривой по 100 точкам, шаг будет 0,01 (не опорным, а точкам на самой кривой);

Р — в нашем случае координата опорной точки;

b(t) — базисная функция кривой Безье. 

Файл включает в себя 4 основные функции:

_______

### `getBezierBasis`

```javascript
function getBezierBasis(i, n, t) {
    function f(n) {
        return (n <= 1) ? 1 : n * f(n - 1);
    }
    return (f(n)/(f(i)*f(n - i)))* Math.pow(t, i)*Math.pow(1 - t, n - i);
}
```

Это базисная функция кривой Безье. Этот коэффициент, определяет вес опорной точки. Является собственно полином Бернштейна:

![бзаис](https://wikimedia.org/api/rest_v1/media/math/render/svg/214de6a8893a07bb1ac8dbb731089f7f8f8cdaaa)

где ![бзаис1](https://wikimedia.org/api/rest_v1/media/math/render/svg/bc715fc56b0183482b26546b19834ca97a64990a)
это число сочетаний из n по i, где n — степень полинома, i — порядковый номер опорной вершины.

_______

### `getBezierCurve(arr, step, w)`

```javascript
function getBezierCurve(arr, step, w) {
    if (step === undefined) {
        step = 0.01;
    }
    var res = [];

    step = step / arr.length;
    
    for (var t = 0.0; t < 1 + step; t += step) {
        if (t > 1) {
            t = 1;
        }
        
        var ind = res.length;
        
        res[ind] = new Array(0, 0, 0, 0);
        
        for (var i = 0; i < arr.length; i++) 
        {
            var b = getBezierBasis(i, arr.length - 1, t);
            
            res[ind][0] += arr[i][0] * b*w[i];
            res[ind][1] += b*w[i];
            res[ind][2] += arr[i][1] * b*w[i];
            res[ind][3] += b*w[i];
        }
        res[ind][0]=res[ind][0]/res[ind][1];
        res[ind][1]=res[ind][2]/res[ind][3];
    }
    return res;
}
```
 Это функция возвращает массив точек 'res' по которым будет строиться кривая
 
 Она приминимает как аргументы:
 
 `arr` - массив входных точек
 
 `step` - шаг с которым будет строится массив для построения кривой
 
  Входной шаг делится на длину массива для лучшей точности
 
 `w` - массив выесов для каждой входной точки
 
 _______
 
 
 ### `drawLines` и `draw`
 
```javascript 
function drawLines(ctx, arr, linecolor) {
    var i = 0;

    function delayDraw(linecolor) {
        if (i >= arr.length - 1) {
            return;
        }

        ctx.moveTo(arr[i][0],arr[i][1]);
        ctx.lineTo(arr[i+1][0],arr[i+1][1]);
        ctx.strokeStyle = linecolor;
        ctx.stroke();
        ++i;
        delayDraw(linecolor);
    }
        delayDraw(linecolor);
}

function draw(ctx, arr, linecolor) {
    ctx.beginPath();
    ctx.moveTo(arr[0][0],arr[0][1]);
     for(var i=1; i<arr.length;i++)
     {
      ctx.lineTo(arr[i][0],arr[i][1]);
     }
     ctx.strokeStyle = linecolor;
      ctx.stroke();
    }

```

 Она приминимает как аргументы:
 
 `arr` - массив точек для построения кривой
 
 `ctx` - контекст для поверхности рисования элемента <canvas>, на которой кривая будет нарисована
 
 `linecolor` - цвет кривой

Метод `moveTo()` передвигает точку контура в заданные координаты не рисуя линию

Метод `lineTo()` добавляет новую точку контура и создает линию к этой точке от последней заданной точки.

Метод `stroke()` в действительности рисует фигуру, контур которой был задан ранее.


 _______
 
 
 ### Дополнительно
 
+ Прописан вывод исходных точек, по которым рисуется кривая.
 
+ При наведение на блок с теорией, теория и соответсвующая ей кривая подсвечивается соответсвющими цветами.
 
+ При наведении на центральный блок (где совмещены две кривые), происходит увеличение блока в 2 раза

+ Вывод краткой теории

+ Вывод входных точек, по которым расчитана кривая

_______

## script_bSpl.js

### Немного теории:


Зададим вектор узлов 

![ads](https://mathworld.wolfram.com/images/equations/B-Spline/NumberedEquation1.gif) 

как неубывающую последовательность.  

Узлы в этой последовательности могут повторяться. 

Данный вектор разбивает исходную область определения на m узлов.

Зададим контрольные точки D = ![sdfdf](https://gamedev.ru/files/images/image029.gif) (по аналогии с кривой Безье).

Число p = m - n - 1 называют - степенью b-spline’a. 

Определение б-сплайна вводится так: 

![sdsdffdf](https://mathworld.wolfram.com/images/equations/B-Spline/NumberedEquation3.gif)

Nip(t) - базисная функция (i, p)
Pi  - контрольная точка i

Значение точки кривой в узловой точке C(ti) называют узловой точкой.

Базисная функция  Nip рассчитывается по рекуррентным формулам Кокса-де-Бура:

![sdsdfssfdf](https://github.com/pasjkeee/apcu_lab/blob/master/src/bbb.JPG?raw=true)

Если вектор узлов не обладает никакой специфической структурой, то получаемая кривая не будет касаться первого и последнего отрезка полилинии, построенной по контрольным точкам. Такие кривые называют открытыми (open B-Spline).



