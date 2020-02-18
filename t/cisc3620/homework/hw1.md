---
layout: default
title: Homework 1 -- Obelisk
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
  - hw1.jso
stylesheets:
  - ../css/3620.css
---
# Homework 1: Obelisk

Please read the [standard instructions for all assignments](common.html).

Feel free to use the [template pen](https://codepen.io/asterix77/pen/PoqoLwq?editors=1010) as
a starting point.

## Goals

The main goal of this programming assignment is to help you feel comfortable
with building an arbitrary thing out of "raw" geometry. We'll soon be building
stuff out of spheres and boxes and such, and that will be a powerful building
technique, but we need to have lots of tools in our toolbox. When you get to
your project, I want you to feel you can build anything you want.

Note that the obelisk is not an enormously challenging object, but it
illustrates all the important concepts.

## Obelisk

Build a polyhedron that looks roughly like the Washington monument. Some key
[dimensions of the Washington
Monument](https://answers.yahoo.com/question/index?qid=20090517064236AA8rnFs):

  * width of the base is about 55 feet 
  * width of each side at the top is about 34 feet 
  * the height of the small pyramid (pyramidion) at the top of the monument is 55 feet 
  * The height of the whole monument is 555 feet 

This should help you get something that looks approximately like the
Washington monument. Exactness is not necessary, and indeed, you should make
your code appropriately parameterized.

Some additional requirements.

  1. Your polyhedron will have 8 sides (four for the pyramidion and four for the tower). You should not have a base/floor.
  2. The origin of the monument should be at the center of the base, directly below the peak. 
  3. Build a GUI so that you can play with the dimensions of the monument. 
  4. The camera settings must be correct, so that I can see the whole figure by using the mouse. This should work for the largest values of the dimensions that can be set by the user in the GUI. 
  5. You can use the default colors assigned by `TW.createMesh()` when it is just given a Geometry

Consider building your solution incrementally, for example:

  1. build the obelisk geometry and view it with the demo materials created with the `TW.createMesh()` function 
  2. add a GUI to adjust the parameters interactively 
  3. adjust various parameters and optionally color the faces/vertices by defining your own material

## Model Solution

Here is a model [obelisk solution](hw1-solution.html). (Note that camera settings in this solution do not accommodate the full
range of the main height that the user can set in the GUI, but in your
solution, it should.)

<div id="guiContainer"></div>
<div id="canvasParent"></div>

I give you this to clarify what I'm looking for. I expect that you will not
try to reverse-engineer the solution. I have made it difficult (so you won't
accidentally see the solution), but it would not be impossible. Please don't
try.

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
 * proper geometry
 * origin in center of base
 * camera settings allow all rotations to be seen
 * GUI works
 * GUI has reasonable values



### Source

This page is based on <https://cs.wellesley.edu/~cs307/assignments/hwk1-obelisk.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


<script>
window.addEventListener('load', function () {
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
});
</script>
