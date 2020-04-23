---
layout: reveal
title: Texture mapping 3
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/10-texture-mapping-b.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/11new.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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


## Plan: Texture mapping 3

  * Texture, surface color, and lights 
  * Nearest & linear filters 
  * Mapping textures onto curved 3D surfaces 
  * Exercise: Decorate a cake 
  * Exercise: Build a globe 
  * Advanced techniques: bump, normal, and environment maps 

## Texture, Surface Color, and Lights

Texture mapping adds a pattern of varying lightness or color to a surface.

  * What if the surface itself also has a color with hue? 
  * How does surface texture mapping interact with light sources in the scene? 

The texture is _multiplied_ by the color of the surface. For a single surface
location:

  * let (RP, GP, BP) refer to the RGB color specified for the Phong material 
  * let (RT, GT, BT) refer to the RGB color of the _texture_ at this location 
  * the resulting color is then given by (R P x RT, GP x GT, BP x BT) 

In the pyramid scene, the RGB values for the texture range from 0 to 255, and
we think of the RGB values for the surface color as ranging from 0 to 1, so
multiplication of the texture color by the surface color yields _smaller
values for RGB_, corresponding to _darker surfaces_.

_If any of the R, G, or B values are 0_ then the surface will not reflect any
of that color component, so the corresponding color component in the image
will be 0!

We can always "brighten up" surfaces in the scene by increasing the intensity
of the light sources!

In the following demo, some red is added to the pyramid texture, yielding the
color pattern shown on the plane in the upper right. The pyramid surfaces use
Phong material with three different surface colors that have the effect of
"toning down" the red, green, or blue components, respectively.

[texture-mapped pyramid with surface color and lighting](12-exercises/pyramid-light-v2.html)

The above example uses white ambient light. Suppose we change the ambient
light to have a strong blue component?

[texture-mapped pyramid with blue-dominated ambient
light](12-exercises/pyramid-light-v3.html)

## Nearest and Linear Filters

When mapping texture onto a triangular face during the rendering process,
Three.js:

  1. first determines which texture coordinates to use for each pixel touched by the triangular face 
  2. then determines which texture color to use for each pixel, based on the texels around the computed texture coordinates 

Pixels in the triangular face could be _larger_ or _smaller_ than the
corresponding texels:

![texture filters](textFilters.png)

