---
layout: reveal
title: Introduction to OpenGL/WebGL, Three.js, and the Barn
---
# {{ page.title }}
#### {{ site.author }}

Based on [CS 307 reading 2](https://cs.wellesley.edu/~cs307/readings/02-OpenGL-Barn.html) which is copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


## Plan

  * What an API is, and the three APIs we'll use in this class: OpenGL/WebGL, Three.js, and TW 
  * How information is stored and processed in OpenGL 
  * Some geometrical objects that we'll want to be able to draw, and how they're defined in OpenGL and Three.js 
  * How to create a simple scene using Three.js and TW  

## What is an API?

An Application Programming Interface (API) is

  * a set of programming elements (types, variables, functions, and methods)
  * that enable some new capability
  * or allow the programmer to interact with a piece of hardware
    * as a robot or a graphics card

### We have three APIs

  * WebGL: standard graphics API
  * Three.js: JavaScript library using WebGL
  * TW: Custom library for using Three.js

### WebGL

  * WebGL is a standard graphics API
  * It is a subset of the full OpenGL API that is supported by most graphics cards.
    * I'll use the terms " OpenGL" and "WebGL" interchangeably.
  * WebGL/OpenGL is about modeling and rendering.
  * The specification is documented in [the online man pages](http://www.khronos.org/registry/webgl/specs/latest/2.0/)
    * but these are difficult to read at best.
  * We will use very little of this directly, because we are using Three.js.

### Three.js

  * [Three.js](http://threejs.org) is an API built on top of WebGL
  * It does a lot of the modeling and rendering for you.
  * WebGL is still there, underneath, but we will rarely see it.
  * Three.js allows you to ignore (for now) a lot of detailed technical concepts in Computer Graphics that plain WebGL would force you to know just to draw something on the screen.
  * Your JavaScript code might look like this: 

```javascript
var box_geom = new THREE.BoxGeometry(1,2,3); // width, height, depth
```

### TW

  * TW is Scott Anderson's home-grown API
    * packages up certain common operations in our Three.js programs
  * It is a thin layer on top of Three.js
    * It does things like setting up a camera for you
    * and allowing you to toggle whether to show the coordinate axes.
  * All of these functions are available in the `TW` object
  * your JavaScript code might look like this: 

```javascript
var box_mesh = TW.createMesh( box_geom );
TW.cameraSetup( args );
```    

## The OpenGL Pipeline

  * The OpenGL API and the graphics card are implemented as a _pipeline_.
    * Possibly familiar from computer architecture
  * Calls to the OpenGL functions will often
    * put data (e.g., vertices) into one end of a pipeline
    * where they undergo transformations of various sorts
    * and finally emerge at the other end (e.g., as pixels)
  * You can read a lot more at [Rendering Pipeline
Overview](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview).

### The OpenGL Pipeline

[![The OpenGL Pipeline](https://www.ntu.edu.sg/home/ehchua/programming/opengl/images/Graphics3D_Pipe.png)](https://www.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html)

### The OpenGL Pipeline

  * Essentially, we put _vertices_ of objects (and other information about
materials, lights, and the camera) into one end of the pipeline
    * and get image _pixels_ out the other end
  * But also some API functions modify the pipeline (e.g., lighting)
  * While the pipeline has some state, it mostly passes vertices through
  * To draw the barn from a different angle
    * we have to send all of the vertices through the pipeline again
    * although the graphics card does have local buffers that store pipeline inputs

## Geometry Data Structures

  * Mostly what you are used to from drawing, with some wrinkles
  * **Points/Vertices**: just _dots_. Have location and nothing else 
  * **Vectors**: _arrows_. Have direction and magnitude and nothing else.
    * Can't draw them in OpenGL, but they are used a lot
  * **Line Segments**: parts of lines (lines are infinitely long). Defined by their endpoints. A pair of points/vertices. 
  * **Triangles**: useful building block for surfaces (more soon)
  * **Polygons**: general 2D shapes with an arbitrary number of vertices
  * **Polyhedra**: A polyhedron is a 3D figure made up of vertices, edges and faces. 

### Triangles

  * Triangls are necessarily **planar** (flat) and **convex** (no dents)
  * Bad things happen if you try to draw non-planar or non-convex polygons
  * Three.js uses triangles as its universal representation of geometry
    * API calls to build, e.g., spheres and cylinders return a _polygonal approximation_ of the smooth object.
  * You can usually specify the amount of smoothness in the approximation:
    * a sphere built out of 100 tiny triangles will be smoother than one built out of 10 largish triangles
    * but will take longer to render
    
[![Sphere approximations with triangles](../readings/images/sphereApprox.jpg)](http://www.programering.com/)


### Front and Back of Triangles

  * Each face has two sides: front and back
  * By convention, the front is the face where the verticies are specified in _counter-clockwise_ order (right hand rule)
  * The front corresponds to the outside of a polyhedron
  * The end faces of the barn are pentagons, made of three triangles

![the five vertices and three triangles of the front of the barn](../readings/images/barn-front.png)

  * How many ways can we break this pentagon up into triangles?

### Front and Back of Triangles

![the five vertices and three triangles of the front of the barn](../readings/images/barn-front.png)

  * We then define a triangle by listing its vertices _in counter-clockwise order from the outside_.
  * So, 4,3,2 is one way to describe the top of the barn
    * List the other equivalent ways
  * List other non-equivalent ways
  * Note that to save computation, by default Three.js only draws the front of every triangle
    * How much time does this save?

### Normal Vectors

  * Each face also has an associated vector that is _perpendicular_ to the face
  * Called the _normal_ vector, important for lighting
  * The front of the barn lies in the z=0 plane
    * because all the z coordinates of its vertices are zero.
    * Therefore, it has a normal vector that is parallel to the z axis.

## Points and Vectors in Three.js

  * Given an origin and coordinate system, we can define a point in 3D space with 3 numbers
  * Here are two points

```
    P = (1, 5, 3)
    Q = (4, 2, 8)
```

  * A vector can be thought of as an arrow between two points
    * or even as a movement from one to the other
  * Thus the vector v from Q to P is P-Q (subtract the components, respectively)
  * The vector w, from P to Q, is the negative of vector v
  * We can also define vectors in the same space with 3 numbers

```
    v = P - Q
    w = Q - P
```

  * What are their numerical values?


### Points and Vectors in Three.js

  * How do we specify points and vectors to Three.js? Here's an example:
    
```javascript
var P = new THREE.Vector3(1,2,3);
```    

  * There is just one representation for both ponts and vectors
  * But they are conceptually very different
    * so we will still use the terms "point" and "vector" to refer to them
    * point: location
    * vector: direction

## Drawing in Three.js

  * To draw stuff in Three.js:
    1. _represent_ something
    1. then _render_ it
  * So how do we _represent_ stuff in Three.js?
  * Wow would we represent the barn that we saw on the first day of class?


### Three.js terminology

<dl>
<dt>Geometry</dt>
<dd>is a structure of vertices and faces and associated geometrical information, such as the vectors that specify the orientations of faces.</dd>
<dt>Material</dt>
<dd>is a set of properties that directly or indirectly specify the color of the object. The colors of the faces can be set directly by the material (such as, "this face is red"), or indirectly ("this face interacts with light in the following ways ..."). </dd>
<dt>Mesh</dt>
<dd>A geometry is combined with a material to yield a <em>mesh</em>, which then has enough information to be rendered. </dd>
</dl>


### Three.js geometry example

  * Build a Geometry object
  * Combine it with some Material
  * Add it to the Scene
        
```javascript
 var barnGeometry = new THREE.Geometry();
 // add the front
 barnGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
 barnGeometry.vertices.push(new THREE.Vector3(30, 0, 0));
 barnGeometry.vertices.push(new THREE.Vector3(30, 40, 0));
 ...
 // front faces
 barnGeometry.faces.push(new THREE.Face3(0, 1, 2));
 barnGeometry.faces.push(new THREE.Face3(0, 2, 3));
 barnGeometry.faces.push(new THREE.Face3(3, 2, 4));
 ...
```

  * Note that this is just for 3 vertices, and 3 faces


## Coordinates

  * In 3D models, all vertices have 3 coordinates: X, Y, Z
  * You can move the camera around, but initially
    * X increases to the right
    * Y increases going up
    * Z increases towards you
  * So things farther from you in the scene have lower Z components or even negative ones.
    * e.g., the front of the barn is at Z=0 and the back is at Z=-len

### Scale

  * Our coordinates can have (pretty much) any scale we want
    * E.g., all X, Y, and Z coordinates could be between 0 and 1
    * Or between 1 and 100.
    * Or between -1000 and +1000.
  * These numbers can mean anything you want
    * could be millimeters, kilometers or light years
  * If you're imagining a real barn, perhaps the numbers are in feet or meters
  * Note: it is useful for debugging and development purposes to decide on a real scale and stick to it

## Creating a Simple Scene with Three.js and TW

[Box demo](https://codepen.io/asterix77/pen/jOPNaVZ?editors=1010)

### Box demo

The key elements include:

  * a `THREE.Scene` object that is a container used to store all the objects and lights for the scene we want to render 
  * a 3D object in the scene with a _geometry_ that is a built-in `THREE.BoxGeometry` and surface _material_ created by the `TW.createMesh()` function. This object is added to the scene using the `add()` method 
  * a `THREE.WebGLRenderer` object that will use your graphics card to render the scene 
  * a call to `TW.mainInit()` that performs the operations described in the comments 
  * a call to `TW.cameraSetup()` that creates a camera to view the scene. The third argument specifies the _scene bounding box_ , the range of x,y,z coordinates for a virtual box that encompasses the scene to be viewed. 

### The Barn Code

[Barn demo](https://codepen.io/asterix77/pen/bGNyGYJ)

## Learning More Three.js

We'll learn much more Three.js over the semester, and most of what you need to
know will be covered in the lecture notes for the course.

Other sources include:

  * Book by Jos Dirksen, [ _Learning Three.js: The JavaScript 3D Library for WebGL, Third Edition_](https://www.packtpub.com/web-development/learn-threejs-third-edition).
    * [This github repo](https://github.com/josdirksen/learning-threejs-third) contains Dirksen's code for all the examples in his book (third edition). Here are a few examples to give you a taste (do not worry about understanding the code at this point): 
      * [02-first-scene.html](https://mr-pc.org/learning-threejs-third/src/chapter-01/02-first-scene.html)
      * [03-materials-light.html](https://mr-pc.org/learning-threejs-third/src/chapter-01/03-materials-light.html)
      * [04-materials-light-animation.html](https://mr-pc.org/learning-threejs-third/src/chapter-01/04-materials-light-animation.html)
    * and [this github repo](https://github.com/josdirksen/learning-threejs) contains all of the examples from the second edition of the book. 
  * [Online Three.js documentation](https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene) -- this is more of a reference source than a tutorial, but includes many code examples and links to the Three.js source code on GitHub. The online course notes contain many links to specific documentation pages. 
  * At times, we may need to resort to posting questions on [StackOverflow](http://stackoverflow.com/tags/three.js/info). 


## Summary

  * What an API is, and the three APIs we'll use in this class: OpenGL/WebGL, Three.js, and TW 
  * How information is stored and processed in OpenGL 
  * Some geometrical objects that we'll want to be able to draw, and how they're defined in OpenGL and Three.js 
  * How to create a simple scene using Three.js and TW  
