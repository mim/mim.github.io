---
layout: default
title: Introduction to Canvas Drawing
javascripts:
  - //code.jquery.com/jquery-3.0.0.min.js
  - ../libs/dat.gui.min.js
  - ../libs/three.min.js
  - ../libs/tw.js
  - ../libs/OrbitControls.js
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
  - ../js/google-code-prettify/prettify.js
  - ../js/custom.js
  - ../js/307.js
  - ../js/activities.js
---
# Canvas Drawing

In this reading, you'll learn how to draw in 2D on an HTML5 `<canvas>`
element. Our work this semester will be almost entirely in 3D, using the
sophisticated tools of Three.js. Nevertheless, we'll wait for a day before
diving into 3D, and start with 2D. This will also give us a chance to play
with JavaScript before getting into the complexities of Three.js.

## Tutorials

Many of the readings for this course were written by Scott Anderson, but for
this one, he saw no reason to re-invent what has been done very well by
others. A web search for _html5 canvas tutorial_ should yield many good
results, including the following:

  * [ MDN Canvas Tutorial](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial). This is the best introduction we've found. Some required reading from this tutorial is listed in the next section. 
  * [W3Schools HTML5 Canvas](http://www.w3schools.com/html/html5_canvas.asp). W3Schools is a good, comprehensive resource, and has some nice " try it yourself" features. 
  * [HTML 5 Canvas Tutorials](https://www.html5canvastutorials.com/) has the right name, but is possibly better for reference than tutorial.  

## Reading for Class

Please read the following material about the HTML5 `<canvas>` element, from
the [ MDN Canvas Tutorial](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial):

  1.  [Short intro page](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial)
  2.  [Basic usage](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Basic_usage "Canvas_tutorial/Basic_usage"): read all of this, about 5 printed pages (at 100% scale)
  3.  [Drawing shapes](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Drawing_shapes "Canvas_tutorial/Drawing_shapes"): read this, stopping before the section on Bezier and quadratic curves, about 9 printed pages 
  4.  [Applying styles and colors](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Applying_styles_and_colors "Canvas_tutorial/Applying_styles_and_colors"): read the first section, stopping before the section on transparency, about 3 printed pages 
  5.  [Transformations](http://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Transformations "Canvas_tutorial/Transformations"): read almost all of this, stopping before the section on Transforms, about 7 printed pages. This will be really valuable when we talk about the instance transform in a couple weeks. 

In total, this is about 25 printed pages of reading, but there are lots of
pictures and the font is large at 100% scale, so it's not a lot of words.
Still, parts of it may be conceptually tough, so don't underestimate how long
it will take. Plus, there's this webpage itself, and the JavaScript reading.

You are not expected to become perfectly versed in drawing on the canvas, as
we'll spend most of the semester working in 3D using Three.js. Still, you
should know how to do the following:

  * create a canvas 
  * draw rectangles, including filled rectangles 
  * draw lines 
  * draw circles and arcs 
  * choose colors 
  * translate, rotate, and scale the coordinate system. This will help when get to the instance transform in Three.js in a couple weeks. 

There is code below that you should be able to understand once you've read the
tutorial above, together with the JavaScript reading.

## Demo: Example 1

This first example uses the native canvas coordinate system, with the origin
in the upper left and Y increasing down. The canvas is created with a width of
500 pixels and height of 300 pixels.

<canvas id="canvas1" width="500" height="300"></canvas>

<script id="drawCanvas1">
function drawHouse1(ctx,params) {
    /* draws a house. Assumes a native coordinate system */
    var x = params.houseX || 50;
    var y = params.houseY || 200;
    var w = params.houseWidth || 50;
    var h = params.houseHeight || 80;
    ctx.fillStyle = params.houseColor || "red";

    ctx.beginPath();
    ctx.moveTo(x,y);             // lower left
    ctx.lineTo(x+w,y);           // lower right
    ctx.lineTo(x+w,y-h);         // upper right
    ctx.lineTo(x+w/2,y-(h+w/2)); // peak 
    ctx.lineTo(x,y-h);           // upper left
    ctx.lineTo(x,y);             // lower left, the beginning
    ctx.fill();
}

var sceneParams = {
       houseX: 300,
       houseY: 200,
       houseWidth: 80,
       houseHeight: 60,
       houseRotate: 0,
       houseColor: '#ff2233',
       smileyRadius: 75,
       smileyX: 150,
       smileyY: 200,
       smileyScaleX: 1,
       smileyScaleY: 1,
       lastParm: null
    };

function drawSmiley1(ctx,params) {
    // draws a smiley face centered at (smileyX,smileyY)
    // modified this code from the MDN tutorial
    // assumes a native coordinate system
    var x = params.smileyX || 150;
    var y = params.smileyY || 200;
    var outer = params.smileyRadius || 75;
    var inner = outer * 0.7;
    var eyex = 15;
    var eyey = 10;
    var eyeradius = 5;

    ctx.beginPath();
    ctx.arc(x,y,outer,0,2*Math.PI,true); // outer circle
    ctx.fillStyle = "yellow";
    ctx.fill();
   
    ctx.beginPath();
    ctx.arc(x,y,inner,0,Math.PI,false); // mouth (clockwise)
    ctx.strokeStyle = "red"
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x+eyex,y-eyey,eyeradius,0,2*Math.PI,true); // right eye
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x-eyex,y-eyey,eyeradius,0,2*Math.PI,true); // left eye
    ctx.fillStyle = "black";
    ctx.fill();
}

function redrawCanvas1() {
    var ctx = document.getElementById('canvas1').getContext('2d');
    drawHouse1(ctx,sceneParams);
    drawSmiley1(ctx,sceneParams);
}
       
redrawCanvas1();
</script>

Here's the JavaScript code that drew this picture. Please spend some time
making sure you understand this and ask questions. Notice the use of a JS
object `sceneParams` to hold a lot of parameters that would otherwise be
separate global variables. Instead, we have just one global variable that
collects all of them.

<pre data-codefrom="drawCanvas1" class="prettyprint lang-js linenums">
</pre>

    

## Demo: Example 2

This is a similar drawing, but this time done in a coordinate system where the
origin is at the lower left and Y increases upwards, just like we're used to
from high school. Because the Y location of the house and the smiley are 200
and the height of the canvas is 300, they are located differently from Example
1.

<canvas id="canvas2" width="500" height="300"></canvas>

<script id="drawCanvas2">
function flipY(ctx) {
    var canvas = ctx.canvas;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.translate(0,h);
    ctx.scale(1,-1);
}   

function drawHouse2(ctx,params) {
    /* draws a house. Assumes a flipped coordinate system */
    var x = params.houseX || 50;
    var y = params.houseY || 0;
    var w = params.houseWidth || 50;
    var h = params.houseHeight || 80;
    ctx.fillStyle = params.houseColor || "red";

    ctx.beginPath();
    ctx.moveTo(x,y);           // lower left
    ctx.lineTo(x+w,y);         // lower right
    ctx.lineTo(x+w,y+h);       // upper right
    ctx.lineTo(x+w/2,y+h+w/2); // peak
    ctx.lineTo(x,y+h);         // upper left
    ctx.lineTo(x,y);           // lower left, the beginning
    ctx.fill();
}

function drawSmiley2(ctx,params) {
    // Draws a smiley face centered at (smileyX,smileyY)
    // modified this code from MDN tutorial
    // assumes a flipped coordinate system
    var x = params.smileyX || 200;
    var y = params.smileyY || 300;
    var outer = params.smileyRadius || 75;
    var inner = outer * 0.7;
    var eyex = 15;
    var eyey = 10;
    var eyeradius = 5;

    ctx.beginPath();
    ctx.arc(x,y,outer,0,2*Math.PI,true); // outer circle
    ctx.fillStyle = "yellow";
    ctx.fill();
   
    ctx.beginPath();
    ctx.arc(x,y,inner,0,Math.PI,true); // mouth (counter-clockwise)
    ctx.strokeStyle = "red";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x+eyex,y+eyey,eyeradius,0,2*Math.PI,true); // right eye
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x-eyex,y+eyey,eyeradius,0,2*Math.PI,true); // left eye
    ctx.fillStyle = "black";
    ctx.fill();
}