I found this [picture](http://what-when-how.com/opengl-programming-guide/filtering-texture-mapping-opengl-programming/) helpful as well.

The `minFilter` property of a `THREE.Texture` object controls how the texture
color is determined for the scenario on the left, and the `magFilter` property
specifies what to do for the scenario on the right. Two common options for
both are `THREE.NearestFilter` (select the color of the nearest texel) and
`THREE.LinearFilter` (linearly interpolate between the colors of the four
nearest texels).

Summary:

  * magnification: 1 texel &Rarr; many pixels; 1 pixel &Rarr; part of a texel. Should the pixels all be uniform (nearest) or gradually transition to the next texel (linear)
  * minification: 1 pixel &Rarr; many texels. Should the pixel color be drawn from one texel (nearest) or smoothly interpolate (linear)

[texture-mapped pyramid with choice of linear/nearest interpolation of texture
color](12-exercises/pyramid-light-choice.html)

In practice, `minFilter` rarely matters.

## Advanced Methods

In his book on Three.js, Jos Dirksen presents some fun demonstrations of
texture mapping. We'll explore some of these in class:

[Dirksen Chapter 10 demos](../threejs/dirksen/chapter-10)

Other demos can be found at the [Three.js
website](https://threejs.org/examples/)

## Bump Maps

Consider this example of the use of a _bump map:_ [02-bump-
map.html](../threejs/dirksen/chapter-10/02-bump-map.html)

A [bump map](https://en.wikipedia.org/wiki/Bump_mapping) enables us to
simulate bumps and wrinkles on an object surface. Traditionally, bump maps
have been incorporated as follows:

  1. the bump map is used to _perturb the normal vector_ at each calculated point 
  2. the perturbed normal vectors are used during lighting calculations (e.g. application of the Phong model) 

The underlying surface geometry is not changed in this case.

In Three.js, the bump map is a grayscale image, and the intensity values in
this image are first used to _displace_ each surface point slightly. The
modified surface points are then used to calculate the normal vectors for the
lighting calculations.

Here's the stone texture and bump map:
![](../threejs/dirksen/assets/textures/general/stone.jpg) |
![](../threejs/dirksen/assets/textures/general/stone-bump.jpg)  
---|---  
Stone texture | Stone bump map  
  
Here's the code:

    
    
    var sphere2 = createMesh(new THREE.CubeGeometry(15, 15, 2),
                             "stone.jpg", "stone-bump.jpg");
    

The material includes a bump map:

    
    
    function createMesh(geom, imageFile, bump) {
        var texture = THREE.ImageUtils.loadTexture("../assets/textures/general/" + imageFile)
        geom.computeVertexNormals();
        var mat = new THREE.MeshPhongMaterial();
        mat.map = texture;
    
        if (bump) {
            var bump = THREE.ImageUtils.loadTexture("../assets/textures/general/" + bump)
            mat.bumpMap = bump;
            mat.bumpScale = 0.2;
            console.log('d');
        }
    
        var mesh = new THREE.Mesh(geom, mat);
        return mesh;
    }
    

## Normal Maps

Consider this example of the use of a _normal map:_ [03-normal-
map.html](../threejs/dirksen/chapter-10/03-normal-map.html)

The normal map directly specifies the normal vector to use for the lighting
calculations (e.g. in the Phong model) at each location. It can be stored as
an RGB image, where the three values at each location represent the `(X,Y,Z)`
coordinates of the surface normal.

Here are the plaster maps:
![](../threejs/dirksen/assets/textures/general/plaster.jpg) |
![](../threejs/dirksen/assets/textures/general/plaster-normal.jpg)  
---|---  
Plaster texture | Plaster normal map  
  
Here's the code:

    
    
    var sphere2 = createMesh(new THREE.CubeGeometry(15, 15, 15),
                             "plaster.jpg", "plaster-normal.jpg");
    

The material includes a normal map:

    
    
    function createMesh(geom, imageFile, normal) {
    
        if (normal) {
            var t = THREE.ImageUtils.loadTexture("../assets/textures/general/" + imageFile);
            var m = THREE.ImageUtils.loadTexture("../assets/textures/general/" + normal);
            var mat2 = new THREE.MeshPhongMaterial({
                map: t,
                normalMap: m
            });
            var mesh = new THREE.Mesh(geom, mat2);
            return mesh;
        } else { ... }
    
        return mesh;
    }
    

## Environment Maps

Consider this example of the use of an _environment map:_ [05-env-map-
static.html](../threejs/dirksen/chapter-10/05-env-map-static.html)

Calculating real reflections of a surrounding environment from a shiny surface
is very CPU-intensive, usually requiring ray tracing. Environment maps enable
us to _fake the creation of these reflections_ with far less computation.

To incorporate an environment map, a "CubeMap" object is first created from
six images that represent the scenes that would be viewed in six cardinal
directions from a central origin.

For the above Dirksen demo, these are the six images, with names indicating
the associated axis and direction of view:

posx: ![](../threejs/dirksen/assets/textures/cubemap/parliament/posx.jpg)
negx: ![](../threejs/dirksen/assets/textures/cubemap/parliament/negx.jpg)

posy: ![](../threejs/dirksen/assets/textures/cubemap/parliament/posy.jpg)
negy: ![](../threejs/dirksen/assets/textures/cubemap/parliament/negy.jpg)

posz: ![](../threejs/dirksen/assets/textures/cubemap/parliament/posz.jpg)
negz: ![](../threejs/dirksen/assets/textures/cubemap/parliament/negz.jpg)

A large box is then created with the CubeMap rendered on the inside of the
box. This gives the impression of being surrounded by an open scene, when in
reality, the six image textures are rendered on the inside of a box and viewed
from inside the box.

The CubeMap object can can also be applied as a texture, mapped onto the
surfaces of a shiny object placed inside the box. This combination of the
surrounding box and inner objects gives the (false) impression of objects
reflecting the environment!

If you're interested in the details, have a look at the source code for this
example.

(C) Scott D. Anderson and Ellen C. Hildreth. This work is licensed under a
[Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/).

  * [![Creative Commons License](/~cs307/Icons/somerights.gif)](https://creativecommons.org/licenses/by-nc-sa/1.0/)
  * [![Viewable With Any Browser](/~cs307/Icons/enhanced.gif) ](https://www.anybrowser.org/campaign/)
  * [![Valid HTML5](/~cs307/Icons/valid-html5v2.png) ](https://validator.w3.org/check?uri=referer)
  * [![Valid CSS!](/~cs307/Icons/vcss.gif) ](https://jigsaw.w3.org/css-validator/check/referer)

