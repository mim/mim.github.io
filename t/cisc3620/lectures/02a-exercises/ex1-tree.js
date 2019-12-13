// flipY moves the origin and flips the Y axis, so the coordinate system
// is more familiar, with the origin (0,0) in the lower left corner

function flipY(ctx) {
    var canvas = ctx.canvas;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.translate(0,h);
    ctx.scale(1,-1);
}   

function drawFilledCircle(ctx,centerx,centery,radius) {
    /* draws a filled circle at the given location, with
       the given radius */
    ctx.beginPath();
    ctx.arc(centerx,centery,radius,0,2*Math.PI);
    ctx.fill();
}

function drawTree1(ctx,height,width,radius) {
    /* Draws a tree with the lower left corner at the origin.
       The trunk has the given height and width, and the leaves
       have the given radius */

    // trunk is a brown rectangle
    ctx.fillStyle = "brown";
    ctx.fillRect(0,0,width,height);
    // leaves are a green circle
    ctx.fillStyle = "green";
    var cx = width/2;
    var cy = height+radius;
    drawFilledCircle(ctx,cx,cy,radius);
}

function drawTreeAt(ctx,x,y,height,width,radius) {
    /* Draws a tree at the (x,y) location. Other args
       passed on to drawTree1 */
    ctx.save();
    ctx.translate(x,y);
    drawTree1(ctx,height,width,radius);
    ctx.restore();
}

function redrawCanvas1() {
    var ctx = document.getElementById('canvas1').getContext('2d');
    // flip the coordinate frame
    ctx.save();
    flipY(ctx);

    // Draw background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // drawTreeAt(ctx,x,y,height,width.radius);
    drawTreeAt(ctx,200,50,90,20,30);
    ctx.restore();
}


window.addEventListener("load", function(event) {
    var canvas = document.createElement('canvas');
    canvas.id = "canvas1";
    canvas.width = 400;
    canvas.height = 250;
    var parent = document.getElementById('canvas1parent');
    parent.appendChild(canvas);

    redrawCanvas1();
});
