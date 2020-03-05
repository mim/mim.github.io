  * [Home](/~cs307/index.html)
  * [Syllabus](/~cs307/syllabus.html)
  * [Schedule](/~cs307/schedule.html)
  * [Reference](/~cs307/reference.html)

# CS307: Lecture On User Controls and Color

## Plan

  * Review [two-barns](https://cs.wellesley.edu/~cs307/lectures/02.html#two-barns) example from last time, introduce `position.set()`
  * Exercise: [Adding a steeple](02.html#adding_a_steeple) to make a church 
  * Recap: Keyboard and GUI controls ([slides](Lecture4.pdf)) 
  * Exercises: Adjusting steeple height with keyboard and GUI controls 
  * Recap and quiz questions: Setting face colors in Three.js 
  * Exercise: Coloring the church 
  * (if time) Recap and quiz questions: parametric equations and interpolation 
  * (next time) RGB model and the Color Cube Demo  

## Placing Objects

  * An object's geometry has a set of vertices, possibly, but not necessarily, including the origin.
  * We can _place_ an object in the scene at a location different from its vertices by using the `.position.set()` method of `Object3D` (a superclass of a `Mesh`).
  * See: [two-barns-after-pos.html](02-exercises/two-barns-after-pos.html). 
  * The `.position.set()` method is _very_ like the `translate()` function we used in the canvas drawing: it moves the origin, but Three.js takes care of saving/restoring for us.

## Keyboard Controls

To implement a new keyboard control, you need to have

  * one or more global variables, used by the scene modeling code 
  * a callback function that modifies the global variable(s) and then rebuilds and redraws the scene 
  * a binding of the callback function to a key, using `TW.setKeyboardCallback(key,function,docstring)` (call this function after `TW.mainInit()`) 

### Exercise: Adjusting the Height of the Steeple

  1. Download this slightly modified version of the [church](03-exercises/church.html)
  2. The important part is: 
    
        var steepleHeight = 36;   /* global variable to be controlled */
    var steepleWidth = 6;
    var steepleMesh;
      
    function placeSteeple(steepleHeight,steepleWidth) {
        var half = steepleWidth * 0.5;
        var steepleGeom = createSteeple(steepleWidth,steepleHeight);
        steepleMesh = TW.createMesh(steepleGeom);
        steepleMesh.position.set(barnWidth*0.5,
                                 barnHeight+barnWidth*0.5-half,
                                 -half);
        scene.add(steepleMesh);
    }
    

  3. Implement a function to 
    1. remove the current steeple 
    2. increment the height 
    3. create a new steeple and place it on the barn 
    4. redraw the scene 
  4. Add a keyboard callback to your code that allows you to grow the steeple by entering the '+' key. Your result might look like [church-growSteeple.html](03-exercises/church-growSteeple.html)
  5. (Optional) add a second keyboard callback to your code that makes the steeple shorter when you enter '-'. 

## GUI Controls

To implement a new GUI control, you need to have

  * one or more global object variables that contain parameters to be controlled, with initial values 
  * one or more callback functions that are called when the user modifies one of the parameters, and rebuild and redraw the scene 
  * a new `dat.GUI` object 
  * calls to the `add()` method and `onChange()` event handler that specify a global object variable, parameter, range of values for the slider, and callback function 

### Exercise: Adjusting the Steeple Height with a GUI

Modify your code from the previous exercise to _use a GUI control instead of a
keyboard control_ , to adjust the height of the steeple

  * Your result might look like [church-growSteeple-GUI.html](03-exercises/church-growSteeple-GUI.html) 

## Recap on Color in Three.js and TW

  * Computer Graphics uses RGB color; Three.js has many ways to specify a color, but uses RGB internally 
  * `THREE.MeshBasicMaterial()` can be used to give something a uniform RGB color 
  * `THREE.MeshFaceMaterial()` can be used to give each _face_ a different RGB color 
  * When a face is defined (i.e., a `THREE.Face3` object is created), you can give it an index into an array of materials, indicating which color to use for this face, so there is a connection between the _geometry_ and the _material_
  * The TW module provides functions that make it easy to assign the same color to many faces of an object (`TW.setMaterialForFaces()`), or create a one-to-one mapping between an array of faces and an array of materials (`TW.setMaterialForFaces11()`) 
  * Colors can be _flat_ or _smooth_ , meaning there is _interpolation_ 

This [simple color demo](03-exercises/tetra.html) illustrates how to color
each face of a geometry with a uniform color, using basic Three.js concepts.

### Exercise: Coloring the Church

Starting with this [church-start.html](03-exercises/church-start.html) file,
modify the code to create a white church with a brown roof and yellow steeple,
as shown in this [church-color.html](03-exercises/church-color.html) example
(rotate the camera with your mouse to see the brown roof).

Some tips:

  * the starting code provides comments about the steps to complete 
  * this [simple color demo](03-exercises/tetra.html) illustrates how to create a mesh with one color (e.g. for the church steeple), and how to set up multiple materials with different colors (e.g. for the barn that is the base of the church) 
  * you can specify one color for multiple faces all at once using the `TW.setMaterialForFaces()` function. The following example assigns a `materialIndex` of 2 (i.e. the material color at index 2 of the array of materials) to the faces 6, 8, and 9: 
    
            TW.setMaterialForFaces(geom, 2, 6, 8, 9);
        

  * the barn has 16 faces (indices 0 to 15 in the array of faces), and the roof faces are stored at indices 6, 7, 8, and 9 

The [RGB Color Cube](/~cs307/threejs/demos/Color/colorcube.html) uses _vertex
colors_ and interpolates colors over each face, creating the appearance of
smoothly varying color over the surfaces of the cube. To understand the
computation of interpolated color over a triangular face (next time!), we
first explore interpolation in a simpler context of interpolating values over
a line.

## Parametric Equations and Interpolation

A few key points from the reading:

    * OpenGL uses _parametric equations_ to represent lines 
    * Given the coordinates of two points, A and B, the line containing these points can be expressed in terms of a single parameter t: 

> P(t) = A + vt  
>  P(t) = A + (B-A)t  
>  P(t) = A(1-t) + Bt  
>

The _vector v_ in the first expression runs from A to B, and is written
explicitly as B-A in the second expression

    * Points along the line segment from A to B are generated with values of t from 0 to 1 
    * The third expression above captures the idea that any point along the line segment from A to B has coordinates that can be thought of as a _mixture_ of the coordinates of A and B 

### Exercise: Placing the Steeple on the Church

We did some guesswork arithmetic to find the correct place on the barn for the
lower vertices of the steeple. We were fortunate that the angle at the ridge
was 90 degrees, so the arithmetic was easy. We may not always be so lucky.

Suppose we know that the vertex at the front of the ridge is R = (15, 55, 0)
and the vertex at the "shoulder" of the barn is S = (0, 30, 0). Suppose we
want to compute the vertex that is part of the base of the steeple, B, as a
point one-fifth of the way down the roof from R to S.

![church vertices with R, B, and S](03-exercises/church-vertices.png)

How can we do this? Working with a partner, compute the coordinates of B.
(Don't assume that the ridge angle is 90 degrees.)

    
        B = (4/5)R + (1/5)S  
    B = (4/5)*(15,55,0) + (1/5)*(0,30,0)  
    B = (12,44,0) + (0,6,0)  
    B = (12,50,0)

## Three.js Support for Interpolation

Three.js has some useful functions for doing interpolation on
[`Vector3`](http://threejs.org/docs/#api/math/Vector3) objects. Suppose `v1`,
`v2`, and `v3` are all `Vector3` objects.

    * `v1.add(v2)` adds vector `v2` to `v1`
    * `v1.addVectors(v2,v3)` sets `v1` to the sum `v2+v3`
    * `v1.multiplyScalar(s)` multiplies `v1` by a scalar `s`
    * `v1.sub(v2)` subtracts vector `v2` from `v1`
    * `v1.subVectors(v2,v3)` sets `v1` to the difference `v2-v3`
    * `v1.lerp(v2,theta)` moves `v1` towards `v2`, by a fraction θ, using linear interpolation 

And many others.

Warning, these methods all modify the object, so if you want to compute a new
vertex, it's best to `.clone()` the vertex first.

Here's an example of computing a new point B, given a point A and a vector V,
and then computing the midpoint of the line segment from A to B (in two ways).

    
        var A = new THREE.Vector3(1,3,5);
    var V = new THREE.Vector3(10,20,30);
    var B = A.clone();
    B.add(V);
    alert("B is " + JSON.stringify(B));
    var Mid1 = A.clone();
    Mid1.lerp(B,0.5);
    alert("midpoint is " + JSON.stringify(Mid1));
    var Mid2 = A.clone();
    var Vhalf = V.clone();
    Vhalf.multiplyScalar(0.5);
    Mid2.add(Vhalf);
    alert("midpoint is also " + JSON.stringify(Mid2));
    

The code below carries out our earlier computation of the coordinates of the
point B for the steeple, given the vertices R and S, in two different ways.

    
        var R = new THREE.Vector3(15,55,0);
    var S = new THREE.Vector3(0,30,0);
    var Ans1 = S.clone();
    Ans1.lerp(R,0.8);
    alert("Ans1 is " + JSON.stringify(Ans1));
    // ============================================
    var V = new THREE.Vector3();
    V.subVectors(S,R);   // vector down the roof
    V.multiplyScalar(0.2);
    var Ans2 = R.clone();
    Ans2.add(V);
    alert("Ans2 is " + JSON.stringify(Ans2));
    

## Colors, Interpolation and RGB

RGB color is a three-dimensional system just like our 3D spatial coordinates.

Color interpolation works pretty much the same way as spatial interpolation.

Assuming the vertex S is cyan and R is red, what color is B?

    
        var cyan = new THREE.Vector3(0,1,1);
    var red = new THREE.Vector3(1,0,0);
    var mix = cyan.clone();
    mix.lerp(red,0.8);
    alert("mix is " + JSON.stringify(mix));
    

## Next Time

We'll look at the color cube, different models for representing color, and
color interpolation over a triangle.

(C) Scott D. Anderson. This work is licensed under a [Creative Commons
License](http://creativecommons.org/licenses/by-nc-sa/1.0/).

    * [![Creative Commons License](/~cs307/Icons/somerights.gif)](https://creativecommons.org/licenses/by-nc-sa/1.0/)
    * [![Viewable With Any Browser](/~cs307/Icons/enhanced.gif) ](https://www.anybrowser.org/campaign/)
    * [![Valid HTML5](/~cs307/Icons/valid-html5v2.png) ](https://validator.w3.org/check?uri=referer)
    * [![Valid CSS!](/~cs307/Icons/vcss.gif) ](https://jigsaw.w3.org/css-validator/check/referer)

