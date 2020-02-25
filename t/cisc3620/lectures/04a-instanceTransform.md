---
layout: reveal
title: The Instance Transform
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
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/04-instance-transform.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/04.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


## Plan

  * Three.js built-in objects are convenient, use them when possible
    * But use enough polygons to approximate smooth curves
  * Every object has a reference point: its origin
  * There are three instance transformations:
    * scaling, rotation, translation
  * These transformations change the object's coordinates relative to the global coordinates
  * There are relative versions of instance transformations as well

## The Instance Transform

  * So far, we've been building objects out of vertices and triangles.
    * Effective, but slow and painful. 
  * Today we'll learn about the instance transform, which will make it much easier to work with higher-level objects, from teapots to teddy bears.

## Built-in Three.js Objects

  * Three.js has many classes to create different kinds of Geometry objects.
  * See the geometry section of the [documentation](http://threejs.org/docs)
  * We'll be working a lot with:
    * [BoxGeometry](http://threejs.org/docs/#api/geometries/BoxGeometry)
    * [SphereGeometry](http://threejs.org/docs/#api/geometries/SphereGeometry)
    * [PlaneGeometry](http://threejs.org/docs/#api/geometries/PlaneGeometry)
    * [CylinderGeometry](http://threejs.org/docs/#api/geometries/CylinderGeometry)
    * [ConeGeometry](http://threejs.org/docs/#api/geometries/ConeGeometry) 

### Demo: Plane, Box, and Sphere

<iframe height="598" style="width: 100%;" scrolling="no" title="Plane, box, sphere" src="https://codepen.io/asterix77/embed/rNVMqpv?height=598&theme-id=default&default-tab=html,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/rNVMqpv'>Plane, box, sphere</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Demo: Plane, Box, and Sphere

  * The arguments to `THREE.BoxGeometry()` are width, height and depth.
  * The arguments to `THREE.PlaneGeometry()` are the width and height
  * The argument to `THREE.SphereGeometry()` is the radius
  * Where is the origin and how are the axes arranged?

## Demo: Polygonal Approximation

  * Spheres have two more arguments (and then some) called `widthSegments` and
`heightSegments`
  * We need them because these curved surfaces are rendered with **polygonal approximations**.
  * Consider a circle. How would you approximate a circle with a 360-sided polygon? 36-sided? 4-sided?

### Demo: Polygonal Approximation

<iframe height="598" style="width: 100%;" scrolling="no" title="Polygonal sphere" src="https://codepen.io/asterix77/embed/rNVMqJK?height=598&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/rNVMqJK'>Polygonal sphere</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Demo: Polygonal Approximation

  * The demo starts with 8 `widthSegments`, i.e., segments around the poles, like _longitude_
  * It has 3 `heightSegments`, like _latitude_
  * Polygonal approximations work pretty well, especially for interiors
    * less well for silhouettes

| ![sphere from +Z](../readings/images/sphere-from-z.png) | ![sphere from +X](../readings/images/sphere-from-x.png) |


## Bounding Boxes, Reference Points: Scene

We learned this earlier, but just to re-cap:

  * The `TW.cameraSetup()` function tells TW the information it needs to set up a camera.
  * Its third argument is an object with six properties:
    * the minimum and maximum x, y and z coordinates, for the _entire scene_:
    
```javascript    
var scene_bounding_box = { minx: -50, maxx: +100,
                           miny: 0, maxy: 50,
                           minz: -25, maxz: 100 };

TW.cameraSetup(renderer, scene, scene_bounding_box);
```
  * TW sets up the camera so the whole bounding box is visible
  * Press the "b" key to show the bounding box in our demos

### Reference Points: Objects

  * Where is each of these objects, exactly?
  * An object occupies a collection of points
    * but we want to have a **single point** as the location of the object.
  * We will call that the **reference point** of the object
    * or the object's **origin**.
  * For example, the origin for the barn is its lower left front corner
    * For the `THREE.BoxGeometry` object, the handle is the center of the box

### Bounding Boxes: Objects

  * How big is each object, exactly?
    * if you want to stack two on top of each other, or place them next to each other
  * We can use bounding boxes for objects too (not just scenes)
  * Defined the same as the scene bounding box, but used for different _purposes_


### Bounding Boxes: Objects

  * Let's look again at our example of the [Three.js box](https://codepen.io/asterix77/pen/jOPNaVZ)
  * Where is the box? What is its bounding box?
    * Use the "a" and "b" keys to figure it out

<iframe height="501" style="width: 100%;" scrolling="no" title="Box Demo" src="https://codepen.io/asterix77/embed/jOPNaVZ?height=501&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/jOPNaVZ'>Box Demo</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Placing Instances: Barn instance transforms

<iframe height="601" style="width: 100%;" scrolling="no" title="Barn instance transforms" src="https://codepen.io/asterix77/embed/qBdaJKw?height=601&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/qBdaJKw'>Barn instance transforms</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Barn instance transforms

The barn instance has three kinds of state:

  * _Position_ : `THREE.Vector3` object with x, y, and z components
    * Place the _origin_ of the barn at that location in the scene. 
  * _Rotation_ : `THREE.Euler` object
    * first rotates the object by some angle about _its_ X axis,
    * then by some angle about _its_ Y axis,
    * then by some angle about _its_ Z axis.
    * (You can also change the order of the rotations if you wish; I've rarely found that necessary.) 
  * _Scale_ : `THREE.Vector3` object that indicates the scaling of the barn along its X, Y, and Z axes. 

### Order of operations

  * Let's think about the _order_ of these operations
  * Does the scaling happen in the object's local coordinates or the global scene coordinates?
    * The rotation?
    * The positioning?
  * How can we figure this out?
    * What would be different if we scaled and then positioned vs positioned and then scaled?
    * What would be different for scaling and rotation?
    * What would be different for rotation and positioning?
  * What order do we want them to happen in?

### Order of rotations example

[Jeffery, et al (2015)](https://www.researchgate.net/publication/280044416_Neural_encoding_of_large-scale_three-dimensional_space-properties_and_constraints)

{% include figure.html url="https://www.researchgate.net/profile/Jonathan_Wilson14/publication/280044416/figure/fig2/AS:267399035355138@1440764306843/Non-commutativity-of-rotations-in-three-dimensions-showing-that-the-same-set-of_W640.jpg" description="Different final orientations of an object after the same three rotations are applied in different orders. Note that these rotations are relative to the object's local frame of reference. The same effect holds for rotations about fixed global axes." classes="stretch"%}

## Demo: Positioning/Translation

  * Positioning an instance as drawing it in a coordinate system where the _origin_ has moved
    * relative to the scene origin.
  * None of the vertices needs to be changed, they are just _transformed_.
  * We'll look more at the mathematics of this in a future lecture

{% include figure.html url="../readings/images/blocks2_new.png" description="two blocks, the green translated relative to the red" classes="stretch"%}

### Demo: Positioning/Translation

  * In this demo we have two barns and position one of them
  * We view the scene from above (along the y-axis)

<iframe height="498" style="width: 100%;" scrolling="no" title="Translation demo" src="https://codepen.io/asterix77/embed/OJVRaVm?height=498&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/OJVRaVm'>Translation demo</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Demo: Positioning/Translation

  * The red barn is drawn at the origin;
    * its origin coincides with the scene origin
  * The green barn is drawn such that its origin (its front left corner) is at the specified position.

## Demo: Rotation

  * Rotation works similarly to positioning
    * except that you set the three angles that you want to rotate the object by.
  * In this demo, the green barn is drawn in a coordinate system that is
rotated by 30 degrees around the Y axis of the barn
  * The result, in wireframe from above, looks like

{% include figure.html url="../readings/images/blocks3_new.png" description="two blocks, the green translated and rotated" classes="stretch"%}


### Demo: Rotation

Here is a demo

<iframe height="504" style="width: 100%;" scrolling="no" title="Rotation demo" src="https://codepen.io/asterix77/embed/OJVRayg?height=504&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/OJVRayg'>Rotation demo</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Rotation details

  * Note that the rotations are in _radians_.
  * So, if you want to rotate something by a quarter turn around the x axis, use one of the following:
    * `obj.rotation.x = Math.PI/2`
    * `obj.rotation.x = THREE.Math.degToRad(90)`
    * `obj.rotation.x = TW.degrees2radians(90)` 
  * Also, the direction of rotations is crucial, use the right hand rule again
    * If your right thumb points along the axis of rotation
    * Positive angles go in the direction of your fingers
    * Which way is a positive angle for rotation about the (positive) z-axis? x-axis?
    

## Demo: Scaling

  * Finally, we can scale the geometry system
  * Typically, this is just a positive multiple
    * but by multiplying by a negative value, you can flip an object around
  * Here, we translate, rotate, and then double the size of the green barn:

{% include figure.html url="../readings/images/blocks4_new.png" description="two blocks, the green translated, rotated, and scaled" classes="stretch"%}


### Demo: Scaling

<iframe height="501" style="width: 100%;" scrolling="no" title="Scaling demo" src="https://codepen.io/asterix77/embed/XWbjymG?height=501&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/XWbjymG'>Scaling demo</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
    

## Demo: Blocks (many consistent instance transforms)

<iframe height="601" style="width: 100%;" scrolling="no" title="Blocks" src="https://codepen.io/asterix77/embed/MWwjzKP?height=601&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/MWwjzKP'>Blocks</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Absolute versus Relative

  * The three properties we've been looking at so far are "absolute"
    * We specify the value we want, regardless of the current value
  * Suppose we wanted to "modify" the current value.
    * For example, to move a block over by a bit, we could do the following:
```javascript
      box.position.x += 2;
```
  * The `position` property is a `THREE.Vector3`, which has properties x, y, and z
    * that we can look at and modify
  * There are convenience methods to do this for us:
```javascript
      box.translateX(2);
```


### Relative translation

  * There is an even more general method: 
```javascript
    var dir = new THREE.Vector3(3,4,5);
    dir.normalize();
    box.translateOnAxis(dir,dist);
```
  * This moves the box by some distance in the specified direction.
    * This can be very useful when animating a scene.

### Rotation about an arbitrary axis

  * Similarly, you can change the rotation of an object:
```javascript
    var axis = new THREE.Vector3(3,4,5);
    axis.normalize();
    box.rotateOnAxis(axis,radians);
```
  * This rotates the object around the given axis by some number of radians.
  * Again, this can be very useful for animations
    * where you want to rotate the box by some amount every frame
    * say because it's tumbling as it falls.


## Coordinate Systems

  * Remember: the initial coordinate system has the z-axis coming out of the screen
    * You can modify this by setting the position, rotation, and scaling of the `Scene` object.
  * When you translate, rotate, or scale an object
    * You change the coordinate system for all subsequent operations within that object
    * E.g., the vertex (2,3,4) means something different as a result.
  * We haven't looked at _nested_ objects yet, but will soon.
    * Keep this in mind.

### Coordinate Systems

  * _However,_ translation, rotation and scale are **affine** transformations
  * Which means that lines stay lines and planes stay planes.
  * Therefore, to transform a line, you transform the endpoints and draw the line between the transformed endpoints.
  * Which means that you can define your object in a coordinate system that is _convenient,_ then use
affine transformations to place it in the scene.
  * In simple cases, we can usually place the object we want by setting the
`position`, `rotation` and `scale`.

## Summary

  * Three.js built-in objects are convenient, use them when possible
    * But use enough polygons to approximate smooth curves
  * Every object has a reference point: its origin
  * There are three instance transformations:
    * scaling, rotation, translation
  * These transformations change the object's coordinates relative to the global coordinates
  * There are relative versions of instance transformations as well


## Exercise: Building a Town

Build a "town" consisting of just three houses. Here's the layout of the town:

{% include figure.html url="img/town1.png" description="town with three houses around central area" classes="stretch"%}

### Exercise: Building a Town

Here's an initial [town0](https://codepen.io/asterix77/pen/WNvGyYE?editors=1010) to get you started

  1. Figure out your scene's bounding box 
  2. Place the first house. Remember the following functions used in the [barn example](../demos/Early/barn-ex.html): 
    * `TW.createBarn(w,h,d)`
    * `TW.createMesh(geom)`
  3. Place two more houses 

Your finished town might look like [town1](https://codepen.io/asterix77/pen/rNVMKoq?editors=1010)

## Exercise: Town with tree

Add a tree to the scene.

  * A tree can just be a green cone coming up from the ground.
  * You can use the [`THREE.ConeGeometry`](https://threejs.org/docs/#api/geometries/ConeGeometry)
to create a cone.
    * The trick is to get the dimensions and positioning right.
  * Also recall that [`THREE.Mesh`](https://threejs.org/docs/#api/objects/Mesh) and [`THREE.MeshBasicMaterial`](https://threejs.org/docs/#api/materials/MeshBasicMaterial) can be used to set up the color of the tree.

Your finished town might look like [town2](https://codepen.io/asterix77/pen/eYNdKxL?editors=1010)


{% include figure.html url="img/town-w-tree.png" description="town with tree" classes="stretch"%}


## Exercise: Town with tree and snowman

Add a snowman to the scene. 

  * A snowman is just a stack of three spheres.
  * The trick with this is to get the distances right.
    * What radii do you want to use for the snowman? 
    * What, then, are the locations of the spheres?
  * Your finished town might look like [town3](https://codepen.io/asterix77/pen/QWbKxoO?editors=1010)

{% include figure.html url="img/town-w-tree-n-snowman.png" description="town with tree and snowman" classes="stretch"%}


## Exercise: Building Our Own Luxo Lamp

  * Starting with [luxo-start](https://codepen.io/asterix77/pen/GRJjGLq?editors=1010), add code to create a basic Luxo lamp using the built-in Three.js geometries and the instance transform.
  * The starting code creates an array of `THREE.MeshBasicMaterial` objects to use for the colors of the lamp.
  * Your result might look something like this [luxo](https://codepen.io/asterix77/pen/yLNaEWE?editors=1010).
    * Rotate the camera to see the light bulb inside the lamp.

### Luxo Lamp tips

  * Check the Three.js documentation for the [THREE.ConeGeometry](http://threejs.org/docs/#api/geometries/ConeGeometry) class to see how you can render the cone for the lamp so that its base is "open" 
  * Choose a convenient "origin" for the object in the scene coordinate frame. It's ok to estimate the size and position of subparts of the lamp, and use numbers in your code (it may take some trial-and-error to get things right!) 



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
