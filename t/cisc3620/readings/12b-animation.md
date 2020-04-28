---
layout: default
title: Animation, Part 2, Positional techniques
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# Animation, part 2: Positional Techniques

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

A limitation of the derivative approach is that, because time is absent from
the computation, you can't have things start and stop, or change direction.
The derivative approach works very well for continuous, unchanging models like
the bouncing ball and the mass-spring, but not so well for, say, cars that
start, speed up, turn, slow down, and stop. To do that, we need to explicitly
introduce time as a variable.

In general, what we'd love to have is a position function that tells us where
the object is at a particular time. If so, our idle callback could be as
simple as:

    
```javascript    
    function updateState() {
        time += deltaT;
        updateModel(time);
        TW.render();
    }
```

Our hypothetical `updateModel()` function would then use the `Time` variable
as an argument to a function (`position` in the code below) to compute where
everything is supposed to be right now:

    
```javascript
    function updateModel(time) {
       ...
       obj.position.x = position(time);
       ...
    }
```

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

For example, suppose we have an object that we want to move smoothly from
point A to point B. Using the ideas of parametric equations, and using the
`time` variable as the parameter, we can do something like this:

    
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

This idea is captured in the [UFO](../demos/Animation/UFO.html), in
which a UFO drifts across the scene and fires laser bolts (like photon
torpedoes) downwards. The laser bolts are drawn with up to five frames, unless
the laser bolt hits something, in which case successively larger spheres are
drawn, to represent the explosion. Try it! Look at the code.

What if we want to have the object, such as a car, be motionless for a while,
then start moving from A to B, then stop, then do something else, and so on?
For this, we need to start thinking about particular values of the `Time`
variable. If `Time` starts at 0 and increments with each frame, this might
mean we want to have the car start at time 15, move from A to B during time
units 15 to 25, then stop. Our code would look something like:

    
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

Notice the computation of `param`. Remember that as the parameter for our line
goes from 0 to 1, the object moves from A to B. So, we have to map the `Time`
units 15 to 25 onto the time interval [0,1]. This is simply another example of
translation and scaling.

You'll notice that in the example above, the object isn't drawn except when
the time is between 15 and 25. To take care of this problem just requires a
bit more coding.

## Solid Objects

One problem is that objects can pass right through each other: we've always
been able to draw overlapping objects in OpenGL/WebGL. In order to handle
this, your program has to detect collisions (when two objects intersect) and
decide what to do (does the moving one stop, bounce off, and if so where?).
Computing intersections isn't easy. Imagine computing whether two teapots
intersect!

One approximation that can be helpful is to use bounding boxes and bounding
spheres. Consider bounding spheres first. If you imagine that each of your
objects exists inside a bubble of a particular radius, you can compute the
distance between each pair of bubbles, using the Pythagorean Theorem. If the
distance between the bubbles is greater than the combined radii of the
bubbles, the two objects _can't_ intersect. You can then go on to consider
another pair of objects. If the distance isn't greater than the combined
radii, the objects _may_ intersect, and you can, if you want, try to do
additional geometric tests to determine if they do. In some cases, it might be
sufficient to simply use the bounding bubble. Using bounding boxes is similar,
although the geometry isn't quite as easy. For example, if the minimum **x**
of one object is greater than the maximum **x** of the other, they cannot
intersect. Considering the other two dimensions gives you a rough idea of
whether they can intersect. Thus, bounding boxes give you a quick-and-dirty
way to eliminate certain pairs of objects from more exacting geometry tests.

Here's an example:

    
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

You'll notice that we compute the squared distance between the moving object
and the obstacle and compare this with the minimum distance. The reason for
this is that square roots are computationally expensive, compared to squaring
and adding, so avoiding it when possible can be worthwhile.

In this example, the object just stops moving when it hits the obstacle. It
doesn't have any of the effects of real-world collisions, like bouncing off,
crumpling, or whatever. We need a physics engine at some point, to compute the
effects of these collisions. There are many open-source physics engines out
there. Dirksen's book describes one.

