---
layout: reveal
title: Keyboard and GUI Controls
---
# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/controlsKeyboardGUI.html) and [this lecture](https://cs.wellesley.edu/~cs307/lectures/03.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


## Plan

  * Review [two-barns](../labs/02b-introToThreejs.html#/4/1) example from last time, `position.set()`
  * Review exercise: [Adding a steeple](../labs/02b-introToThreejs.html#/5) to make a church 
  * Keyboard controls
  * GUI controls
  * Exercises: Adjusting steeple height with keyboard and GUI controls 


## Keyboard Controls

  * Recall that the TW module sets up an orbiting camera whose position can be controlled with the mouse and keyboard
    * as described for the [barn demo](../demos/barn-tw.html).
  * We can also create our own keyboard controls.
  * Try out this simple demonstration of an [adjustable box](adjustBoxKeyboard.html)
    * whose width can be controlled with the '+' (expand) and '-' (shrink) keys
    * Type '?' to see these new keyboard controls added to the top of the list of available keys

### Keyboard controls: simple example

Here is the JavaScript code:

```javascript
var boxWidth = 30;  // global variable

function addBox (width,height,depth) {
  var boxGeom = new THREE.BoxGeometry(width,height,depth);
  boxMesh = TW.createMesh(boxGeom);
  scene.add(boxMesh);
}

function expandBox() {  // callback function
  scene.remove(boxMesh);
  boxWidth = boxWidth + 2;
  addBox(boxWidth,40,60);
  TW.render();
}

// binding of callback function to a key
TW.setKeyboardCallback('+', expandBox, "wider box");
```

### Keyboard controls

  * The JavaScript code contains just a few key elements:
  * one or more global variables to control (in this case, `boxWidth`) 
  * one or more _callback functions_ that modify the global variable(s) and then rebuild and redraw the scene
    * in this case, the `expandBox()` and `shrinkBox()` functions
    * note the use of the `remove()` method to remove an existing `Mesh` object from the scene
  * a binding of the callback function to a particular key
    * uses the function `TW.setKeyboardCallback(key,function,docstring)`
    * note that this should be called after the `TW.mainInit()` function that creates the initial keyboard controls

### Keyboard controls: More complete example


<iframe height="554" style="width: 100%;" scrolling="no" title="Box keyboard controls" src="https://codepen.io/asterix77/embed/poJJmZo?height=554&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/poJJmZo'>Box keyboard controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## GUI controls: `dat.GUI`

  * We can also create a GUI with _slider controls_
    * to adjust parameters over a continuous range of values.
  * Some folks at Google have made this easy to do with [`dat.GUI`](http://workshop.chromeexperiments.com/examples/gui/)
    * a package for creating a GUI to modify JavaScript variables.
  * Try out this new example of our [adjustable box](adjustBoxGUI.html).
  * The sliders in the upper right corner of the page allow you to smoothly adjust the width, height, and depth of the box

### `dat.GUI` simple example

```javascript
// global object variable with parameters to control
var sceneParams = { boxWidth: 30, boxHeight: 40, ... }

function addBox (width,height,depth) { ... } // as before

// callback function
function redrawBox() {
  scene.remove(boxMesh);
  addBox(sceneParams.boxWidth,sceneParams.boxHeight, ...);
  TW.render();
}

var gui = new dat.GUI();   // new dat.GUI object

// call add() and onChange(), with global object variable,
// parameter, range of values, callback function
gui.add(sceneParams,'boxWidth',10,30).onChange(redrawBox);
```

### `dat.GUI`

  * The JavaScript code again contains just a few key elements:
  * one or more global object variables that contain parameters to be controlled, with initial values
    * in this case, `sceneParams`
  * one or more _callback functions_ that are called when the user modifies one of the parameters in the GUI
    * rebuild and redraw the scene
    * in this case, the `redrawBox()` function
  * creation of a new `dat.GUI` object (called `gui` in the code below) 
  * calls to the `add()` method and `onChange()` _event handler_
    * these two calls can be combined in a single code statement
    * specify each combination of global object variable, parameter, range of values for the slider, and callback function to execute when the parameter is changed by the user


### `dat.GUI` full example
    
<iframe height="505" style="width: 100%;" scrolling="no" title="dyooLgM" src="https://codepen.io/asterix77/embed/dyooLgM?height=505&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/dyooLgM'>dyooLgM</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

When creating a GUI for your own programs, be sure to adjust the scene
bounding box to accommodate the range of values that you allow for your
parameters!

### For more information on `dat.GUI`

  * See the [dat.GUI tutorial](http://workshop.chromeexperiments.com/examples/gui/)
  * See the [dat.GUI github page](https://github.com/dataarts/dat.gui)
  * See the [dat.GUI API documentation](https://github.com/dataarts/dat.gui/blob/master/API.md)


## Placing Objects

  * An object's geometry has a set of vertices, possibly, but not necessarily, including the origin.
  * We can _place_ an object in the scene at a location different from its vertices by using the `.position.set()` method of `Object3D` (a superclass of a `Mesh`).
  * The `.position.set()` method is _very_ similar to canvas' `translate()` function: it moves the origin, but Three.js takes care of saving/restoring for us.

### Placing objects

<iframe height="503" style="width: 100%;" scrolling="no" title="Two-barn using position" src="https://codepen.io/asterix77/embed/ZEGEqJL?height=503&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/ZEGEqJL'>Two-barn using position</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Exercise: Keyboard Controls

To implement a new keyboard control, you need to have

  * one or more global variables, used by the scene modeling code 
  * a callback function that modifies the global variable(s) and then rebuilds and redraws the scene 
  * a binding of the callback function to a key, using `TW.setKeyboardCallback(key,function,docstring)` (call this function after `TW.mainInit()`) 

### Exercise: Adjusting the Height of the Steeple

  1. Start from [this pen](https://codepen.io/asterix77/pen/JjddVqY?editors=1010). The important part is: 

```javascript
    var steepleHeight = 36;   /* global variable to be controlled */
    var steepleWidth = 6;
    var steepleMesh;
    //
    function placeSteeple(steepleHeight,steepleWidth) {
        var half = steepleWidth * 0.5;
        var steepleGeom = createSteeple(steepleWidth,steepleHeight);
        steepleMesh = TW.createMesh(steepleGeom);
        steepleMesh.position.set(barnWidth*0.5,
                                 barnHeight+barnWidth*0.5-half,
                                 -half);
        scene.add(steepleMesh);
    }
```

{:start="2"}
  3. Implement a function to 
     1. remove the current steeple 
     2. increment the height 
     3. create a new steeple and place it on the barn 
     4. redraw the scene 
  4. Add a keyboard callback to your code that allows you to grow the steeple by entering the '+' key. Your result might look like [this pen](https://codepen.io/asterix77/pen/rNVVbgE?editors=1010)
  5. (Optional) add a second keyboard callback to your code that makes the steeple shorter when you enter '-'. 

## Exercise: GUI Controls

To implement a new GUI control, you need to have

  * one or more global object variables that contain parameters to be controlled, with initial values 
  * one or more callback functions that are called when the user modifies one of the parameters, and rebuild and redraw the scene 
  * a new `dat.GUI` object 
  * calls to the `add()` method and `onChange()` event handler that specify a global object variable, parameter, range of values for the slider, and callback function 

### Exercise: Adjusting the Steeple Height with a GUI

  * Modify your code from the previous exercise to _use a GUI control instead of a keyboard control_ , to adjust the height of the steeple
  * Your result might look like [this pen](https://codepen.io/asterix77/pen/VwLLOzM?editors=1010)


## Summary

  * Keyboard controls are straightforward when using the TW library
  * GUI controls are straightforward using the dat.GUI library
  * Placing objects with `.position.set()` makes your life easier
  * The steeple can be adjusted with keyboard controls or GUI controls
  