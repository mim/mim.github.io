---
layout: default
title: Animation, Part 1
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---
# Animation, Part 1

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

# Notes on Animation

With animation, we change the scene dynamically, so instead of a still scene
(even if the user moves the camera), the scene changes over time.

## Animation Basics

Animation of simple motion is fairly straightforward. Instead of producing one
frame, we produce several. The way this is usually done in a modern web
browser is with

> [ `requestAnimationFrame(func)` ](https://developer.mozilla.org/en-
US/docs/Web/API/window.requestAnimationFrame)

(This feature is fairly new; older browsers may not support it.)

This function asks the browser "when you have time, please invoke this
function". This is a kind of _idle callback_. This is similar to other
callbacks: we register it and the browser calls it. This callback, however, is
called when the graphics system has nothing better to do  -- it's _idle_ (and
the browser window or tab is exposed, and so forth)  -- the browser will be
smart about not invoking your function when it's unnecessary.

If the idle callback does the following:

  * adjusts some global variables or other parameters of the graphics program, 
  * re-renders the scene, and 
  * requests another animation frame 

then the effect will be to continually adjust the variables and redisplay your
scene, thereby producing an animation. If you think back to the _camera_
homework, that program adjusted the camera parameters and redrew the scene;
that could easily be turned into an animation.

Examples:

