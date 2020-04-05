---
layout: default
title: Homework 4 -- Lit scene
javascripts:
  - ../libs/dat.gui.min.js
  - ../libs/three.min.js
  - ../libs/tw.js
  - ../libs/OrbitControls.js
  - hw4.jso
stylesheets:
  - ../css/3620.css
---
# Homework 3: Lit scene

Please read the [standard instructions for all assignments](common.html).

## Goals

The goal of this assignment is to gain experience in working with materials and lighting. It's not primarily about geometry, though there are some new things here, such as using the inside of a cube. It's also not about cameras, so feel free to use `TW.cameraSetup()`.

Here's the goal, a room with a light fixture in it that I'm calling a "sconce":

<div id="canvasParent">
<div id="guiParent" class="datgui"></div>
</div>

See the standalone version [here](hw4-solution.html), which is what your solution should look like.

I give you the model solution to clarify what I'm looking for. I expect that you will not try to reverse-engineer the solution. I have made it difficult (so you won't accidentally see the solution), but it would not be impossible. Please don't try.

Write your own program that mimics this scene:

  * Use material and lighting throughout; no `THREE.MeshBasicColor`. 
  * Make your best guess at the material colors. 
  * In the above solution, the `specular` colors are all shades of gray. 
  * The solution used 3 lights, and they were all gray lights (that is, no hue). You can adjust the brightness, but you don't need to worry that the light is colored. 
  * The material of all four walls is the same. The material of the floor and ceiling is different, as is the material of the ball and the sconce. 
  * Notice that the walls are different shades, despite their equal material. 
  * Notice that the underside of the ball is darkened. 
  * Notice that you can see both the inside and outside of the sconce, but only the inside of the walls, floor and ceiling. 
  * There's a GUI with three boolean values to toggle the lights. This will help you understand the contribution of each light. You must implement a GUI like this, too. You will not need to rebuild the scene when a value is toggled. ( **Hint:** the general `Light` class is a subclass of the `Object3D` class, which has a property named `visible` that is a boolean that controls whether or not an object is rendered.) 
  * Feel free to ask questions! 


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
  * Use of materials and lighting throughout
  * Good approximations of materials and their colors
  * Good approximation of lighting
  * Both the inside and outside of the sconce are visible, but only the inside of the walls, floor and ceiling are visible.
  * GUI with three boolean values to toggle the lights.
  * flexible code / no magic constants


### Source

This page is based on <https://cs.wellesley.edu/~cs307/assignments/hwk4-sconce.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 
