---
layout: reveal
title: Texture mapping 2
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/10-texture-mapping-b.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/11new.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

<p style="display:none">
\(
\newcommand{\Choose}[2]{ { { #1 }\choose{ #2 } } }
\newcommand{\vecII}[2]{\left[\begin{array}{c} #1\\#2 \end{array}\right]}
\newcommand{\vecIII}[3]{\left[\begin{array}{c} #1\\#2\\#3 \end{array}\right]}
\newcommand{\vecIV}[4]{\left[\begin{array}{c} #1\\#2\\#3\\#4 \end{array}\right]}
\newcommand{\matIIxII}[4]{\left[
    \begin{array}{cc}
      #1 & #2 \\ #3 & #4 
    \end{array}\right]}
\newcommand{\matIIIxIII}[9]{\left[
    \begin{array}{ccc}
      #1 & #2 & #3 \\ #4 & #5 & #6 \\ #7 & #8 & #9
    \end{array}\right]}
\)        
</p>


## Plan: Texture mapping 2

  * Setting texture coordinates
  * Modifying `faceVertexUvs`
  * Loading images
  * Exercise: Room with a view


## Setting Texture Coordinates

  * Geometry objects define texture coordinates for each vertex.
  * Earlier, we saw that we don't always want to use the default `(0,1)` texture coordinates.
    * We might want the max to be `(0.77,0.81)` for the flag
  * So, how can you change or set texture coordinates?

### faceVertexUvs

  * Three.js puts the texture coordinates in a property of the `THREE.Geometry` called `faceVertexUvs`
    * instead of using S and T, some people use U and V; both appear in the Three.js code.
  * This property is an array of one element
  * and that element is an array of "face uvs"
  * where a face UV is a three-element array, corresponding to the three vertices of the face
  * and each element of _that_ is a `THREE.Vector2` that captures the U and V values.

### Specific example: Plane

  * Consider a simple 2D plane (a rectangle):
    
```javascript
    planeGeom = new THREE.PlaneGeometry(4, 4);
```

  * Let's look inside that data structure. First, the vertices:
    
```javascript
    JSON.stringify(planeGeom.vertices)
    [{"x":-2,"y": 2,"z":0},   // 0
     {"x": 2,"y": 2,"z":0},   // 1
     {"x":-2,"y":-2,"z":0},   // 2
     {"x": 2,"y":-2,"z":0}    // 3
    ]
```

  * And the faces
    
```javascript
    > planeGeom.faces[0]
    THREE.Face3 {a: 0, b: 2, c: 1, normal: THREE.Vector3, vertexNormals: Array[3]…}
    > planeGeom.faces[1]
    THREE.Face3 {a: 2, b: 3, c: 1, normal: THREE.Vector3, vertexNormals: Array[3]…}
```    

### Plane faceVertexUvs

  * Here are the UV values for each of the 6 vertices (three for each of the two faces):
    
```javascript
    > JSON.stringify(planeGeom.faceVertexUvs)
    [
      // array of two elements
      [
       [{"x":0,"y":1},{"x":0,"y":0},{"x":1,"y":1}],  // for face 0
       [{"x":0,"y":0},{"x":1,"y":0},{"x":1,"y":1}]   // for face 1
      ]
    ]
```

  * Weirdly, the two coordinates are named "x" and "y" in these objects
    * rather than "u" and "v" as you might expect (or "s" and "t").

### Plane faceVertexUvs picture

Here's a picture that might help:

{% include figure.html url="../readings/images/faceVertexUvsBc.svg" description="Six sets of texture coordinates, three for each of two triangular faces, the green face and the magenta face." classes=""%}


## Modifying the faceVertexUvs

Consider the following function, which updates the S and T values for a
`THREE.PlaneGeometry` like we have:

```javascript
    function updateTextureParams(quad, sMin, sMax, tMin, tMax) {
        // I dunno why they have this 1-elt array
        var elt = quad.faceVertexUvs[0]; 
        var face0 = elt[0];
        face0[0] = new THREE.Vector2(sMin,tMax);
        face0[1] = new THREE.Vector2(sMin,tMin);
        face0[2] = new THREE.Vector2(sMax,tMax);
        var face1 = elt[1];
        face1[0] = new THREE.Vector2(sMin,tMin);
        face1[1] = new THREE.Vector2(sMax,tMin);
        face1[2] = new THREE.Vector2(sMax,tMax);
        quad.uvsNeedUpdate = true;
    }
```
    
### Modifying the faceVertexUvs

  * Using this function, we can map our US flag onto the plane with no gray areas:
  * But the code for doing this is unintuitive
    * the default Three.js behavior is to _flip_ the vertical texture parameter. This is called `.flipY`.
  * So, instead of wanting the T parameter to go
    * from 0 in the upper left, 
    * to 0.8 in the lower left 
  * We actually set it to go
    * from 0.2 = 1-0.8 in the lower left, 
    * to 1 in the upper left 
    
```javascript
      updateTextureParams(flagGeom, 0, 0.75, 1-0.81, 1);
```

### Modified faceVertexUvs demo

<iframe height="600" style="width: 100%;" scrolling="no" title="Plane flags" src="https://codepen.io/asterix77/embed/dyYpQpJ?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/dyYpQpJ'>Plane flags</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Loading Images

<iframe height="600" style="width: 100%;" scrolling="no" title="Library on a Plane" src="https://codepen.io/asterix77/embed/Yzywjgy?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/Yzywjgy'>Library on a Plane</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Loading images

  * The code has one very tricky part, though.
  * When we computed an array and used it as a texture, the array was already available for rendering.
  * With an external image, there's going to be some delay before the data arrives from the network
  * This delay might run to a few hundred milliseconds
    * but even a few milliseconds is a lot compared to the code
  * So, if your image texture is showing up blank, it probably wasn't loaded yet


### Pseudo-code for image loading

This code won't work:

```javascript
    var texture = new THREE.ImageUtils.loadTexture( "../../../readings/images/bc.jpg" );
    var mat = new THREE.MeshBasicMaterial(
        {color: THREE.ColorKeywords.white,
         map: texture});
        
    var mesh = new THREE.Mesh( planeGeom, mat );
    scene.add(mesh);
    TW.render();
```

  * There isn't time for the image to load between that first line, when loading starts, and the last, when it is used.
  * If you try this, the plane will be blank white.

### Solution

  * The solution is to use a _callback_.
  * A callback is a general-purpose solution to code that you want to run after some event has happened
    * Here, once the image is fully loaded
  * The event handler can then invoke the renderer
  * Here's the improved code:
    
```javascript
    // these should be local, but we use globals so that
    // you can poke around
    var planeGeom, planeTex, planeMat, planeMesh;
    var imageLoaded = false;
    
    var loader = new THREE.TextureLoader();
    
    function loadPlane() {
        loader.load("../../../readings/images/bc.jpg",
                    function (texture) {
                        console.log("image is loaded");
                        imageLoaded = true;
                        planeGeom = new THREE.PlaneGeometry( 4, 4);
                        planeMat = new THREE.MeshBasicMaterial(
                               {color: THREE.ColorKeywords.white,
                                map: texture});
                        planeMesh = new THREE.Mesh( planeGeom, planeMat );
                        scene.add(planeMesh);
                        TW.render();
                    });
    }
```

### Solution (Cntd)

  * We pass in an _anonymous_ function as the callback
  * It gets invoked when the image finishes loading, then does all the work of building the object, including its material with the texture, and rendering the scene.
    * (Rendering is optional; maybe you have other objects to load first.)
  * Nothing it does is new to you; just the packaging and timing.
  * Note that in codepen, images are on their site as "assets"
    * but issues with loading times still apply

## Summary

Here's what we learned

  * At its most basic, a texture is an array of pixels. So is an image. 
  * Each vertex of a triangular face can have texture parameters 
  * Texture parameters are 2D and each lives in the [0,1] interval, with {0,1} being the edges of the 2D texture. 
  * Texture parameters outside the [0,1] interval can be 
    * clamped to the edge 
    * repeated 
    * mirrored 
  * When loading textures from an image, we need to consider that it takes a non-negligible amount of time for the image to load, and so we will need to write _callbacks_ for the _after load_ event. 



## Exercise: A Room with a View

  * This exercise illustrates how you can use a `THREE.BoxGeometry` to _create a room_ , which will be helpful for [homework 4](../homework/hw4.html).

  1. Start from this [room start pen](https://codepen.io/asterix77/pen/jObMQwE?editors=1010)
  2. Change the basic materials for the cube faces to `THREE.MeshLambertMaterial`, and set the `side` property for the material to `THREE.BackSide` (this is all that's needed to convert the box to a room that can be viewed from the inside!) 
  3. Add code to create a white point light source, position this light in the center of the room, and add it to the scene

### Part 2

{:start="4"}
  4. Complete the definition of the `displayView()` function, which should map [this image](https://s3-us-west-2.amazonaws.com/s.cdpn.io/2999896/seaScape.jpg) (stored in the input `THREE.Texture` object) onto a plane that is the same size as the back wall of the room, just in front of it. and render the scene 
  5. Feel free to select a nicer set of colors for the walls of the room! 

  * Your solution might look like [this pen](https://codepen.io/asterix77/pen/GRpjwvw?editors=1010)

### Optional extensions

  * In the above solution, we cheated a bit, creating something like a poster that was placed at the location of the back wall.
  * We can also _directly map an image texture_ onto one or more sides (faces) of the box.
  * Modify the definition of the `displayView()` function so that it maps the input texture directly onto the back wall of the box


### Hints for optional extension

  * `THREE.Mesh` objects have a `material` property.
  * In the case of meshes with multiple materials, the value of this property is an object that itself has a
property named `materials` that is an array of materials.
  * In the case of our `THREE.BoxGeometry`, this array contains 6 materials, one for each side of the box (the two triangular faces for each side have the same material).
  * You need to _change one of the materials in this array_ to be a `THREE.MeshLambertMaterial` with appropriate values for the `color`, `side`, and `map` properties.
  * Your solution might look like [this pen](https://codepen.io/asterix77/pen/dyYpQZe?editors=1010)
  * _Why do you think the window appears with its hinge on the left side here, rather than_ _on the right side, as it appeared in the first solution?_


## Exercise: Decorate a cake

  * In Three.js, textures can be mapped onto curved objects (e.g. sphere, cone, cylinder, or torus) in the same way that they're mapped onto flat surfaces, by setting the `map` property for the material to a `THREE.Texture` object.
  * The goal of this exercise is to create a decorated cake, something like this:

{% include figure.html url="img/cakeDec.png" description="Target cake" classes="stretch" %}

### Exercise: Decorate a cake

  * Begin with with [codepen](https://codepen.io/asterix77/pen/eYpgLVE?editors=1010)
  * The starting code creates a single cylinder mapped with a texture pattern consisting of a blue dot on a white background, repeated 15 times around the cylinder.
  * The `makeTexture()` function has several inputs -- the first is an integer from 1 to 3 specifying which of three design patterns to use.

{% include figure.html url="img/cakeText2.png" description="Cake textures" classes="stretch" %}

### Exercise: Decorate a cake

  * Modify the code to create three stacked cylinders, each with a different color, texture pattern, and repetition method. You'll need to:
  * Create two cylinders, adjusting the radius, position, color, and texture, including different calls to `makeTexture()`
  * add them each to the scene.
  * Your solution might look like this [cake final](https://codepen.io/asterix77/pen/zYvNJJR?editors=1010)

{% include figure.html url="img/cakeDec.png" description="Target cake" classes="stretch" %}

### Exercise questions

  * Observe the patterns displayed on the top and bottom surfaces of the cylinders.
  * _How does Three.js map the texture onto these surfaces?_
  * _How are locations on the surfaces of the cylinders related to the_ `(s,t)` _texture
coordinates?_

## Exercise: Build a globe

  * In this exercise, you'll map an image of the world onto a sphere, to create a globe.
  * Start from [this codepen](https://codepen.io/asterix77/pen/JjYEawa), and you will use [this image URL](https://s3-us-west-2.amazonaws.com/s.cdpn.io/2999896/world.jpg)
  * Complete the `makeGlobe()` function to create a world globe.
  * Your solution might look like this [globe final](https://codepen.io/asterix77/pen/dyYNqLr?editors=1010)


### Build a globe 2

  * Suppose we instead map the below image onto the sphere
  * Note that the top and side lines of the grid are a lighter shade of gray.
  * _How do you think the result would appear?_
  * View this [result](https://codepen.io/asterix77/pen/JjYEmjw?editors=1010), rotating the sphere to see the top, bottom, and sides.
  * _Where are the_ `(s,t)` _texture coordinates equal to 0?_

{% include figure.html url="img/grid.jpg" description="Grid to map onto sphere" classes="stretch" %}


