---
layout: default
title: Homework 5 -- Textured Barn
javascripts:
  - ../libs/dat.gui.min.js
  - ../libs/three.min.js
  - ../libs/tw.js
  - ../libs/OrbitControls.js
  - hw5.jso
stylesheets:
  - ../css/3620.css
---
# Homework 5: Textured Barn

Please read the [standard instructions for all assignments](common.html).

## Goals

The emphasis in this assignment is working with textures. It's not primarily
about geometry, though you will be modifying texture coordinates, which live
in the geometry object. Also, it uses material and lighting, but keep this
part simple. It's also not about cameras, so feel free to use
`TW.cameraSetup()`.

Here's the goal, a barn with siding and roofing, which I'm calling a textured
barn.

<div id="canvasParent">
<div id="guiParent" class="datgui"></div>
</div>

<div id="colorInfo" style="display: none"></div>
<div id="geomInfo" style="display: none"></div>


See the standalone version [here](hw5-solution.html), including additional debugging information.

I give you the model solution to clarify what I'm looking for. I expect that you will not try to reverse-engineer the solution. I have made it difficult (so you won't accidentally see the solution), but it would not be impossible. Please don't try.


Note the four modes that the GUI makes available:

  * showFaces helps to explain the geometry (you do not need to implement this)
  * showTextureCoords helps to explain how the default texture coordinates are assigned (you do not need to implement this)
  * showLighting puts white Lambert material on the barn, so you can see the lighting effects 
  * showResult is, of course, the desired product 

These modes will help you understand where the faces are and how the textures
are arranged (at least initially), though you have control of the texture
coordinates. You only need to implement the last two modes.


## What You Need to Do

Write your own program that mimicks this object:

  * Use material and lighting throughout; no `THREE.MeshBasicColor`, though of course you can use them when debugging. 
  * You'll need an ambient light and a directional light. 
  * Make your best guess at the material colors. 
  * Texture-map some textures on the walls and roof of the barn. Use wood or brick or some kind of reasonable "wall-like" material for the sides, and similarly for the roof. You don't need to use textures exactly like the ones used in the model solution; make it look nice. 
  * Note that the top of the front and back aren't triangles that are part of quads. You'll need to figure out the best way to deal with this. 
  * There's a GUI with a four-item menu. You need not implement the first two, but implement some way to turn off the material so that we can see the lighting. This will help you in your debugging, too, so it's not a waste of time. 
  * You will need to add texture coordinates to your barn (see earlier comments). 
  * You _must_ use repetition in your texture-mapping: find an image that looks nice as _part_ of the barn's sides or roof, and then " tile" it across the surface. That's much of what texture-mapping is about. 
  * Feel free to ask questions! 


## Stuff to Know

  * The plain TW barn geometry does not have texture coordinates (unlike most Three.js geometries). You need to add them. A function has been written for you to do this, called `addTextureCoords()`, in the file [hw5-starter.js](hw5-starter.js). You can use this function and then modify the assigned texture coordinates, or you can modify this function, or you can replicate its functionality in your own way; whatever you want. But if you use texture mapping and your geometry doesn't have texture coordinates, you'll get an "index out of bounds" error in the rendering.
  * The following TW functions might be useful: `TW.createBarnMultipleMaterials()`, `TW.setMaterialForFaces()`, and `TW.stringifyGeometry()`.
  * If you are using the class version of three.js, you can use `THREE.MeshFaceMaterial` to hold multiple materials. If you are using a more recent version, you can just pass an array of materials in to the constructor to `THREE.Mesh`.
  * Texture repetition works best if the dimensions of the texture image are powers of two. You don't get an error if the dimensions are not powers of two (although you'll see a warning in the JS console), but the effect is as if you used "clamp." It's easy enough to use [Pixlr](http://www.pixlr.com) or Photoshop (or even just Preview on a Mac) to resize an image to have power-of-two dimensions. 


## Submission and Security

Submit the URL to your pen via the dropbox on blackboard. Do not change your code after the deadline.

## How you will be graded

Grading will be broken down into two parts, basic functionality and style and documentation

{:class="table table-striped table-responsive" style="width: 60%; margin:auto"}
| | Rating | Actual Points |
| --- | --- | --: | 
| Basic functionality (80%) | | |
| | a good start | 50 | 
| | significant progress | 60 |
| | good | 70 |
| | excellent | 80 |
| Style and documentation (20%) | | |
| | missing | 0 |
| | fair | 10 |
| | good | 15 |
| | excellent | 20 |
| Total (100%) | | |


Grading of the basic functionality will be in terms of the following requirements:

  * Use of material and lighting
  * Correct lighting
  * Correct texture coordinates
  * Correct texture mapping and use of repetition in this mapping
  * Ability to turn off texture to show material only


### Source

This page is based on <https://cs.wellesley.edu/~cs307/assignments/hwk5-textured-barn.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 
