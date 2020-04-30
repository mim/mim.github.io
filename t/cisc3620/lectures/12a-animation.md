---
layout: reveal
title: Animation
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/12-animation-a.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/13new.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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


## Plan

  * Animation basics and `requestAnimationFrame(func)`
  * Examples
  * Organizing your code
  * Animation techniques and derivative techniques
  * Exercise: moving and spinning cube
  * Exercise: Moving parts

## Animation Basics

  * With animation, we change the scene dynamically
  * So instead of a still scene (even if the user moves the camera), the scene changes over time.
  * Animation of simple motion is fairly straightforward.
    * Instead of producing one frame, we produce several.
  * The way this is usually done in a modern web browser is with

> [ `requestAnimationFrame(func)` ](https://developer.mozilla.org/en-
US/docs/Web/API/window.requestAnimationFrame)

### `requestAnimationFrame(func)`

  * This callback is like the others we've seen, but it is called when the graphics system has nothing better to do
    * When it's _idle_ (and the browser window or tab is exposed)
    * The browser will be smart about not invoking your function when it's unnecessary.
  * To produce an animation, use an idle callback that:
    * adjusts some global variables or other parameters of the graphics program, 
    * re-renders the scene, and 
    * requests another animation frame 
  * Our camera homework could easily be turned into an animation

### `requestAnimationFrame(func)`

  * Invoke the `requestAnimationFrame()` function, and "loop" by 

```javascript
    function next() {
        redoScene();
        TW.render();
        requestAnimationFrame(next);
    }
```

  * It's like recursion!


## Examples

  * Here are some examples from the Dirksen book and otherwise

### [Dirksen materials, light, and animation](http://mr-pc.org/learning-threejs-third/src/chapter-01/js/01-04.js)

<backgroundiframe>http://mr-pc.org/learning-threejs-third/src/chapter-01/04-materials-light-animation.html</backgroundiframe>


### [Dirksen animation with a GUI](http://mr-pc.org/learning-threejs-third/src/chapter-01/js/01-04.js)

<backgroundiframe>http://mr-pc.org/learning-threejs-third/src/chapter-01/05-control-gui.html</backgroundiframe>


### Simple bouncing ball

<iframe height="600" style="width: 100%;" scrolling="no" title="Simple bouncing ball" src="https://codepen.io/asterix77/embed/eYpEKNJ?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/eYpEKNJ'>Simple bouncing ball</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Bouncing ball with controls

<iframe height="600" style="width: 100%;" scrolling="no" title="Bouncing ball with controls" src="https://codepen.io/asterix77/embed/VwvzdLy?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/VwvzdLy'>Bouncing ball with controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### The hard part is modeling the physics


## Organizing your Code

  * Animations can sometimes be hard to debug
    * because the state of variables is changing so quickly
  * In development, set up your code to make it easy to
    * reset the animation to the initial state 
    * advance the animation by one step 
    * start the animation going (continuously "looping") 
    * stop the animation (freezing it at the current state). 
  * As in the bouncing ball with controls demo
  * Let's go through an example

### Spinning cube with controls

<iframe height="600" style="width: 100%;" scrolling="no" title="Spinning cube with controls" src="https://codepen.io/asterix77/embed/oNjeybo?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/oNjeybo'>Spinning cube with controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Animation state

  * We will keep the state of the animation in a JS object.
  * We'll have one property for each value that changes with time, plus, of course, `time` itself.
    
```javascript
    // State variables of the animation
    var animationState;
    //
    // sets the animationState to its initial setting
    function resetAnimationState() {
        animationState = {
            time: 0,
            // rotation angles
            rx: 0,
            ry: 0,
            rz: 0,
            lastParam: null
        };
    }
```

### Resetting the state

  * When we want to reset the animation, we need to:
    * invoke `resetAnimationState()`
    * update objects that depend on it
    * and re-draw the scene.
  * That's what this does:
    
```javascript
    function firstState() {
        resetAnimationState();
        TW.render();
    }
```


### Updating the state

  * To advance the simulation by one step: advance time, set cube's rotations, redraw
    
```javascript
    function updateState() {
        animationState.time += 1;
        // increase the total rotations by the user-specified velocity
        animationState.rx += guiParams.vx;
        animationState.ry += guiParams.vy;
        animationState.rz += guiParams.vz;
        // transfer the state info to the cube
        cube.rotation.x = animationState.rx;
        cube.rotation.y = animationState.ry;
        cube.rotation.z = animationState.rz;
    }        
    function oneStep() {
        updateState();
        TW.render();
    }
```


### Start the animation

  * Now it's easier to understand this code to start the animation
    
```javascript
    // Stored so that we can cancel the animation if we want
    var animationId = null;                
    function animate(timestamp) {
        oneStep();
        animationId = requestAnimationFrame(animate);
        console.log("Starting animation using " + animationId);
    }
```

### Stop the animation

  * `requestAnimationFrame()` (defined by the browser) returns an integer
  * that can be given as an argument to `cancelAnimationFrame()` to cancel the request:
    
```javascript
    function stopAnimation() {
        if( animationId != null ) {
            cancelAnimationFrame(animationId);
        }
    }
```

### Key bindings

  * It's good to bind each of those functions to keys
  * So that we can control the animation from the keyboard, without cluttering the visual interface:
    
```javascript
    TW.setKeyboardCallback("0", firstState, "reset animation");
    TW.setKeyboardCallback("1", oneStep, "advance by one step");
    TW.setKeyboardCallback("g", animate, "go:  start animation");
    TW.setKeyboardCallback(" ", stopAnimation, "stop animation");
```

## Animation Techniques

  * We can break animation techniques down into two broad categories, roughly:
    * derivative: how does the scene change from frame to frame? 
    * positional: where are things supposed to be at a given time?
  * Today we will talk about derivative methods, next time, positional