function redrawCanvas2() {
    var ctx = document.getElementById('canvas2').getContext('2d');
    flipY(ctx);
    drawHouse2(ctx,sceneParams);
    drawSmiley2(ctx,sceneParams);
}
       
redrawCanvas2();
</script>

Here is the code that drew this picture. Please spend some time making sure
you understand this and ask questions. You'll notice, though, that it's mostly
a matter of having, for example, `y+h` instead of `y-h` to find the y
coordinate of the top of the house. (Assume that the `sceneParams` variable is
the same.)

<pre data-codefrom="drawCanvas2" class="prettyprint lang-js linenums">
</pre>

    
    
    

## Demo: Example 3

This is the same drawing, one more time, but now with functions that can be
invoked with different translations, rotations, and scaling, to yield
different _instances_. This is a preview of our instance transformation in 3D.

<canvas id="canvas3" width="500" height="300"></canvas>

<script id="drawCanvas3">
function drawHouse3(ctx,params) {
    /* draws a house. Assumes a flipped coordinate system. Draws the
    house at (0,0). */
    var w = params.houseWidth || 50;
    var h = params.houseHeight || 80;
    ctx.fillStyle = params.houseColor || "red";

    ctx.beginPath();
    ctx.moveTo(0,0);         // lower left
    ctx.lineTo(w,0);         // lower right
    ctx.lineTo(w,h);         // upper right
    ctx.lineTo(w/2,h+w/2);   // peak
    ctx.lineTo(0,h);         // upper left
    ctx.lineTo(0,0);         // lower left, the beginning
    ctx.fill();
}

