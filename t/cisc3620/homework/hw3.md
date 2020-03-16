---
layout: default
title: Homework 3 -- Views
stylesheets:
  - ../css/3620.css
---
# Homework 3: Views

Please read the [standard instructions for all assignments](common.html).

## Goals

This assignment provides practice with setting up and modifying a camera to view a scene from a desired viewpoint. There are two parts. None of the programs should use `TW.setupCamera()`, you need to set up your own camera using Three.js. (A consequence of this is that the mouse doesn't work for either program, because this was set up by `TW.setupCamera()` in past examples.) You will also implement keyboard callbacks for each of the two programming parts.


## Part 1: Wireframe barn views

[This pen](https://codepen.io/asterix77/pen/ZEGopYw) shows a wireframe barn with a GUI for adjusting several camera parameters: the field of view, eye coordinates, and up coordinates. For this part of the assignment, you should:

1. Find the camera settings that lead to each image shown below (or as close as you can get)
1. Create your own pen (potentially based on the GUI pen) that can generate all of these images
   1. Your pen should NOT have a GUI
   1. Your pen should use keyboard controls to show each of these images using the number keys 1-5, like [this solution](hw3a-solution.html)

I give you the model solution to clarify what I'm looking for. I expect that you will not try to reverse-engineer the solution. I have made it difficult (so you won't accidentally see the solution), but it would not be impossible. Please don't try.

{% include figure.html url="img/task1-fr1.png" description="Target view 1" %}
{% include figure.html url="img/task1-fr2.png" description="Target view 2" %}
{% include figure.html url="img/task1-fr3.png" description="Target view 3" %}
{% include figure.html url="img/task1-fr4.png" description="Target view 4" %}
{% include figure.html url="img/task1-fr5.png" description="Target view 5" %}



## Part 2: Flythrough

[This pen](https://codepen.io/asterix77/pen/JjdvRZR) shows a scene with a GUI for adjusting several camera parameters: the eye Y and Z coordinates, and the "at" Y coordinate. For this part of the assignment, you should:

1. Find the camera settings that lead to each image shown below
1. Create your own pen (separate from the first pen and potentially based on the GUI pen for this part) that can generate all of these images
   1. Your pen should NOT have a GUI
   1. Your pen should use keyboard controls to show each of these images using the number keys 0-9, like [this solution](hw3b-solution.html)

Note that the barn in this scene is half the size of the barn in part 1. Here it is 5x5x10, in part 1 it is 10x10x20.

Hint: start from the last view (the closest) and then work backwards. Try to figure out the pattern in the settings, there is one.

Hint 2: the aliasing artifacts (dotted lines appearing on edges) can be useful in figuring out if you are exactly right or not.


{% include figure.html url="img/task2-fr01.png" description="Frame 1" %}
{% include figure.html url="img/task2-fr02.png" description="Frame 2" %}
{% include figure.html url="img/task2-fr03.png" description="Frame 3" %}
{% include figure.html url="img/task2-fr04.png" description="Frame 4" %}
{% include figure.html url="img/task2-fr05.png" description="Frame 5" %}
{% include figure.html url="img/task2-fr06.png" description="Frame 6" %}
{% include figure.html url="img/task2-fr07.png" description="Frame 7" %}
{% include figure.html url="img/task2-fr08.png" description="Frame 8" %}
{% include figure.html url="img/task2-fr09.png" description="Frame 9" %}
{% include figure.html url="img/task2-fr10.png" description="Frame 10" %}


## General comments

I want you to try to duplicate my camera shape and location as closely as possible. In other words, try to analyze how things are projecting to see if you can reverse-engineer to set up a similar camera. This will help you when you are trying to achieve a particular look in your own scenes.

I'll make you some guarantees: all my numbers are nice integers. So if you get close, you'll likely be exactly on. I also didn't modify the aspect ratio, and the distance to the near and far planes are such that everything is visible. You only have to worry about the FOVY (field of view in the Y direction) and the arguments to position the camera.



## TW.setKeyboardCallback()

You should use `TW.setKeyboardCallback()` for both Part 1 and Part 2. This function takes three arguments, like this:

```javascript
TW.setKeyboardCallback("1", fred, "camera setup 1");
```

  * The first argument is a one-character string that defines the key you want to bind.
  * The second argument is a function object. The system will invoke that function when the key is pressed. Remember that if you give the name of a function, like `fred`, you will omit the parentheses, because you are not invoking `fred` now, the system will be invoking it later.
  * The third argument is the documentation string that is displayed if the user presses the question mark key (?) to show the available keyboard callbacks.
  * There is an optional fourth argument that is a boolean that indicates whether to set this callback in a master list of shared callbacks, or set it in a local list just for this canvas. The default is false, which is just for this canvas, which is what you'll want for this assignment.

You should set up keyboard callbacks after the canvas exists, which is done by `TW.mainInit()`. For more information on the use of keyboard callbacks, see [this earlier reading](../readings/03a-controls.html).


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
 * correctness of views
 * correctness of parameters
 * each pen can show all necessary images
 * keyboard controls work properly
 * flexible code / no magic constants


### Source

This page is based on <https://cs.wellesley.edu/~cs307/assignments/hwk3-camera.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 