## Derivative Techniques

  * Often the simplest technique is just to adjust the scene in some straightforward way, ignoring time. 
  * Essentially, all our idle callback computations are based on something like:
    
```javascript
    function updateState() {
        // both of these are globals
        position += velocity;
        updateScene();
        TW.render();
        requestAnimationFrame(updateState);
    }
```

### Velocity

  * We named the variable on the right `velocity` because by definition, velocity is the change in position with time
  * If the velocity is large, there will be a big change in position;
  * if the velocity is small, there will be a small change.
  * Note also that velocity can be either positive or negative, so position can increase or decrease. 


### Time

  * You'll notice that time does not appear in the computation above.
  * Essentially, each frame of our animation is one time step,
  * Which means we can think of the above computation as the following:
    
```javascript
    function updateState() {
        var deltaT = 1;
        position += velocity * deltaT;
        TW.render();
        requestAnimationFrame(updateState);
    }
```

  * Where `deltaT` is our time step, and it has the value 1 by the way we are building the animation.

### Actual Velocity

  * As you may remember from high-school physics, if an object is moving at 10 meters per second, and deltaT is 5 seconds, the object moves 50 meters. 
  * If your model is based on real-world objects with real-world positions and speeds (say, meters and meters per second)
    * you need to understand that each frame of the animation is one time unit (say, one second).


### Smoothness

  * The time unit and speeds are also crucial for determining the _smoothness_ of your animation.
  * If your object jumps by a whole bunch from one frame to the next, the animation may look jerky.
  * To fix this, you'd need to reduce your `deltaT`, say from one second to half a second, or even a tenth of a second.
  * Thus, your computations become:
    
```javascript
    function updateState() {
        var deltaT = 0.1;
        position += velocity * deltaT;
        TW.render();
        requestAnimationFrame(updateState);
    }
```

## Mass-spring example

<iframe height="600" style="width: 100%;" scrolling="no" title="Mass-spring with controls" src="https://codepen.io/asterix77/embed/oNjeyBE?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/oNjeyBE'>Mass-spring with controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Mass-spring example

  * The mass moves due to a force exerted on it by the spring.
  * The spring exerts a force that depends on the amount that the spring is stretched
    * and hence on the position of the mass.
  * The force yields an acceleration that depends on the mass (more mass, less acceleration).
  * Acceleration, of course, results in a changing velocity,
  * And velocity results in changing position.


### Mass-spring main function

  * Thus, at each time step, the idle callback computes:

```javascript
    function updateState() {
        // all of these are globals
        massA = - springK / mass * massX;
        massV += massA * DeltaT;
        massX += massV * DeltaT;
        TW.render();
        requestAnimationFrame(updateState);
    }
```

  * The velocity is sometimes negative and sometimes positive
  * So the mass moves back and forth, oscillating endlessly.
  * We can add friction so it slows down and eventually stops



## Exercise: Moving & Spinning Cube

  * Let's add movement of the spinning cube in the X and Y directions
  * and stop the animation automatically when the cube leaves a surrounding wireframe "cage."
  * Start with [this codepen](https://codepen.io/asterix77/pen/ExVvRXX), which builds on the spinning cube example.
  * The following things have been added to the starting code:
    * two parameters `tx` and `ty` in the GUI, which allow the user to control the movement of the cube between frames, in the X and Y directions 
    * two properties of the `animationState`, `px` and `py`, that store the `x` and `y` position of the cube as the animation progresses 

### Add code to do the following

  * add a wireframe cage around the initial position of the cube, which is larger than the cube 
  * update the position of the cube based on the `tx` and `ty` parameters set by the user in the GUI -- update both the `animationState` and the `cube.position`
  * modify the `animate()` function to capture the logic outlined in the comments in the skeleton below: 
    
```javascript
    function animate(timestamp) {
        oneStep(); 
        // if the cube's position is outside the cage
        //     stopAnimation();
        // otherwise
        //     animationId = requestAnimationFrame(animate);
    }
```

  * Your solution might look like [this pen](https://codepen.io/asterix77/pen/NWGvzvK?editors=1010)


## Exercise: Moving Parts

  * Long ago, we constructed a [jointed leg](https://codepen.io/asterix77/pen/dyovbVK) with nested frames.
  * The code demo allowed us to move individual parts of the leg through the GUI controls.
  * Here we'll animate the leg, enabling each part to rotate through its full range
  * The starting point is [this pen](https://codepen.io/asterix77/pen/LYpjrzQ?editors=1010), which we'll examine in detail.
  * Your goal is to create this [animated leg](https://codepen.io/asterix77/pen/eYpEKeg?editors=1010).


### Details

  * There are three parts of the code to complete, described in comments in the code:
  1. complete the `updateState()` function to update the ankle, knee, and hip rotations, and increment the step (frame) number 
  1. complete the `oneStep()` function to perform one step of the animation 
  1. modify `animate()` to stop the animation when a desired total number of steps of the animation is reached
  * _In what ways does this animation differ from a natural leg swing_, for example, to kick a ball?
  * How might you modify the code to create a more natural leg kick?
  * (This page on [JQuery easing functions](http://easings.net/) that can be integrated into JavaScript programs, may provide some hint.)

### Optional extensions 

  * For 2% course extra credit, implement two of the following:
    * swing the leg back and forth 
    * when the leg reaches its final state, automatically return the leg to the initial state 
    * currently, you can continue the animation after it reaches its final state, eventually sending it into bizarre contortions where the calf moves through the thigh, among other things. Implement a way to prevent this.
    * add a ball on the "ground" that the leg kicks away when the foot reaches the ball 
