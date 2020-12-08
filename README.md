# Можно запустить прямо в браузере

https://jsfiddle.net/pasjkeee/0Lnpwgjo/14/

(чертёж B-spline'a пользователем не до конца корректно работает на этом сайте)


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


## Структура фалов:

<pre>
apcu_lab
├── index.html 
├── style.css  
├── README.md  
├── js/   
│   ├── script_var.js   
│   ├── script_bez.js   
│   └── script_bSpl.js  
└── src/ ...  
</pre>
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

### Ещё немного теории:


Зададим вектор узлов ![ads](https://mathworld.wolfram.com/images/equations/B-Spline/NumberedEquation1.gif) как неубывающую последовательность.  

Узлы в этой последовательности могут повторяться. 

Данный вектор разбивает исходную область определения на m узлов.

Зададим контрольные точки D = ![sdfdf](https://gamedev.ru/files/images/image029.gif) (по аналогии с кривой Безье).

Число `p = m - n - 1` называют - степенью b-spline’a. 

Определение б-сплайна вводится так: 

![sdsdffdf](https://mathworld.wolfram.com/images/equations/B-Spline/NumberedEquation3.gif)

`Nip(t)` - базисная функция (i, p)
`Pi`  - контрольная точка i

Значение точки кривой в узловой точке C(ti) называют узловой точкой.

Базисная функция  Nip рассчитывается по рекуррентным формулам Кокса-де-Бура:

![sdsdfssfdf](https://github.com/pasjkeee/apcu_lab/blob/master/src/bbb.JPG?raw=true)



Файл включает в себя 3 основные функции:

_______


 ### `getT`
 
 
 ```javascript
 function getT(len) {
    len = len - 2;
    let t = [];
    let p = 2; 
    let n = len;
    let x = p + n + 2;
    for (let i = 0; i < p + 1; i++) {
        t[i] = 0;
    }
    for (let i = p + 1; i < x - p - 1; i++) {
        t[i] = (i - p) / (n - p + 1);
    }
    for (let i = x - p - 1; i < x; i++) {
        t[i] = 1;
    }
    return t;
}
 ```
 
 Функция для расчёта вектора параметризации. 
 
 На вход подаётся агрумент `len` - длина массива входных точек.
 
 Длина его равна `n+p+2`.

 Первые `p + 1` точки равны 0
 
 Последние `p + 1` точки равны 1
 
 
 
_______


 ### `getKdB`
 
 
  ```javascript
 function getKdB(res, i, j, t) { 
    
    if(j === 0)
    {
        if( t >= res[i] && t < res[i + 1]){
            return 1; } else {
                return 0;
            }
    } 
        let memb1 = (res[i+j] - res[i]) ? ((t - res[i]) / (res[i + j] - res[i])) : 0,
            memb2 = (res[i + j + 1] - res[i + 1]) ? ((res[i + j + 1] - t) / (res[i + j + 1] - res[i + 1])) : 0;
        return (memb1 * getKdB(res, i, j - 1, t) + memb2 * getKdB(res, i + 1, j - 1, t)); 
}
 ```
 
 
 Функция, реализующая формулу Кокса-де-Бура.
 
  На вход подаются агрументы:
  
  `res` - вектор параметризации
  
  `i` - номер входной контрольной точки
  
  `j` - степень B-spline
  
  `t` - шаг с которым будут вычисляться точки массива для построения сплайна
  
  
  _______


 ### `getBspline`
 
 
  ```javascript
  
  function getBspline(arr, step) {
    if (step === undefined) {
        step = 0.01;
    }
    
    let res = [];
    let t1 = getT(arr.length);
    step = step / arr.length;
    
    for (let t = 0.0; t < 1; t += step) {
        if (t > 1) {
            t = 1;
        }
        
        let ind = res.length;
        
        res[ind] = new Array(0, 0);
        for (let i = 0; i < arr.length - 1; i++) 
        {
            let b = getKdB(t1, i, 2, t);
            res[ind][0] += arr[i][0] * b;
            res[ind][1] += arr[i][1] * b;
        }
    }
    
    return res;
}
  
  ```
  
  Это функция возвращает массив точек 'res' по которым будет строиться кривая
 
 Она приминимает как аргументы:
 
 `arr` - массив входных точек
 
 `step` - шаг с которым будет строится массив для построения кривой
 
  Входной шаг делится на длину массива для лучшей точности
 
 
  _______
 
 
 ### Дополнительно
 
+ Прописан вывод исходных точек, по которым рисуется кривая.
 
+ При наведение на блок с теорией, теория и соответсвующая ей кривая подсвечивается соответсвющими цветами.

+ Вывод краткой теории

+ Вывод входных точек, по которым расчитана кривая

+ Вывод совмещенных кривой Безье и B-spline'a

+ Реализован ввод точек от пользователя, путём нажатия на экран


Метод `EventTarget.addEventListener()` регистрирует определенный обработчик события, вызванного на EventTarget.

События мыши:

+ `click` – происходит, когда кликнули на элемент левой кнопкой мыши (на устройствах с сенсорными экранами оно происходит при касании).

+ `mouseover` / `mouseout` – когда мышь наводится на / покидает элемент.

Выcчитывание координат:

+ Свойство `offsetLeft` содержит левое смещение элемента относительно offsetParent. Содержит расстояние от `offsetParent` до границы элемента.

+ `offsetTop` - свойство элемента доступно только для чтения, возвращает расстояние текущего элемента по отношению к верхней части `offsetParent` узла.

+ Свойство `event.pageX` содержит в себе расстояние от левой границы документа до курсора с учетом прокрутки.

+ Свойство `event.pageY` содержит в себе расстояние от начала документа до курсора с учетом прокрутки.

Таким образом координата вычисляется вычитанием из соотвествующего расстояния до конца document (то есть полного размера стриницы с учетом прокрутки) расстояние без учета прокрутки.
