---
layout: default
title: Homework 2 -- Clown
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
  - hw2.jso
stylesheets:
  - ../css/3620.css
---
# Homework 2: Clown

Please read the [standard instructions for all assignments](common.html).

Feel free to use the [template pen](https://codepen.io/asterix77/pen/PoqoLwq?editors=1010) as
a starting point.

## Goals

The main goal of this programming assignment is to help you feel comfortable with building things out of _other_ objects.


## Clown

Build a figure that looks roughly like the clown given in the Model Solution section below.

Some additional tips and requirements:

1. You'll need to learn about the THREE.TorusGeometry object, the THREE.RingGeometry object, and the finer points of spheres.
1. Use embedded frames to make your coding clearer and easier.
1. Look back at the Teddy Bear for inspiration.
1. Mark the origin using a yellow dot, as in the model solution. The origin must be there, between the clown's feet, so that it's easy to put the clown on a surface. This is the clown's origin.
1. Try to avoid magic constants for positioning, angles, scaling, and so forth (meaning unlabeled, undocumented numbers directly in the modeling code). Some of these are inevitable, of course, but there are connections among them, too. The positioning of the hand is related to the length of the arm, for example. Try to make these relationships clear in your code.
1. Also, try to make your clown flexible. For example, suppose your boss at Pixar says that the head needs to be bigger, flatter, wider, or whatever: what needs to be changed in your code? Try to make it easy to adjust things like this, either by coding or documentation.


## Model Solution

Here is a model [clown solution](hw2-solution.html).

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
 * inclusion of all parts including facial features and hat
 * origin in center of base
 * proper hierarchy of body parts and use of embedded frames
 * use of different materials for different parts
 * flexible code / no magic constants


### Source

This page is based on <https://cs.wellesley.edu/~cs307/assignments/hwk2-clown.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


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