Dirksen's examples from Chapter 1:

  * [Dirksen materials, light, and animation](http://mr-pc.org/learning-threejs-third/src/chapter-01/04-materials-light-animation.html)
  * [Dirksen animation with a GUI](http://mr-pc.org/learning-threejs-third/src/chapter-01/05-control-gui.html) 

Bouncing Ball:

  * [simple bouncing ball](../demos/Animation/bouncingBall0.html)
  * [bouncing ball with controls](../demos/Animation/bouncingBall-controls.html) 

But you didn't think it was that easy, did you? It's not. The hard part is
always in modeling the physics of the situation. We'll look at some hard cases
later.

## Organizing your Code

Animations can sometimes be hard to debug, because the state of variables is
changing so quickly, often 60 times per second. Consequently, I strongly
suggest setting up your code to make it easy to

  * reset the animation to the initial state 
  * advance the animation by one step 
  * start the animation going (continuously "looping") 
  * stop the animation (freezing it at the current state). 

We can see all of these in the following demo:

[bouncing ball with controls](../demos/Animation/bouncingBall-controls.html)

But before we take on the bouncing ball, let's look at a demo that is a lot
easier:

[spinning cube with controls](../demos/Animation/spinningCube.html)

Here's the complete code. Read over it a bit, figuring out what you can, then
we'll pick it apart one piece at a time.

```javascript
// Parameters of the scene and animation:
var guiParams = {
    vx: 0.01,
    vy: 0.02,
    vz: 0.04,
    lastparam: null
};
 
// State variables of the animation
var animationState;
 
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
 
resetAnimationState();
 
var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
TW.mainInit(renderer,scene);
TW.cameraSetup(renderer,
               scene, 
               {minx: -5, maxx: 5,
                miny: -5, maxy: 5,
                minz: -5, maxz: 5});
 
// needs to be a global so we can update its position
var cube;
 
function makeScene() {
    scene.remove(cube);
    cube = new THREE.Mesh(new THREE.CubeGeometry(2,2,2),
                          new THREE.MeshNormalMaterial());
    scene.add(cube);
}
makeScene();
                
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
 
function firstState() {
    resetAnimationState();
    TW.render();
}
 
                
function oneStep() {
    updateState();
    TW.render();
}
    
// Stored so that we can cancel the animation if we want
var animationId = null;                
 
function animate(timestamp) {
    oneStep();
    animationId = requestAnimationFrame(animate);
}
 
function stopAnimation() {
    if( animationId != null ) {
        cancelAnimationFrame(animationId);
        console.log("Cancelled animation using "+animationId);
    }
}
 
TW.setKeyboardCallback("0",firstState,"reset animation");
TW.setKeyboardCallback("1",oneStep,"advance by one step");
TW.setKeyboardCallback("g",animate,"go:  start animation");
TW.setKeyboardCallback(" ",stopAnimation,"stop animation");
 
var gui = new dat.GUI();
gui.add(guiParams,"vx",0,0.5);
gui.add(guiParams,"vy",0,0.5);
gui.add(guiParams,"vz",0,0.5);
```
    
      

We see several functions here. The first is resetting the state of the
animation to the initial state. We will keep the collection of values that
comprises the state of the animation in a JS object. Here it doesn't have a
lot in it, but for more complicated animations, it would have a lot more.
We'll have one property for each value that changes with time, plus, of
course, `time` itself.

    
```javascript
    // State variables of the animation
    var animationState;
    
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

When we want to reset the animation, we need to invoke this function, update
objects that depend on it, and re-draw the scene. That's what this does:

    
```javascript
    function firstState() {
        resetAnimationState();
        TW.render();
    }
```

Next, we need to look at how to advance the simulation by one step. We'll
advance time, set the cube's rotation around all the axes, and redraw. Note,
below, that we've separated the updating from the rendering.

    
    
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

Next, let's look at how to start the animation. Given the building blocks
above, this code probably doesn't have too many surprises:

    
    
```javascript
    // Stored so that we can cancel the animation if we want
    var animationId = null;                
    
    function animate(timestamp) {
        oneStep();
        animationId = requestAnimationFrame(animate);
        console.log("Starting animation using " + animationId);
    }
```

Finally, we need to be able to stop the animation. The
`requestAnimationFrame()` function (defined by the browser, not by Three.js or
even by WebGL; you can use it with 2D canvas drawing) returns an integer that
is meaningless by itself, but can be given as an argument to
`cancelAnimationFrame()` to cancel the request:

    
```javascript
    function stopAnimation() {
        if( animationId != null ) {
            cancelAnimationFrame(animationId);
        }
    }
```

It's good to bind each of these to keys, so that we can control the animation
from the keyboard, without cluttering the visual interface:

    
```javascript
    TW.setKeyboardCallback("0", firstState, "reset animation");
    TW.setKeyboardCallback("1", oneStep, "advance by one step");
    TW.setKeyboardCallback("g", animate, "go:  start animation");
    TW.setKeyboardCallback(" ", stopAnimation, "stop animation");
```

## Animation Techniques

We can break animation techniques down into two broad categories, roughly:

  * derivative: how does the scene change from frame to frame? 
  * positional: where are things supposed to be at a given time? 

(Drawing on a concept from calculus, you can see that the first technique gets
its name because it is the derivative of the position function.) The rest of
this reading describes derivative techniques; the next reading will describe
positional techniques.

## Derivative Techniques

Often the simplest technique is just to adjust the scene in some
straightforward way, ignoring time. That's what we did with the spinning cube.

Essentially, all our idle callback computations are based on something like:

    
```javascript
    function updateState() {
        // both of these are globals
        position += velocity;
        updateScene();
        TW.render();
        requestAnimationFrame(updateState);
    }
```

We named the variable on the right `velocity` because by definition, velocity
is the change in position. If the velocity is large, there will be a big
change in position; if the velocity is small, there will be a small change.
Note also that velocity can be either positive or negative, so position can
increase or decrease. (In practice, these variables would probably live in an
object, as we did earlier, but we've omitted those details here.)

You'll notice that time does not appear in the computation above. Essentially,
each frame of our animation is one time step, which means we can think of the
above computation as the following:

    
```javascript
    function updateState() {
        var deltaT = 1;
        position += velocity * deltaT;
        TW.render();
        requestAnimationFrame(updateState);
    }
```

where `deltaT` is our time step, and it has the value 1 by the way we are
building the animation. As you probably remember from high-school physics, if
an object is moving at 10 meters per second, and deltaT is 5 seconds, the
object moves 50 meters. That's exactly what we're doing above.

If your model is based on real-world objects with real-world positions and
speeds (say, meters and meters per second), you need to understand that each
frame of the animation is one time unit (say, one second).

The time unit and speeds are also crucial for determining the _smoothness_ of
your animation. If your object jumps by a whole bunch from one frame to the
next, the animation may look jerky. To fix this, you'd need to reduce your
`deltaT`, say from one second to half a second, or even a tenth of a second.
Thus, your computations become:

    
```javascript
    function updateState() {
        var deltaT = 0.1;
        position += velocity * deltaT;
        TW.render();
        requestAnimationFrame(updateState);
    }
```

For a slightly more complex motion, still based on the derivative approach,
consider the [mass spring](../demos/Animation/mass-spring.html) demo.
This is a classic example from physics, where the mass moves due to a force
exerted on it by the spring. The spring exerts a force that depends on the
amount that the spring is stretched and hence on the position of the mass. The
force yields an acceleration that depends on the mass (more mass, less
acceleration). Acceleration, of course, results in a changing velocity, and
velocity results in changing position. Thus, at each time step, the idle
callback computes:

    
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

The nature of this particular model is such that the velocity is sometimes
negative and sometimes positive, so the mass moves back and forth, oscillating
endlessly.

There are variant mass-spring models with damping (friction) that slows the
mass down based on its velocity. A google search for "mass-spring" yields many
results, so feel free to investigate if you like.


### Source

This page is based on <https://cs.wellesley.edu/~cs307/readings/12-animation-a.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

