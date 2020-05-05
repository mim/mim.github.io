---
layout: reveal
title: Animation 2, positional techniques
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/12-animation-b.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/14new.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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

  * Positional model
  * Starting and stopping
  * Collision detection
  * UFO walkthrough
  * Exercise: Moving bouncing ball
  * Extra credit: Decaying bouncing


## Positional model

  * The derivative approach works well for continuous, unchanging models
  * But it is hard to model things like a car that starts, speeds up, turns, slows down, and stops.
  * To do that, we it is easier if we explicitly introduce time as a variable
  * We would love to have is a position function that tells us where the object is at a particular time.
  * If so, our idle callback could be as simple as:
    
```javascript    
    function updateState() {
        time += deltaT;
        updateModel(time);
        TW.render();
    }
```

### `updateModel()`

  * Our hypothetical `updateModel()` function would then use the `Time` variable as an argument to a function (`position` in the code below) to compute where everything is supposed to be right now:
    
```javascript
    function updateModel(time) {
       ...
       obj.position.x = position(time);
       ...
    }
```

### More specific example

As a more specific example, consider this:
    
```javascript
    function updateModel(time) {
       ...
       var curr_x = initial_x + velocity_x * time;
       obj.position.x = curr_x;
       ...
    }
```

(Notice that the derivative of the equation for the current position is just
`velocity`, which is what we add to the old position to get the new position.)

### Moving an object

  * Suppose we have an object that we want to move smoothly from point A to point B.
  * Using the ideas of parametric equations, and using the `time` variable as the parameter, we can do something like this:
    
```
    function updateModel(time) {
        var A = new THREE.Vector3(...,...,...);      // start of line
        var B = new THREE.Vector3(...,...,...);      // end of line
        var dir = new THREE.Vector();
        dir.subVectors(B,A);                         // direction is B-A
        var P = new Vector3();
        P.copy(A);
        P.lerp(dir,time);                            // compute P = A + dir*time
        ...
        obj.position.copy(P);                        // set position of obj to P
    }
```


## UFO Demo

<iframe height="600" style="width: 100%;" scrolling="no" title="UFO with controls" src="https://codepen.io/asterix77/embed/zYvpLZZ?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/zYvpLZZ'>UFO with controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## Starting and stopping

  * What if we want to have an object that is motionless for a while
    * then start moving from A to B
    * then stop, then do something else, etc.
  * To do this, we need to think about particular values of `Time`
  * If `Time` starts at 0 and increments with each frame
    * then we might want our car to move from A to B during time units 15 to 25, then stop.

### Starting and stopping car

Our code would look something like:

```javascript
    function updateModel(time) {
        var A = new THREE.Vector3(...,...,...);      // start of line
        var B = new THREE.Vector3(...,...,...);      // end of line
        var dir = new THREE.Vector();
        dir.subVectors(B,A);                         // direction is B-A
        ...
        if ( time >= 15 && time <= 25 ) {
            var param = (time-15)/(25-15);
            var P = new Vector3();
            P.copy(A);
            P.lerp(dir,time);                        // compute P = A + dir*time
            ...
            obj.position.copy(P);                    // set position of obj to P
        }                              
    }
```

### Param

