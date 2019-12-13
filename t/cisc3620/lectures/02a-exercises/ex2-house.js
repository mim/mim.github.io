// flipY moves the origin and flips the Y axis, so the coordinate system
// is more familiar, with the origin (0,0) in the lower left corner

function flipY(ctx) {
    var canvas = ctx.canvas;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.translate(0,h);
    ctx.scale(1,-1);
}   

function drawHouse(ctx,width,height,dx,dy) {
    var ridgex = width/2;
    var ridgey = height+width/2;
    // create the front part
    ctx.beginPath();
    ctx.lineTo(width,0);
    ctx.lineTo(width,height);
    ctx.lineTo(ridgex,ridgey);
    ctx.lineTo(0,height);
    ctx.lineTo(0,0);
    // create the back part
    ctx.lineTo(width,0);
    ctx.lineTo(width+dx,dy);
    ctx.lineTo(width+dx,height+dy);
    ctx.lineTo(ridgex+dx,ridgey+dy);
    ctx.lineTo(ridgex,ridgey);
    // draw the lines
    ctx.stroke();
}

function drawHouseAt(ctx,x,y,width,height,dx,dy) {
    ctx.save();
    ctx.translate(x,y);
    drawHouse(ctx,width,height,dx,dy);
    ctx.restore();
}

function redrawCanvas2() {
    var ctx = document.getElementById('canvas2').getContext('2d');
    // flip the coordinate frame
    ctx.save();
    flipY(ctx);

    // Draw background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    
    // drawHouseAt(ctx,x,y,width,height,dx,dy)
    drawHouseAt(ctx,200,50,30,40,10,6);
    ctx.restore();
}

window.addEventListener("load", function(event) {
    var canvas = document.createElement('canvas');
    canvas.id = "canvas2";
    canvas.width = 400;
    canvas.height = 250;
    var parent = document.getElementById('canvas2parent');
    parent.appendChild(canvas);

    redrawCanvas2();
});
