function redrawCanvas3() {
    var ctx = document.getElementById('canvas3').getContext('2d');
    // flip the coordinate frame
    ctx.save();
    flipY(ctx);

    // Draw background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // draw trees
    function tree(x,y) { drawTreeAt(ctx,x,y,90,20,30); }
    
    tree(50,50);
    tree(80,60);
    tree(20,90);
    tree(250,150);
    tree(220,120);

    // draw houses
    function house(x,y) { drawHouseAt(ctx,x,y,30,40,10,6); }

    house(200,50);
    house(300,75);
    ctx.restore();
}


window.addEventListener("load", function(event) {
    var canvas = document.createElement('canvas');
    canvas.id = "canvas3";
    canvas.width = 400;
    canvas.height = 350;
    var parent = document.getElementById('canvas3parent');
    parent.appendChild(canvas);

    redrawCanvas3();
});
