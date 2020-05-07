---
layout: reveal
title: Shadows and anti-aliasing
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/20new.html) which are copyright &copy; Ellen C. Hildreth and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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

  * Shadow examples
  * Shadow maps
  * Shadows in Three.js
  * Exercise: Town with shadows
  * Anti-aliasing examples
  * Anti-aliased line
  * Anti-aliasing with jitter
  * Anti-aliasing in Three.js

## Why are Shadows Important?

 - Shadows provide important cues to the depth of objects, scene lighting, and contact points between surfaces.
 - Shadows add realism to paintings and to scenes rendered with computer graphics. 

### Depth, lighting, contact

{% include figure.html url="../readings/images/ballShadow.png" description="Shadow illusion" classes="stretch" %}


### Depth, lighting, contact

{% include figure.html url="../readings/images/figaro.png" description="Shadow print" classes="stretch" %}


### Realism in painting

{% include figure.html url="../readings/images/caravaggio.png" description="Carvaggio painting" classes="stretch" %}


### Realism in painting

{% include figure.html url="../readings/images/paintShadow.png" description="Painting from shadow" classes="stretch" %}


### Realism in CG

{% include figure.html url="../readings/images/shadowsCG.png" description="Shadows CG" classes="stretch" %}


### Realism in CG

{% include figure.html url="../readings/images/architecture.png" description="Architecture" classes="stretch" %}


## Shadow Maps

  * One common approach to rendering shadows uses a _shadow map_ that captures the points on surfaces in the scene that would be "visible" from the light source.

{% include figure.html url="../readings/images/shadowMap2.png" description="Shadow map" classes="stretch" %}


### Shadow maps

  * You can think of the shadow map as a z-buffer (depth buffer) as seen from the light.
  * Points that are not visible from the light source should appear in shadow from the perspective of the camera.

{% include figure.html url="../readings/images/shadowMap1.png" description="Shadow map" classes="stretch" %}


### Shadow map example

![](../readings/images/luxoShadow1.png) | ![](../readings/images/luxoShadow2.png)
Scene | Shadow map from luxo mom


### Shadow map example

{% include figure.html url="../readings/images/shadowMap3.png" description="Shadow map" classes="stretch" %}


### Shadow map cost

  * Using a shadow map requires a lot of computation
  * The renderer must make several passes through all of the objects to be rendered
    - one pass for each light to compute the shadow map
    - and a second pass to render the final image, checking the shadow map to see if points are in shadow.

## Adding Shadows with Three.js

Adding shadows to a scene rendered in Three.js involves multiple steps:

  1. The renderer must have the shadow map enabled
  2. Each `THREE.Mesh` object that can cast a shadow onto a background surface must have its `castShadow` property set to `true`
  3. Each `THREE.Mesh` object that can have a shadow cast onto it must have its `receiveShadow` property set to `true`
  4. Finally, the light source also has a `castShadow` property that must be set to `true`. 


### Enable rendered shadow map

```javascript
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
```

### Enable `Mesh` shadow casting

