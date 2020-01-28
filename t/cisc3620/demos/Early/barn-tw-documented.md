---
layout: default
title: Introduction to Canvas Drawing
javascripts:
 - ../libs/three.min.js
 - ../libs/OrbitControls.js
 - ../libs/tw.js
 - ../../js/307.js
 - ../../js/google-code-prettify/prettify.js
stylesheets:
 - ../../js/google-code-prettify/prettify-sda.css
 - ../../css/3620.css
---
# Barn Demo

This file has the minimal code to create a working Three.js application, using
the TW object to set up the camera for us. Because the canvas does not take
the entire window, there is space for some ordinary HTML like this.

<div class="demo" id="canvasParent"></div>

<script id="prog">
// We always need a scene.
var scene = new THREE.Scene();

// ====================================================================

/* Next, we create objects in our scene. Here, the <q>classic</q>
barn. The front left bottom vertex of the barn is the origin, so, for
example, the x coordinates go from 0 to 20. */

var barnWidth = 20;
var barnHeight = 30;
var barnDepth = 40;

var barnGeometry = TW.createBarn( barnWidth, barnHeight, barnDepth );

// the createMesh function adds a "demo" material to the geometry

var barnMesh = TW.createMesh( barnGeometry );

// the scene is the set of things to render, so add the barn.

scene.add(barnMesh);

// ================================================================
// 
// We always need a renderer

var renderer = new THREE.WebGLRenderer();

TW.mainInit(renderer, scene, {parentID: "canvasParent"});

/* We always need a camera; here we'll use a default orbiting camera.  The
third argument are the ranges for the coordinates, to help with setting up
the placement of the camera. They need not be perfectly accurate, but if
they are way off, your camera might not see anything, and you'll get a
blank canvas. */

TW.cameraSetup(renderer,
               scene,
               {minx: 0, maxx: 20,
                miny: 0, maxy: 30, // a bit low
                minz: -40, maxz: 0});
</script>


## Code

Here is the code that produced the program above:

<pre class="prettyprint linenums" data-codefrom="prog"></pre>

As you can see, it's very short. The `TW.cameraSetup()` function does the work
of setting up a useful default camera for you, so that you can look at your
scene from all sides. All you have to do is give it a general idea of where
your scene is, using the `{}` object with properties like `minx`.

## Barn Code

Now, we need to understand the barn, at least a little. Here is the code for
`TW.createBarn()`:

<pre class="prettyprint lang-js linenums" data-code-jsfunction="TW.createBarn"></pre>

The code creates a generic `THREE.Geometry` object, which is a collection of
_vertices_ and _faces_. Two attributes defined for every `THREE.Geometry`
object are arrays named `vertices` and `faces`. The `vertices` array stores
`THREE.Vector3` objects that each hold the `(x,y,z)` coordinates for a single
vertex. Each call to the `push()` method adds a new vertex onto the end of the
array. You can think of the indices of the array as the numerical labels of
the vertices. The `faces` array stores `THREE.Face3` objects that represent a
_triangle_ built from three vertices, using the corresponding indices of the
`vertices` array to specify which vertices to use. Each call to the `push()`
method adds a new face onto the end of the `faces` array.

Each face, of course, has two sides, just like a coin. One of these is the
_front_ and the other is the _back_. The (default) technical definition of the
front is the side where the vertices are in _counter-clockwise_ order. Here,
each face is defined from the front, and we use the convention that the front
of each face corresponds to the _outside_ of the barn.

Each face also has an associated vector that is _perpendicular_ to the face,
which mathematicians and computer graphics people call the _normal_ vector.
We'll learn that these are crucial in lighting computations.

Each vertex also has an associated vector which is the average of the normal
vectors of all the faces that contain the vertex. These can also be used in
lighting computations.

The last two lines of this function, one of which is commented out, compute
these sets of vectors.


## Source

[Source](https://cs.wellesley.edu/~cs307/threejs/demos/Early/barn-tw-documented.shtml) (C) Scott D. Anderson. This work is licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/)  
