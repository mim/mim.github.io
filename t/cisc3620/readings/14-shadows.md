---
layout: default
title: Shadows and anti-aliasing
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---
# Shadows and Anti-aliasing

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

## Why are Shadows Important?

Shadows provide important cues to the depth of objects, scene lighting, and
contact points between surfaces.

{% include figure.html url="images/ballShadow.png" description="Shadow illusion" classes="" %}

{% include figure.html url="images/figaro.png" description="Shadow print" classes="" %}

Shadows add realism to paintings and to scenes rendered with computer
graphics. They were used as a tool in the early evolution of painting
techniques.

{% include figure.html url="images/caravaggio.png" description="Carvaggio painting" classes="" %}

{% include figure.html url="images/paintShadow.png" description="Painting from shadow" classes="" %}

{% include figure.html url="images/shadowsCG.png" description="Shadows CG" classes="" %}

{% include figure.html url="images/architecture.png" description="Architecture" classes="" %}


## Shadow Maps

One common approach to rendering shadows begins with the construction of a
_shadow map_ that captures the points on surfaces in the scene that would be
"visible" from the light source. You can think of the shadow map as a z-buffer
(depth buffer) as seen from the light.

Points that are not visible from the light source should appear in shadow from
the perspective of the camera.

{% include figure.html url="images/shadowMap1.png" description="Shadow map" classes="" %}

{% include figure.html url="images/shadowMap2.png" description="Shadow map" classes="" %}

Some graphical scenes with shadow maps as seen from the light source:

{% include figure.html url="images/luxoShadow1.png" description="Luxo scene" classes="" %}

{% include figure.html url="images/luxoShadow2.png" description="Luxo mom shadow map" classes="" %}

{% include figure.html url="images/shadowMap3.png" description="Shadow map" classes="" %}

Using a shadow map requires a lot of computation, as the renderer must make
two passes through all of the objects to be rendered -- one pass to compute
the shadow map and a second pass to render the final image, checking the
shadow map to see if points are in shadow.

## Adding Shadows with Three.js

Adding shadows to a scene rendered in Three.js involves multiple steps:

  1. The renderer must have the shadow map enabled: 

```javascript
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
```

  2. Each `THREE.Mesh` object that can cast a shadow onto a background surface must have its `castShadow` property set to `true` (it appears that this property doesn't work for the parent `THREE.Object3D` class), for example: 

```javascript
    var ball = new THREE.Mesh(new THREE.SphereGeometry(10),
                              new THREE.MeshBasicMaterial({color: 0xffffff}));
    ball.castShadow = true;
```

  3. Each `THREE.Mesh` object that can have a shadow cast onto it must have its `receiveShadow` property set to `true` (surfaces with Lambert and Phong material can receive shadows): 

```javascript
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100),
                               new THREE.MeshPhongMaterial({color: 0xffffff}));
    plane.receiveShadow = true;
```

  4. Finally, the light source also has a `castShadow` property that must be set to `true`. It appears that in our version of Three.js, only `THREE.PointLight` and `THREE.SpotLight` sources can cast shadows, and rendering is not done properly if there are multiple shadow-casting light sources. 

```javascript
    var light = new THREE.SpotLight();
    light.position.set(10,20,50);
    light.castShadow = true;
```

These ideas are incorporated into the following demonstration of our town
scene with a sun in the sky that casts shadows on the scene:

[town with sun and cast shadows](20-exercises/townGUI.html)


## Anti-Aliasing

_Aliasing_ is the technical term for " jaggies", caused by the imposition of
an arbitrary pixelation (rasterization) over a continuous real world. The
following are some examples of the effects of aliasing in graphics and photos,
borrowed from Fredo Durrant at MIT:

{% include figure.html url="images/alias4.png" description="Aliasing" classes="" %}

{% include figure.html url="images/alias3.png" description="Aliasing" classes="" %}

{% include figure.html url="images/alias2.png" description="Aliasing" classes="" %}

{% include figure.html url="images/alias1.png" description="Aliasing" classes="" %}

The process of reducing the negative effects of aliasing is referred to as
_anti-aliasing_.

Suppose we draw a roughly 2-pixel thick blue line at about a 30 degree angle
to the horizontal:

{% include figure.html url="images/jaggy-line1.png" description="A line at an angle partially covers pixels" classes="" %}


How do we assign colors to the pixels touched by the line? If we only color
the pixels that are entirely covered by the line, we get something like this:

{% include figure.html url="images/jaggy-line2.png" description="Coloring only those pixels that are completely covered by the line makes for a jaggy, thin line." classes="" %}


It doesn't get better if we color the pixels that are covered by _any_ part of
the line:

{% include figure.html url="images/jaggy-line3.png" description="Coloring pixels that are completely covered by any of the line makes for a jaggy, thick line." classes="" %}


What we want is to color the pixels that are _partially_ covered by the line
with a _mixture_ of the line color and the background color, proportional to
the amount that the line covers the pixel.

One way to do this is called "jittering":

  * The scene gets drawn multiple times with slight perturbations ("jittering"), so that 
  * Each pixel is a local average of the images that intersect it. 

Generally speaking, you need to jitter by _less than one pixel_.

Here are two pictures -- the one on the left lacks anti-aliasing and the one
on the right uses anti-aliasing:

{% include figure.html url="images/Aliasing-no-300.png" description="Teapot without anti-aliasing" classes="" %}

{% include figure.html url="images/Aliasing-yes-300.png" description="Teapot with anti-aliasing" classes="" %}


The image on the left lacks anti-aliasing; the image on the right uses anti-aliasing. If you focus closely, the
one on the left has sharper edges with jaggies, but if you relax, the one on
the right looks better.

One problem with anti-aliasing by jittering the objects is that, because of
the mathematics of projection,

  * objects that are too far (from the camera) jitter too little 
  * objects that are too close jitter too much 

A better technique than jittering the objects is to _jitter the camera_ , or
more precisely, to modify the frustum just a little so that the pixels that
images fall on are just slightly different. Again, we jitter by less than one
pixel:

{% include figure.html url="images/anti-alias.png" description="Moving the frustum can do anti-aliasing." classes="" %}

The red and blue cameras differ only by an adjustment to the location of the
frustum. The center of projection (the big black dot) hasn't changed, so all
the rays still project to that point. The projection rays intersect the two
frustums at different pixel values, though, so by averaging these images, we
can anti-alias these projections.

Here's a red teapot, with and without this kind of anti-aliasing, from an
earlier version of this course:

{% include figure.html url="images/Antialiasing.png" description="Red teapot, with (on the left) and without (on the right) the recommended frustum jitter anti-aliasing" classes="" %}


This better approach to anti-aliasing works regardless of how far the object
is from the center of projection, unlike the object-jitter mentioned earlier.

## Anti-Aliasing in Three.js

Modern graphics cards will do a kind of anti-aliasing for you. They typically
do [Multi-Sampling Anti-Aliasing](http://alt.3dcenter.org/artikel/multisampling_anti-aliasing/index_e.php).

Here is a demo of anti-aliasing in Three.js:

[anti-aliasing](../demos/accumulation/anti-aliasing.html)

In Three.js, anti-aliasing is a feature of the _renderer:_

    
```javascript
    var renderer = new THREE.WebGLRenderer( {antialias: true} );
```
