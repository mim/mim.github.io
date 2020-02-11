---
layout: default
title: Keyboard and GUI Controls
stylesheets:
 - /css/rouge.css
---
# Keyboard and GUI Controls

In this reading, you'll learn how to control the appearance of a graphical
scene interactively, using keyboard and GUI controls. This capability can be
helpful for the design and debugging of graphics programs.

## Keyboard Controls

Recall that the TW module sets up an orbiting camera whose position can be
controlled with the mouse and keyboard, as described for the [barn
demo](../demos/barn-tw.html). We can also create our own keyboard
controls. Try out this simple demonstration of an [adjustable
box](adjustBoxKeyboard.html) whose width can be controlled with the '+'
(expand) and '-' (shrink) keys. Type '?' to see these new keyboard controls
added to the top of the list of available keys.

The JavaScript code, shown below, contains just a few key elements:

  * one or more global variables to control (in this case, `boxWidth`) 
  * one or more _callback functions_ that modify the global variable(s) and then rebuild and redraw the scene (in this case, the `expandBox()` and `shrinkBox()` functions -- note the use of the `remove()` method to remove an existing `Mesh` object from the scene) 
  * a binding of the callback function to a particular key, using the function `TW.setKeyboardCallback(key,function,docstring)` (note that this should be called after the `TW.mainInit()` function that creates the initial keyboard controls) 

Here is the JavaScript code:

    
```javascript    
    // Create an initial empty Scene
    var scene = new THREE.Scene();
    
    // global variable for box width
    var boxWidth = 20;
    
    // addBox() creates a 3D rectangular box of a given width, height, depth
    // and adds it to the scene
    function addBox (width,height,depth) {
        var boxGeom = new THREE.BoxGeometry(width,height,depth)
        boxMesh = TW.createMesh(boxGeom);
        scene.add(boxMesh);
    }
    
    addBox(boxWidth,40,60);
    
    // Create a renderer to render the scene
    var renderer = new THREE.WebGLRenderer();
    
    // TW.mainInit() initializes TW, adds the canvas to the document,
    // enables display of 3D coordinate axes, sets up keyboard controls
    TW.mainInit(renderer,scene);
    
    // Set up a camera for the scene
    TW.cameraSetup(renderer,
                   scene,
                   {minx: -20, maxx: 20,
                    miny: -25, maxy: 25,
                    minz: -35, maxz: 35});
    
    // expandBox() is a callback function that increases the width of the box
    function expandBox() {
        scene.remove(boxMesh);
        boxWidth = boxWidth + 2;
        addBox(boxWidth,40,60);
        TW.render();
    }
    
    // shrinkBox() is a callback function that decreases the width of the box
    function shrinkBox() {
        scene.remove(boxMesh);
        boxWidth = boxWidth - 2;
        addBox(boxWidth,40,60);
        TW.render();
    }
    
    TW.setKeyboardCallback('+', expandBox, "wider box");
    TW.setKeyboardCallback('-', shrinkBox, "narrower box");
```

## dat.GUI

We can also create a GUI with _slider controls_ to adjust parameters over a
continuous range of values. Some folks at Google have made this easy to do
with [`dat.GUI`](http://workshop.chromeexperiments.com/examples/gui/), a
package for creating a GUI to modify JavaScript variables. Try out this new
example of our [adjustable box](adjustBoxGUI.html). The sliders in the upper
right corner of the page allow you to smoothly adjust the width, height, and
depth of the box (move the camera to see all three dimensions).

The JavaScript code, shown below, again contains just a few key elements:

  * one or more global object variables that contain parameters to be controlled, with initial values (in this case, `sceneParams`) 
  * one or more _callback functions_ that are called when the user modifies one of the parameters in the GUI, and rebuild and redraw the scene (in this case, the `redrawBox()` function) 
  * creation of a new `dat.GUI` object (called `gui` in the code below) 
  * calls to the `add()` method and `onChange()` _event handler_ (these two calls can be combined in a single code statement) that specify each combination of global object variable, parameter, range of values for the slider, and callback function to execute when the parameter is changed by the user 

Finally, here is the JavaScript code for the adjustable box with a GUI:

    
```javascript    
    // Create an initial empty Scene
    var scene = new THREE.Scene();
    
    // global variable for dimensions of box 
    var sceneParams = {
        boxWidth: 20,
        boxHeight: 40,
        boxDepth: 60
    }
    
    // addBox() creates a 3D rectangular box of a given width, height, depth
    // and adds it to the scene
    function addBox (width,height,depth) {
        var boxGeom = new THREE.BoxGeometry(width,height,depth)
        boxMesh = TW.createMesh(boxGeom);
        scene.add(boxMesh);
    }
    
    addBox(sceneParams.boxWidth,sceneParams.boxHeight,sceneParams.boxDepth);
    
    // Create a renderer to render the scene
    var renderer = new THREE.WebGLRenderer();
    
    // TW.mainInit() initializes TW, adds the canvas to the document,
    // enables display of 3D coordinate axes, sets up keyboard controls
    TW.mainInit(renderer,scene);
    
    // Set up a camera for the scene
    TW.cameraSetup(renderer,
                   scene,
                   {minx: -20, maxx: 20,
                    miny: -30, maxy: 30,
                    minz: -40, maxz: 40});
    
    // redrawBox() is a callback function that redraws the box with the new dimensions
    function redrawBox() {
        scene.remove(boxMesh);
        addBox(sceneParams.boxWidth,sceneParams.boxHeight,sceneParams.boxDepth);
        TW.render();
    }
    
    // set up sliders to control the dimensions of the box
    var gui = new dat.GUI();
    gui.add(sceneParams, 'boxWidth', 10, 30).onChange(redrawBox);
    gui.add(sceneParams, 'boxHeight', 20, 50).onChange(redrawBox);
    gui.add(sceneParams, 'boxDepth', 30, 70).onChange(redrawBox);
```    

When creating a GUI for your own programs, be sure to adjust the scene
bounding box to accommodate the range of values that you allow for your
parameters!


### Source

This page is based on <https://cs.wellesley.edu/~cs307/readings/controlsKeyboardGUI.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 