Each `THREE.Mesh` object that can cast a shadow onto a background surface must have its `castShadow` property set to `true` (it appears that this property doesn't work for the parent `THREE.Object3D` class), for example: 

```javascript
    var ball = new THREE.Mesh(new THREE.SphereGeometry(10),
                              new THREE.MeshBasicMaterial({color: 0xffffff}));
    ball.castShadow = true;
```

### Enable `Mesh` shadow receiving

Each `THREE.Mesh` object that can have a shadow cast onto it must have its `receiveShadow` property set to `true` (surfaces with Lambert and Phong material can receive shadows): 

```javascript
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100,100),
                               new THREE.MeshPhongMaterial({color: 0xffffff}));
    plane.receiveShadow = true;
```


### Enable light `castShadow`

Finally, the light source also has a `castShadow` property that must be set to `true`. It appears that in our version of Three.js, only `THREE.PointLight` and `THREE.SpotLight` sources can cast shadows, and rendering is not done properly if there are multiple shadow-casting light sources. 

```javascript
    var light = new THREE.SpotLight();
    light.position.set(10,20,50);
    light.castShadow = true;
```


## Exercise: Town with shadows

  * Start from [this codepen](https://codepen.io/asterix77/pen/eYpVKJQ?editors=1010) of a town with a sun, but no shadows
  * Follow steps 1-4 above to add shadows to it (see TODOs in comments)
  * Your final codepen might look like [this](https://codepen.io/asterix77/pen/MWaQXKB)


## Anti-Aliasing

  * _Aliasing_ is the technical term for " jaggies"
  * caused by the imposition of an arbitrary pixelation (rasterization) over a continuous real world.
  * The process of reducing the negative effects of aliasing is referred to as _anti-aliasing_.
  * The following are some examples of the effects of aliasing in graphics and photos, borrowed from Fredo Durand at MIT

### Aliasing example

{% include figure.html url="../readings/images/alias4.png" description="Aliasing" classes="stretch" %}

### Aliasing example

{% include figure.html url="../readings/images/alias3.png" description="Aliasing" classes="stretch" %}

### Aliasing example

{% include figure.html url="../readings/images/alias2.png" description="Aliasing" classes="stretch" %}

### Aliasing example

{% include figure.html url="../readings/images/alias1.png" description="Aliasing" classes="stretch" %}

## Anti-aliased line

  * Suppose we draw a roughly 2-pixel thick blue line at about a 30 degree angle to the horizontal:

{% include figure.html url="../readings/images/jaggy-line1.png" description="A line at an angle partially covers pixels" classes="stretch" %}

  * How do we assign colors to the pixels touched by the line?


### Only color entirely-covered pixels

  * If we only color the pixels that are entirely covered by the line, we get something like this:

{% include figure.html url="../readings/images/jaggy-line2.png" description="Coloring only those pixels that are completely covered by the line makes for a jaggy, thin line." classes="stretch" %}


### Color at-all covered pixels

  * Similar problem if we color the pixels that are covered by _any_ part of the line:

{% include figure.html url="../readings/images/jaggy-line3.png" description="Coloring pixels that are completely covered by any of the line makes for a jaggy, thick line." classes="stretch" %}


### Good solution

  * What we want is to color the pixels that are _partially_ covered by the line with a _mixture_ of the line color and the background color
  * proportional to the amount that the line covers the pixel.
  * One way to do this is called "jittering":
    * The scene gets drawn multiple times with slight perturbations ("jittering"), so that 
    * Each pixel is a local average of the images that intersect it. 
  * Generally speaking, you need to jitter by _less than one pixel_.

## Anti-aliasing example

Here are two pictures -- the one on the left lacks anti-aliasing and the one
on the right uses anti-aliasing:

![](../readings/images/Aliasing-no-300.png) | ![](../readings/images/Aliasing-yes-300.png)
Not anti-aliased | Anti-aliased

### What to jitter?

  * One problem with anti-aliasing by jittering the objects is that, because of the mathematics of projection,
    * objects that are too far (from the camera) jitter too little 
    * objects that are too close jitter too much 
  * A better technique than jittering the objects is to _jitter the camera_,
    * i.e., to modify the frustum just a little so that the pixels that images fall on are just slightly different.

### Frustum jitter

  * The red and blue cameras differ only by an adjustment to the location of the frustum.
  * The center of projection (the big black dot) hasn't changed
  * So all the rays still project to that point.
  * The projection rays intersect the two frustums at different pixel values, though,
  * So by averaging these images, we can anti-alias these projections.

{% include figure.html url="../readings/images/anti-alias.png" description="Moving the frustum can do anti-aliasing." classes="stretch" %}

### Frustum jitter

  * Here's a red teapot, with and without this kind of anti-aliasing
  * This better approach to anti-aliasing works regardless of how far the object is from the center of projection, unlike the object-jitter mentioned earlier.

{% include figure.html url="../readings/images/Antialiasing.png" description="Red teapot, with (on the left) and without (on the right) the recommended frustum jitter anti-aliasing" classes="stretch" %}

## Anti-Aliasing in Three.js

  * Modern graphics cards will do a kind of anti-aliasing for you.
  * They typically do [Multi-Sampling Anti-Aliasing](http://alt.3dcenter.org/artikel/multisampling_anti-aliasing/index_e.php).
  * In Three.js, anti-aliasing is a feature of the _renderer:_    

```javascript
    var renderer = new THREE.WebGLRenderer( {antialias: true} );
```

  * Here is our [town with shadows scene with anti-aliasing](https://codepen.io/asterix77/pen/BaoYVYJ?editors=1010)