function drawHouseInstance(ctx,x,y) {
    // draws a house at (x,y)
    ctx.save();
    ctx.translate(x,y);
    drawHouse3(ctx,sceneParams);
    ctx.restore();
}
       
function drawSmiley3(ctx,params) {
    // Draws a smiley face centered at current location
    // modified this code from MDN tutorial
    // assumes a flipped coordinate system
    var outer = params.smileyRadius || 75;
    var inner = outer * 0.7;
    var eyey = 10;
    var eyex = 15;
    var eyeradius = 5;

    ctx.beginPath();
    ctx.arc(0,0,outer,0,2*Math.PI,true); // outer circle
    ctx.fillStyle = "yellow";
    ctx.fill();
  
    ctx.beginPath();
    ctx.arc(0,0,inner,0,Math.PI,true); // mouth (counter-clockwise)
    ctx.strokeStyle = "red"
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(eyex,eyey,eyeradius,0,2*Math.PI,true); // right eye
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-eyex,eyey,eyeradius,0,2*Math.PI,true); // left eye
    ctx.fillStyle = "black";
    ctx.fill();
}

function drawSmileyInstance(ctx,x,y) {
    // draws a smiley at (x,y)
    ctx.save();
    ctx.translate(x,y);
    drawSmiley3(ctx,sceneParams);
    ctx.restore();
}

function redrawCanvas3() {
    var ctx = document.getElementById('canvas3').getContext('2d');
    flipY(ctx);
    drawHouseInstance(ctx,sceneParams.houseX,sceneParams.houseY);
    drawSmileyInstance(ctx,sceneParams.smileyX,sceneParams.smileyY);
}
       
redrawCanvas3();
</script>

Here's the code that drew this picture. As before, it's very similar to our
previous code, but now the functions to draw the house and the smiley don't
need to add (x,y) to all their coordinates. The coding for them is much
easier, and it's not much harder to draw an instance. We also can rotate and
scale our objects, which would have been very hard with the coding in versions
1 and 2. (Again, the `sceneParams` is the same as before.)

<pre data-codefrom="drawCanvas3" class="prettyprint lang-js linenums">
</pre>

    
    
    

## Summary

Here's what I hope you got out of this reading:

  * An HTML canvas has a _context_ object that allows you to do 2D drawings using methods of that object. 
  * Rectangles are pretty easy. Arcs are almost as easy. Other shapes are complicated with `beginPath()` at the start and finishing with `fill()` or `stroke()`. 
  * Fill and stroke colors are pretty straightforward. 
  * The drawing is, by default, done in a coordinate system with the origin at the upper left of the canvas and Y increasing _downwards._
  * The coordinate system can be _changed_ by the operations of 
    * translate 
    * rotate 
    * scale 
  * You can use `.save()` and `.restore()` to save a coordinate system, make changes and restore it afterwards.  

## Reference <a id="canvas_reference"></a>

A quick "cheat sheet" reminder:

  * Getting started: 
    * Add a `<canvas>` element to a webpage: 
        
            <canvas id="canvasId" width="500" height="300"></canvas>
        

    * In JavaScript, get the rendering context for the `<canvas>` element: 
        
            var elt = document.getElementById('canvasId');
            var context = elt.getContext('2d');
        

  * rectangles 
    
        context.fillRect(x,y,width,height);    // draw a filled rectangle
        context.strokeRect(x,y,width,height);  // draw outline of a rectangle
    

  * lines 
    
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.stroke();
    

  * shape composed of multiple lines 
    
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.lineTo(x3,y3);
        context.closePath();
        context.stroke();
    

  * filled-in shape with multiple edges 
    
        context.beginPath();
        context.moveTo(x1,y1);
        context.lineTo(x2,y2);
        context.lineTo(x3,y3);
        context.fill();
    

  * arcs 
    
        context.arc(centerx,centery,radius,startangle,stopangle,ccw);
    

  * colors 
    
        context.fillStyle = "blue";
        context.strokeStyle = "green";
    

  * state stack 
    
        context.save();
        context.translate(deltaX,deltaY);
        context.rotate(angleRadians);
        context.scale(xScale,yScale);
        context.restore();
    

### Source

This page is based on <https://cs.wellesley.edu/~cs307/readings/canvas.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


<script>
addScriptElements();
addExecuteButtons();    // has to be done before pretty-printing
handle_code_jsfunction(); // also before pretty-printing
handle_codefrom();
handle_codeurl();
// ready for pretty-printing
checkPreElements();
trimPreElements();
addPrettyPrintClass();
addPreExamples();
prettyPrint();
hideFromStudent();
// do we still want this?
// sh_highlightDocument();
</script>
