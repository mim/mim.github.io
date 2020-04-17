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

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/10-texture-mapping-a.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/10new.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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
    [{"x":-2,"y":2,"z":0},   // 0
     {"x":2,"y":2,"z":0},    // 1
     {"x":-2,"y":-2,"z":0},  // 2
     {"x":2,"y":-2,"z":0}    // 3
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

{% include figure.html url="../readings/images/buffy-texture-coords.png" description="Six sets of texture coordinates, three for each of two triangular faces, the green face and the magenta face." classes=""%}


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
    
## Modifying the faceVertexUvs
    

Using this function, we can map our US flag onto the plane with no gray areas:

However, the code for doing this is unintuitive, because the default Three.js
behavior is to _flip_ the vertical texture parameter. This is called `.flipY`.
So, instead of wanting the T parameter to go

  * from 0 in the upper left, 
  * to 0.8 in the lower left 

We actually set it to go

  * from 0.2 = 1-0.8 in the lower left, 
  * to 1 in the upper left 

That is, with a flipped Y, the upper left corner has coordinates of (0,1) and
the lower left has coordinates of (0,0.2). To pull out just that piece, here's
how we have to set the texture parameters:

    
```javascript
      updateTextureParams(flagGeom,0,0.75,1-0.81,1);
```

Here's the [complete demo](../demos/TextureMapping/plane-flags-v2.html).

## Loading Images

Here's a demo showing an image file being loaded and texture-mapped onto the
same plane we've used before:

[Plane Buffy](../demos/TextureMapping/PlaneBuffy.html)

The code has one very tricky part, though. When we computed an array and used
it as a texture, the array was already available for rendering. With an
external image, there's going to be some delay before the data arrives from
some network source. This delay might run to a few hundred milliseconds, but
even a few milliseconds is an enormous amount of time compared to the speed
that code is running in JavaScript.

Consequently, if the only rendering we did was right after the image was
referenced, the code would not work at all. Here's pseudo-code for the
situation I'm describing:

    
```javascript
    var buffyTexture = new THREE.ImageUtils.loadTexture( "../../../readings/images/buffy.gif" );
    var buffyMat = new THREE.MeshBasicMaterial(
        {color: THREE.ColorKeywords.white,
         map: buffyTexture});
        
    var buffyMesh = new THREE.Mesh( planeGeom, buffyMat );
    scene.add(buffyMesh);
    TW.render();
```

There simply isn't time for the image to load between that first line, when a
request for the image is sent to the server, and the last line, when the scene
is rendered. If you try this, the plane will be blank white.

The solution is to use an _event handler_. Event handlers are general-purpose
solutions to code that you want to run after some event has happened. In this
case, the event is that the image data has finally arrived from the server.
The event handler can then invoke the renderer.

The way that Three.js does this is also very standard: a callback function is
passed in, and the callback will be invoked when the event occurs. Here's the
improved code:

    
```javascript
    // these should be local, but we use globals so that
    // you can poke around
    var planeGeom, planeTex, planeMat, planeMesh;
    var imageLoaded = false;
    
    var loader = new THREE.TextureLoader();
    
    function loadPlaneBuffy() {
        loader.load("../../../readings/images/buffy.gif",
                    function (texture) {
                        console.log("buffy image is loaded");
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

In the code above, we pass in an _anonymous_ function to be the event handler.
It gets invoked when the image finishes loading, and does all the work of
building the object, including its material with the texture, and finally it
renders the scene. (Rendering is optional; maybe you have other objects to
load first.) Nothing it does is new to you; just the packaging and timing.

That's it! Later, we will get into more complex situations where you want to
use umpteen images as textures: how do you figure out that they've all,
finally, loaded, and the scene can be rendered?

## Coming Up

In the rest of the texture-mapping reading, we'll discuss:

  * Mapping image textures onto a `BoxGeometry` and other shapes 
  * Combining texture-mapping with material and lighting. This will be very cool, allowing us to get very nice shading effects on our texture-mapped surfaces. 
  * Looking at using _nearest_ versus _interpolated_ texture values. 
  * The representation of textures as arrays, and the representation of images in RGB, including the concept of accessing an array in row major order. 
  * Bump mappings and environment mappings. 

## Summary

Here's what we learned

  * At its most basic, a texture is an array of pixels. So is an image. 
  * Each vertex of a triangular face can have texture parameters 
  * Texture parameters are 2D and each lives in the [0,1] interval, with {0,1} being the edges of the 2D texture. 
  * Texture parameters outside the [0,1] interval can be 
    * clamped to the edge 
    * repeated 
    * mirrored 
  * When loading textures from an image, we need to consider that it takes a non-negligible amount of time for the image to load, and so we will need to write _event handlers_ for the _after load_ event. 



### Source

This page is based on <>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

  * [Home](/~cs307/index.html)
  * [Syllabus](/~cs307/syllabus.html)
  * [Schedule](/~cs307/schedule.html)
  * [Reference](/~cs307/reference.html)

# Texture Mapping 1: Simple Image Mappings

## Plan

  * Review solution to [adding a bulb to the Luxo lamp](08b.html#luxo)
  * Overview of texture mapping 
  * Mapping an image onto a plane 
  * CORS and setting up a local server 
  * Exercise: Loading image files on your local machine 
  * Exercise: Mapping multiple floral images 
  * Exercise: A room with a view 
  * Next time: Repeating textures, the Texture Tutor, and synthetic textures

## Texture Mapping Recap

  * At its most basic, a texture is an array of pixels. So is an image. A texture can be a synthetically generated pattern of lightness or color, or an image taken from a camera. 
  * A texture pattern can be _mapped_ or "painted" onto any surface. A texture pattern is typically a 2D thing, but can be mapped onto 2D or 3D surfaces. 

![texture mapping](tm1.jpg)        ![texture mapping](tm3.png)

![texture mapping](tm2.GIF)        ![texture mapping](tm4.png)

  * Each vertex of a triangular face can have texture parameters. Typically, the texture parameters for a whole geometry go from 0-1 (but not always), and the texture parameters for faces are interpolated. 
  * When loading textures from an image, we need to consider that it takes a non-negligible amount of time for the image to load, so we will need to write _event handlers_ for the _after load_ event. 

## Mapping an Image onto a Plane

Consider this [ relaxing floral scene](10-exercises/flower-display.html) in
which a single image is mapped onto three planes.

Three.js has a `THREE.TextureLoader` class to load an image to be used for
texture mapping, which enables us to provide an event handler that among other
things, can render the scene after the image load is complete.

This is the key code in the floral display example:

    
    
    var loader = new THREE.TextureLoader();
    
    loader.load("relaxation.jpg",
                function (texture) {
                    displayPanels(texture);
                } );
    

The image is stored in a `THREE.Texture` object that is passed as input to an
anonymous function (the event handler) that is provided as the second input to
the `load()` method.

Here is the definition of the `displayPanels()` function, which renders the
scene at the end:

    
    
    function displayPanels (texture) {
        // plane geometry with texture-mapped floral image
        var planeGeom = new THREE.PlaneGeometry(10,10);
        var planeMat = new THREE.MeshBasicMaterial(
                               {color: 0xffffff,
                                map: texture} );
        var planeMesh = new THREE.Mesh(planeGeom, planeMat);
        scene.add(planeMesh);
    
        // repeat texture mapping on right panel
        var planeMeshR = planeMesh.clone();
        var dist = 5*Math.cos(Math.PI/4);
        planeMeshR.position.set(5+dist, 0, dist);
        planeMeshR.rotation.y = -Math.PI/4;
        scene.add(planeMeshR);
    
        // repeat texture mapping on left panel
        var planeMeshL = planeMesh.clone();
        planeMeshL.position.set(-5-dist, 0, dist);
        planeMeshL.rotation.y = Math.PI/4;
        scene.add(planeMeshL);
    
        TW.render();    // render the scene
    }
    

Three.js requires that images used for texture mapping have dimensions that
are powers of 2. In this example, the image has 256x256 pixels, and it is
mapped onto square planes.

## CORS and Setting up a Local Server

Before we launch into our first exercise, we need to deal with a bit of
unpleasantness called [CORS](https://developer.mozilla.org/en-
US/docs/Web/HTTP/Access_control_CORS), for _Cross-Origin Resource Sharing_.
The problem arises because, for security reasons, JavaScript is not allowed to
do what the browser can do: request resources from another domain.

What this means for us is:

> **Your images and your html file have to be in the same domain.**

This means you can't work with textures on your local machine without setting
up a server. Fortunately, this is easy.

There's more about CORS in the [next reading](../readings/10-texture-
mapping-b.html), but we'll do an exercise here to demonstrate the problem and
solution. We'll use the "Run Local Server" option, using Python, described in
the Three.js
[documentation](https://threejs.org/docs/index.html#manual/introduction/How-
to-run-things-locally).

### Exercise: Loading image files on your local machine

Save the [flower-display.html](10-exercises/flower-display.html) code file on
your Desktop (be sure to save it as Webpage, HTML Only). Also save this
[image](10-exercises/relaxation.jpg) into your Desktop (be sure to keep the
same filename).

Open your local `flower-display.html` file in your browser and observe the
error message that appears in the JavaScript Console.

Now follow these steps to run a local server on your Mac or laptop:

  * Start a terminal window 
  * `cd` to the directory that has your downloaded HTML file in it, in this case `cd ~/Desktop`. 
  * Start a web server on port 8000 (by default) using Python: 
    
                      python -m SimpleHTTPServer
            

  * Go back to your web browser and try the following URL: 
    
                    http://localhost:8000/flower-display.html
            

You should now see the display of three panels with the flower scene.

## Mapping Multiple Images onto Scene Objects

## Exercise: A Room with a View

This exercise illustrates how you can use a `THREE.BoxGeometry` to _create a
room_ , which will be helpful for the [sconce
scene](http://cs.wellesley.edu/~cs307/assignments/sconce-solution.html) that
you'll create for HWK4.

    1. To begin, save this [room-start.html](10-exercises/room-start.html) code file to your Desktop, along with this [seaScape.jpg](10-exercises/seaScape.jpg) image. 

The code creates a `THREE.BoxGeometry` object with sides that have 6 different
colors.

    2. Change the basic materials for the cube faces to `THREE.MeshLambertMaterial`, and set the `side` property for the material to `THREE.BackSide` (this is all that's needed to convert the box to a room that can be viewed from the inside!) 
    3. Add code to create a white point light source, position this light in the center of the room, and add it to the scene 
    4. Complete the definition of the `displayView()` function, which should map an image (stored in the input `THREE.Texture` object) onto a plane that is the same size as each side of the room, position the plane at the back wall of the room, and render the scene 
    5. Feel free to select a nicer set of colors for the walls of the room! 

Your solution might look like this [room-with-view.html](10-exercises/room-
with-view.html) scene

**(Optional)**  
In the above solution, we cheated a bit, creating something like a sheet of
wallpaper that was placed at the location of the back wall. We can also
_directly map an image texture_ onto one or more sides (faces) of the box.

Modify the definition of the `displayView()` function so that it maps the
input texture directly onto the back wall of the box, before rendering the
scene. You can just comment out your existing code and replace it with a
single code statement.

**Some hints:**  
`THREE.Mesh` objects have a `material` property. In the case of meshes with
multiple materials, the value of this property is an object that itself has a
property named `materials` that is an array of materials. In the case of our
`THREE.BoxGeometry`, this array contains 6 materials, one for each side of the
box (the two triangular faces for each side have the same material). You need
to _change one of the materials in this array_ to be a
`THREE.MeshLambertMaterial` with appropriate values for the `color`, `side`,
and `map` properties.

Your solution might look like this [room-with-view-v2.html](10-exercises/room-
with-view-v2.html)

_Why do you think the window appears with its hinge on the left side here,
rather than_ _on the right side, as it appeared in the first solution?_

## Next Time: Repeating Textures, the Texture Tutor, and Synthetic Textures

Texture patterns can also be _repeated_ on an object geometry. Next time,
we'll explore this tutor for texture mapping, based on a tutor by Nate Robins,
which illustrates key ideas that include the creation of repetitive textures:

[texture tutor](../threejs/demos/TextureMapping/tutor-r80.html)

Some key concepts are:

    * the difference between repeat/clamp/mirror 
    * the meaning of texture coordinates `s` and `t`. `t` goes from bottom to top in the above demonstration. (Ignore the `t` values in the image, because it's been _flipped_.) 
    * the meaning of `flipY`

Next time, we'll also explore how to create our own _synthetic images_ to use
for texture mapping.

(C) Scott D. Anderson & Ellen C. Hildreth. This work is licensed under a
[Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/).

    * [![Creative Commons License](/~cs307/Icons/somerights.gif)](https://creativecommons.org/licenses/by-nc-sa/1.0/)
    * [![Viewable With Any Browser](/~cs307/Icons/enhanced.gif) ](https://www.anybrowser.org/campaign/)
    * [![Valid HTML5](/~cs307/Icons/valid-html5v2.png) ](https://validator.w3.org/check?uri=referer)
    * [![Valid CSS!](/~cs307/Icons/vcss.gif) ](https://jigsaw.w3.org/css-validator/check/referer)