## Timers

One thing you may have considered is that if the scene is complex to draw, it
will take more time, and if it's simple to draw, it will take less time. We
request another animation frame as soon as the current frame is drawn, so
simple scenes will run faster than complex scenes. If we want the program to
run at a more predictable rate, the animation frame approach won't work well.
Instead, we can use _timers_ :

For many years, browsers have supported a function called [
`setInterval()`](https://developer.mozilla.org/en-
US/docs/Web/API/WindowTimers.setInterval), which is just the tool we need.

Here's an example:

    
```javascript
    var intervalID = setInterval(redraw, 500); 
```

The `setInterval()` function is similar in many ways to the
`requestAnimationFrame()` function: it takes a function as its input and runs
that function later. In fact, in the example above, it runs the `redraw()`
function every 500 milliseconds (half a second). Using this, your animation
will run at a predictable rate on a wide variety of browsers and graphics
cards. Two caveats:

  * If your function takes longer to run than the interval you chose, the different executions will overlap, which will probably produce a mess. We are using `setInterval()` because we don't want the code to run _too fast_ , so hopefully, the problem of it running too slowly won't occur, but on an underpowered device, it could happen. If you are worried about this, your `redraw()` function could check to see whether the previous execution finished. 
  * If you want the animation to run very fast, you might be tempted to try an interval of only, say, 2 milliseconds, so that it would render 500 times per second. Wow, that would be awesome, wouldn't it?! Alas, most monitors are only going to refresh 60-100 times per second, so at _best_ , you might be able to have an interval of 10 milliseconds, but more likely 16 or 17 ms, which gets you a frame rate of 60 fps (frames per second). 

## Double Buffering

To animate smoothly, we need to use double-buffering. In the old days, this
was not automatic, but nowadays it's pretty much taken care of by the graphics
card and/or the browser. So this section is somewhat theoretical and
historical. All of our Three.js programs have used double-buffering, even
though we didn't know it, but now we'll learn about why they do, and the
effects of not using double-buffering.

Without double-buffering, the display can flicker terribly. What causes the
flickering?

The graphics system is constantly erasing and redrawing the scene. The monitor
is constantly refreshing the screen. (Most modern monitors refresh between
50-100 times per second, so every 10 to 20 milliseconds.) If the screen is
refreshed when the new image is only partly drawn (this includes filling areas
in the framebuffer), you'll see, briefly, that partial image. That's what
causes the flicker.

The solution is to somehow "synchronize" the two so that the monitor never
draws an incomplete image. The way this is done is:

  * the monitor reads out from the "front" buffer, while 
  * the graphics system draws into the "back" buffer, and when it's done, 
  * they swap 

The names "front" and "back" buffer are conventional: the front buffer is the
one that is "on stage" and the back buffer is the one that is being prepared
for the next scene.

Throughout this course, our Three.js programs have executed OpenGL/WebGL code
that does the following:

  * `glutInitDisplayMode( GLUT_DOUBLE, ... )` in the `main()` method, and 
  * `glutSwapBuffers()` at the end of the `display()` method. 

The first tells OpenGL that you want to use double-buffering, so it sets up
two buffers and automatically draws in the "back" buffer. The second says that
the program is done drawing in the back buffer and swaps it with the front
buffer. The combination means that when we do animations or even just move the
viewpoint with the mouse, we don't get any flicker.

**Note:** if you were using double buffering and you forgot to do
`glutSwapBuffers()`, your screen would be blank! Why? Because you would be
drawing in the back buffer and there is nothing in the front buffer.

Perhaps the _only_ reason to ever use single-buffering is when you know you're
only drawing a static scene and you're short on memory on the graphics card,
but this is pretty rare nowadays.

Note that this double-buffering idea is a general notion that is also used in
database I/O and lots of other areas of CS.


### Source

This page is based on <https://cs.wellesley.edu/~cs307/readings/12-animation-b.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

