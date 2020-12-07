
function getT(len) {
    len = len - 2;
    console.log(len);
    let t = [];
    let p = 2; //стпень функции
    let n = len; //число опорных точек count - 1 m = 
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

console.log(getT());


function getKdB(res, i, j, t) { //Ni - ti Np+1 - tk Np - порядок функции
    
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
    
            
    console.log(res);
    return res;
}


if (drawC && drawC.getContext) {
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;

    let flow; // Массив точек
    let arr = [];
    // 1
    arr[0] = new Array(10, 110);
    arr[1] = new Array(10, 210);
    arr[2] = new Array(110, 210);
    arr[3] = new Array(210, 210);
    arr[4] = new Array(210, 110);
    arr[5] = new Array(210, 10);
    arr[6] = new Array(110, 10);
    flow = getBspline(new Array(...arr, 0.005));
    drawLines(ctx, flow, "blue");
    draw(ctx, new Array(...arr), "grey");
    drawLines(ctx02, flow, "green");
    draw(ctx02, new Array(...arr), "red");
    const b = document.getElementsByClassName('bspline');
    const element = document.createElement('div');
    for(let j = 0; j < arr.length; j++){
       element.insertAdjacentHTML('beforeend', `
        Точка номер ${j+1} : x = ${arr[j][0]} y = ${arr[j][1]} <br>`);
        b[0].append(element);
    }
    const el2 = document.createElement('div');
    element.insertAdjacentHTML('beforeend', `
    <div class="title" >Формула для вычисления B-spline: </div>
    <div style = "display: flex; align-items: center; " ><img src="src/qq.gif" alt=""> = <img src="src/0t_pic.gif" alt=""><div>
    <div style = "display: flex; align-items: center; " ><img src="src/qw.gif" alt=""> = <img src="src/1st_pic.gif" alt=""><div>
    <div><img src="src/2nd_pic.gif" alt=""><div>
    `);
    b[0].append(el2);
    b[0].addEventListener('mouseover', ()=>{
        drawC02.style.cssText ="box-shadow: 0px 15px 15px rgba(212, 87, 87, 0.2); transform: scale(1.25);";
    });
    b[0].addEventListener('mouseout', ()=>{
        drawC02.style.cssText ="box-shadow: 0px 15px 15px rgba(0, 0, 0, 0.2);  transform: scale(1);";
    });


    let arr1 = [];
    arr1[0] = new Array(66, 175);
    arr1[1] = new Array(207, 422);
    arr1[2] = new Array(300, 300);
    arr1[3] = new Array(384, 471);
    arr1[4] = new Array(502, 360);
    arr1[5] = new Array(546, 203);
    arr1[6] = new Array(494, 119);
    arr1[7] = new Array(430, 196);
    arr1[8] = new Array(408, 26);
    arr1[9] = new Array(300, 200);
    arr1[10] = new Array(232, 37);
    flow = getBspline(new Array(...arr1, 0.01));
    drawLines(ctx03, flow, "red");
    draw(ctx03, new Array(...arr1), "grey");
    const canv3 = document.querySelector('.canv3');
    const el4 = document.createElement('div');
    for(let j = 0; j < arr1.length; j++){
       el4.insertAdjacentHTML('beforeend', `
        Точка номер ${j+1} : x = ${arr1[j][0]} y = ${arr1[j][1]} <br>`);
        canv3.append(el4);
    }
}


    let arrUser = [];
    arrUser[0] = new Array(10, 110);
    arrUser[1] = new Array(10, 210);
    draw(ctx04, new Array(...arrUser), "grey");
    drawC04.addEventListener('click', (e)=> {
        let x = e.pageX,
        y = e.pageY;
        let x1 = x - drawC04.offsetLeft;
        let y1 = y-drawC04.offsetTop;
        let ar = new Array(x1, y1);
        arrUser.push(ar);
        ctx04.clearRect(0, 0, 1000, 1000);
        flow = getBspline(new Array(...arrUser, 0.01));
        drawLines(ctx04, flow, "red");
        draw(ctx04, new Array(...arrUser), "grey");

        const canv4 = document.querySelector('.canv4-item');
        canv4.innerHTML = " ";
        const el5 = document.createElement('div');
        for(let j = 0; j < arrUser.length; j++){
           el5.insertAdjacentHTML('beforeend', `
            Точка номер ${j+1} : x = ${arrUser[j][0]} y = ${arrUser[j][1]} <br>`);
            canv4.append(el5);
        }
      });