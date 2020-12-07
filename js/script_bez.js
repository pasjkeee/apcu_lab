
function getBezierBasis(i, n, t) {

    function f(n) {
        return (n <= 1) ? 1 : n * f(n - 1);
    }
    
    return (f(n)/(f(i)*f(n - i)))* Math.pow(t, i)*Math.pow(1 - t, n - i);
}


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


    

if (drawC && drawC.getContext) {
    ctx.lineWidth=1;
    
    var flow; // Массив точек
    const arr = new Array();
    // 1
    arr[0] = new Array(10, 110);
    arr[1] = new Array(10, 210);
    arr[2] = new Array(110, 210);
    const flow1 = getBezierCurve(new Array(arr[0], arr[1], arr[2]), 0.005, new Array(1, 1/Math.sqrt(2), 1)); 
    //drawLines(ctx, flow);
    arr[3] = new Array(110, 210);
    arr[4] = new Array(210, 210);
    arr[5] = new Array(210, 110);
    const flow2 = getBezierCurve(new Array(arr[3], arr[4], arr[5]), 0.005, new Array(1, 1/Math.sqrt(2), 1)); 
    //drawLines(ctx, flow);
    arr[6] = new Array(210, 110);
    arr[7] = new Array(210, 10);
    arr[8] = new Array(110, 10);
    const flow3 = getBezierCurve(new Array(arr[6], arr[7], arr[8]), 0.005, new Array(1, 1/Math.sqrt(2), 1)); 
    var flows = flow1.concat(flow2, flow3);
    drawLines(ctx, flows, "green");
    draw(ctx, new Array(...arr), "red");
    drawLines(ctx01, flows, "red");
    draw(ctx01, new Array(arr[0], arr[1], arr[2],arr[3], arr[4], arr[5],arr[6], arr[7], arr[8]), "green");
   

    const a = document.getElementsByClassName('bez');
    console.log(a);
    const element = document.createElement('div');
    for(let j = 0; j < arr.length; j++){
       element.insertAdjacentHTML('beforeend', `
        Точка номер ${j+1} : x = ${arr[j][0]} y = ${arr[j][1]} <br>`);
        a[0].append(element);
    }
    const el3 = document.createElement('div');
    element.insertAdjacentHTML('beforeend', `
    <div class="title" >Формула для вычисления B-spline: </div>
    <div><img src="src/bez1.jpg" alt=""><div>
    <div><img src="src/bez2.jpg" alt=""><div>
    `);
    a[0].append(el3);
    a[0].addEventListener('mouseover', ()=>{
        drawC01.style.cssText ="box-shadow: 0px 20px 20px rgba(45, 199, 24, 0.2); transform: scale(1.25);";
    });
    a[0].addEventListener('mouseout', ()=>{
        drawC01.style.cssText ="box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.2); transform: scale(1);";
    });

    drawC.addEventListener('mouseover', ()=> {
        drawC.style.cssText = "transform: translateY(140px) scale(2);";
    });
    drawC.addEventListener('mouseout', ()=> {
        drawC.style.cssText = "transform: translateY(0px) scale(1);";
    });


}