```javascript
        if ( time >= 15 && time <= 25 ) {
            var param = (time-15)/(25-15);
            ...
        }                              
```

  * Notice the computation of `param`.
  * Remember that as the parameter for our line goes from 0 to 1, the object moves from A to B.
  * So, we have to map the `Time` units 15 to 25 onto the time interval [0,1].
  * This is simply another example of translation and scaling.
  * Note that in the example above, the object isn't drawn at all except when time is between 15 and 25.
    * we need a bit more coding to fix that
  * This is a good time to remind you about [JQuery easing functions](http://easings.net/) to create more interesting motions


## All motion: Collision detection

  * One problem in animation is that objects can pass right through each other
  * We've always been able to draw overlapping objects in OpenGL/WebGL.
  * In order to handle this, your program has to detect _collisions_ (when two objects intersect) and
decide what to do (does the moving one stop, bounce off, and if so where?).
  * Computing intersections isn't easy. Imagine computing whether two teapots intersect!

### Bounding spheres

  * If you imagine that each of your objects exists inside a bubble of a particular radius, you can compute the
distance between each pair of bubbles, using the Pythagorean Theorem.
  * If the distance between the bubbles is greater than the combined radii of the
bubbles, the two objects _can't_ intersect.
    * You can then go on to consider another pair of objects.
  * If the distance isn't greater than the combined radii, the objects _may_ intersect, and you can, if you want, try to do additional geometric tests to determine if they do.

{% include figure.html url="img/boundingSpheres.png" description="Bounding spheres (Wildbunny)" classes="stretch"%}


### Bounding boxes

  * Using bounding boxes is similar, although the geometry isn't quite as easy.
  * For example, if the minimum **x** of one object is greater than the maximum **x** of the other, they cannot
intersect.
  * Considering the other two dimensions gives you a rough idea of whether they can intersect.
  * Thus, bounding boxes give you a quick-and-dirty way to eliminate certain pairs of objects from more exacting geometry tests.

{% include figure.html url="https://learnopengl.com/img/in-practice/breakout/collisions_overlap.png" description="Bounding boxes" classes="stretch"%}


### Example:
    
```javascript
    function updateState() {
        // probably move these precomputations someplace where
        // they will only be done once, instead of every frame
        var A = new THREE.Vector3(...,...,...);    // start of line
        var B = new THREE.Vector3(...,...,...);    // end of line
        var obstacle = new THREE.Vector3(...,...,...);
        var object_radius = ?;               // bounding sphere of moving object
        var obstacle_radius = ?;             // bounding sphere of obstacle
        var min_dist = object_radius + obstacle_radius;
        var min_dist2 = min_dist * min_dist       // square of minimum distance
        var dir = ...;                            // direction of motion
        if( time >= 15 && time <= 25 ) {
            var param = (time-15)/(25-15);
            var P = new Vector3();
            P.copy(A);
            P.lerp(dir,time);                     // compute P = A + dir*time
            ...
            if( P.distanceToSquared(obstacle) < min_dist2 )
                 return;                          // stop instantly                                             
            obj.position.copy(P);                 // set position of obj to P
        }                              
```

### Example notes

  * Note we compute the squared distance between the moving object and the obstacle
    * and compare this with the minimum distance.
  * The reason for this is that square roots are computationally expensive, compared to squaring and adding,
    * so avoiding it when possible can be worthwhile.
  * In this example, the object just stops when it hits the obstacle.
  * In the real world, it would bounce, crumple, etc.
  * A library to compute these interactions is part of a _physics engine_
    * Many open-source, Dirksen's book describes one

## Timers

  * If we want to set a specific update speed, not just as fast as possible
  * We can use a timer via the browser function  [`setInterval()`](https://developer.mozilla.org/en-
US/docs/Web/API/WindowTimers.setInterval)
  * For example, if we have a complicated scene to draw, we can draw it less often than 1/60th of a second


### Timer example

  * Here's an example that calls the `redraw()` function every 500 milliseconds (half a second):
    
```javascript
    var intervalID = setInterval(redraw, 500); 
```

  * But if your function takes longer to run than the interval you chose, the different executions will overlap, which will probably produce a mess. 
  * For drawing, the maximum speed is the _refresh rate_ of your monitor
    * 10 ms for 100 frames per second
    * 16.7 ms for 60 frames per second



## UFO walkthrough

<iframe height="600" style="width: 100%;" scrolling="no" title="UFO with controls" src="https://codepen.io/asterix77/embed/zYvpLZZ?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/zYvpLZZ'>UFO with controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### UFO example

  * The UFO is firing random photon torpedoes at the ground
  * It moves over the scene along a vector, and changes speed and direction at a later time. 
  * Photon torpedoes shoot in random directions, but take several frames to move (and then explode - TBD). 
  * There are still some glitches in this code, but it incorporates some useful coding techniques


### Changing speed and direction of the UFO in the `updateState()` function 

```javascript
    var dt = guiParams.deltaT;
    animationState.time += dt;
    // change velocity after this time
    if( animationState.time > guiParams.later ) {
        // actually sets them multiple times, but no harm
        animationState.vx = guiParams.laterVx;
        animationState.vz = guiParams.laterVz;
    }
```

### Recording the direction and start point of the photon torpedo gun, and updating a geometry 

```javascript
    var gun;       // just a THREE.Line object with two vertices
    // changes "to" vertex of the line,
    // defining direction of aim of the gun
    function aimGun (gun, dx, dz) {
        var geom = gun.geometry;
        var v1 = geom.vertices[1];
        v1.set(dx, -guiParams.gunLength, dz);
        geom.verticesNeedUpdate = true;
    }
    ...
    var torpedoDir = new THREE.Vector3(0, -guiParams.gunLength, 0);
    torpedoDir.x = TW.randomBell(0, guiParams.gunLength);
    torpedoDir.z = TW.randomBell(0, guiParams.gunLength);
    // update where the gun is aiming
    aimGun(gun, torpedoDir.x, torpedoDir.z);
```    

### Computing the current location of the photon torpedo in the `updateState()` function 

```javascript
    // draw a photon torpedo in the scene at Q = P + V * t
    animationState.photonSequence++;
    var P = animationState.torpedoStart;
    // absolute time
    var sinceStart = time - animationState.torpedoStartTime;
    var Q = new THREE.Vector3();
    var V = new THREE.Vector3();
    V.copy(animationState.torpedoDir);
    V.normalize();
    V.multiplyScalar(guiParams.torpedoVelocity * sinceStart);
    Q.addVectors(P,V);
    photonTorpedo.position.copy(Q);
    photonTorpedo.visible = true;
```

### Drawing a line 

```javascript
    function line (from, to, color) {
        var geom = new THREE.Geometry();
        geom.vertices = [ from, to ];
        var mat = new THREE.LineBasicMaterial( { color: color,
                                                 linewidth: 2 } );
        var lineObj = new THREE.Line(geom, mat);
        return lineObj;
    }
    ...
    gun = line(new THREE.Vector3(0,0,0),
               new THREE.Vector3(0, -guiParams.gunLength, 0),
               THREE.ColorKeywords.purple);
    ufoObj = new THREE.Object3D();
    ufoObj.add(ufo);
    ufoObj.add(gun);
```

### Generating a random number with desired properties. 

```javascript
    TW.randomBell = function (center, range) {
        // sample from an approximately bell-shaped distribution
        var i, sum = 0;
        for ( i = 0 ; i < range; i++ ) {
            sum += 2*Math.random()-1;
        }
        return center + sum;
    };
```

### Programmatically stopping an animation 

```javascript
    if ( animationState.x < -halfSize || animationState.x > +halfSize ||
         animationState.z < -halfSize || animationState.z > +halfSize ) {
       console.log("Stop because out of bounds");
       stopAnimation();
    }
```

### Other things to ponder:

  * We should probably represent a UFO as an object, and store its state variables in itself, instead of in the `animationState`. Partitioning the state information makes a lot of sense as the complexity and number of simultaneous animations increases. 
  * Think about the calculations necessary to detect the collision of a photon torpedo with something else in the scene (whereupon, we will animate an explosion). 
  * How do you have items (e.g. photon torpedoes) that bounce off walls and such, Pong-like? 



## Bouncing Ball (again)

<iframe height="600" style="width: 100%;" scrolling="no" title="Bouncing ball with controls" src="https://codepen.io/asterix77/embed/VwvzdLy?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/VwvzdLy'>Bouncing ball with controls</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Bouncing ball

  * The motion of the bouncing ball follows the absolute value of a cosine curve
  * which we can visualize with the help of [WolframAlpha](http://www.wolframalpha.com)
    * [plot cos(t) from t=0 to 10](https://www.wolframalpha.com/input/?i=plot+cos%28t%29+from+t%3D0+to+10)
    * [plot abs(cos(t)) from 0 to 10](https://www.wolframalpha.com/input/?i=plot+abs%28cos%28t%29%29+from+t%3D0+to+10)

### Task 1: Time period

  * Suppose we want the time period for each bounce to be some desired amount P.
  * How can we use the cosine curve to determine the height of the ball at a particular moment in time?
  * Here, we want to map
    * an input in units of "time" that goes from 0 to P between bounces, to 
    * an output in units of "angle" that goes from 0 to π between peaks of the cosine function. 

### Time period hint 1

  1. scale time to [0,1] by dividing by P 
  2. then scale the result to [0,π] by multiplying by π 

### Time period solution

```javascript
var cosArg = t * n / P
```

### Task 2: Height

Next, how can we make the bounces have an arbitrary height, and not go through the floor?

  1. The cos() function has a maximum value of 1, which we can multiply by the desired peak height. 
  2. The minimum value of abs(cos()) is zero, which we can adjust by the ball radius so that it doesn't go through the floor. 


### Height solution

Here is the important part of the code that determines the ball's position:

    
```javascript
    // transforms x in the range [minx,maxx] to y in the range [miny,maxy]
    function linearMap (x, minx, maxx, miny, maxy) {
        // t is in the range [0,1]
        t = (x-minx)/(maxx-minx);
        y = t*(maxy-miny)+miny;
        return y;
    };
    
    // sets the position of the ball based on current time
    function setBallPosition (time) {
        // rescale the time dimension so that the period of bouncing maps to pi
        var angle = time * Math.PI / guiParams.ballBouncePeriod; 
        var abs_cos = Math.abs(Math.cos(angle));
        var ballHeight = linearMap(abs_cos, 0, 1, 
                                   guiParams.ballRadius,
                                   guiParams.maxBallHeight);
        ball.position.y = ballHeight;
        return ballHeight;
    }
```

## Exercise: Moving Bouncing Ball

  * Start with the [bouncing ball codepen]()
  * We would like to make the ball move smoothly in x as it bounces
  * Modify the code to set `ball.position.x` to do this
  * Your solution might look like [moving bouncing ball](https://codepen.io/asterix77/pen/KKdZxEo?editors=0010)


## Extra credit: Decaying Bouncing

  * In the real world, balls don't bounce forever, they come to a stop. How?
  * Typically, the height of each bounce is a bit smaller than the one before
    * but it's not _linear_ , the height of each bounce is some _fraction_ of the one before.
  * Suppose it's a really good ball and each bounce is 90 percent of the previous bounce

```javascript
    bounce_height(i+1) = 0.9 * bounce_height(i)
```
  * We can again use WolframAlpha to help us visualize the decreasing height of the bounces:
    * [plot 0.9^t from t=0 to 10](https://www.wolframalpha.com/input/?i=plot+0.9%5Et+from+t%3D0+to+10)
    * [plot 0.9^t abs(cos(t)) from t=0 to 10](https://www.wolframalpha.com/input/?i=plot+0.9%5Et+abs%28cos%28t%29%29+from+t%3D0+to+10)

### Extra credit

  * Implement the decaying bouncing ball where the `setBallPosition()` function uses an additional parameter,
`ballBounceFactor`
  * `ballBounceFactor` is what is raised to the `time`th power, e.g., 0.9 above
  * Add a GUI element to control `ballBounceFactor`
