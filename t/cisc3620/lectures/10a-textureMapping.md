---
layout: reveal
title: Texture mapping
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/10-texture-mapping-a.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/10new.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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


## Plan: Texture mapping

  * Conceptual overview
  * Practical examples
  * Tour through settings, parameters, and situations

## Texture mapping

  * Texture mapping was one of the major innovations in CG in the 1990s.
  * It allows us to add a lot of surface detail without adding a lot of geometric primitives (lines, vertices, faces).
  * But it is the basis for many more recent techniques as well

### Scene without textures

<backgroundimage>../readings/images/loadedDemo-wo-textures.png</backgroundimage>
<backgroundimageopacity>1.0</backgroundimageopacity>

### Scene with textures

<backgroundimage>../readings/images/loadedDemo.png</backgroundimage>
<backgroundimageopacity>1.0</backgroundimageopacity>


## Conceptual View

  * Texture mapping paints a picture onto a polygon.
  * Takes an array of pixels and paints them onto the surface.
  * An array of pixels is just a picture
    * which might be a texture like cloth or brick or grass,
    * or it could be a picture of Homer Simpson.
  * It might be something your program computes and uses.
    * Morelikely, it will be something that you load from an ordinary image file, such as a JPEG.

### Plane flags demo

<iframe height="600" style="width: 100%;" scrolling="no" title="Plane flags" src="https://codepen.io/asterix77/embed/vYNLabL?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/vYNLabL'>Plane flags</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Plane flags demo

  * These are textures that are simple arrays computed in JavaScript, which are mapped onto a plane:
    * grayscale (black and white) checkerboards 
    * RGB checkerboards (black and red) 
    * grayscale US Flag 
    * red, white and blue US Flag 

### Loading texture from image file

<iframe height="600" style="width: 100%;" scrolling="no" title="Library on a Plane" src="https://codepen.io/asterix77/embed/Yzywjgy?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/Yzywjgy'>Library on a Plane</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Conceptually

To use textures, you must do the following:

  1. define a texture: a rectangular array of pixels
   * _texels_ is short for _texture elements_
   * a texel is a pixel in an array being using for texture mapping.
  2. specify a pair of texture coordinates `(s,t)` for each vertex of your geometry. 

The graphics system "paints" the texture onto the polygon.


## How it Works

  * Texture mapping is a _raster_ operation
    * unlike any of the other things we've looked at so far
  * We apply textures to 2D surfaces in our 3D model
  * The graphics system has to figure out how to modify the _pixels_ during _rasterizing_ (AKA _scan conversion_).

{% include figure.html url="https://www.ntu.edu.sg/home/ehchua/programming/opengl/images/Graphics3D_Pipe.png" description="The OpenGL Pipeline." classes="stretch"%}


### How does Rasterization work?

  * When the graphics card renders a polygon, it (conceptually)
    1. determines the pixel coordinates of each corner 
    1. determines the edge pixels of the polygon, using a line-drawing program
    1. determines the color of the edge pixels on a single row, by linear interpolation from the vertex colors 
    1. walks down the row coloring each pixel, by linear interpolation from the two edge pixels 
  * Standard terminology is that the polygon is called a _fragment_
    * Thus, the graphics card applies a texture to a fragment.
  * This all happens either in the _framebuffer_ (the video memory that holds the pixels that are displayed on your screen) or an array just like it.


### Implementing Texture Mapping

  * To do texture mapping, the graphics card must
    1. compute a texture coordinate for each pixel during the rasterizing process, using bi-linear interpolation 
    1. look up the texture coordinates in the array of texels, either using the nearest texel or a linear interpolation of the four nearest texels 
    1. and either 
      * use the color of the texture as the color of the pixel, or 
      * combine the color of the texture with the color of the pixel  

## Texture Space

  * A texture is always an array, therefore always a rectangle
  * Mapping other shapes onto it can be challenging, but it is necessary
  * Each vertex of a polygon is assigned a position in the texture array
    * Texture coordinates go from 0 to 1 in 2D
  * Three.js Geometry objects have properties to hold the texture coordinates for each vertex of a triangular face.

{% include figure.html url="../readings/images/texcoords.png" description="Texture coordinates" classes="stretch"%}

### Texture space

  * How do the texture coordinates relate to the 2D array of texels?
  * This is an array of 260 pixels, numbered from 0 to 259
    * arranged in a rectangular array that is 13 by 20 pixels.

{% include figure.html url="../readings/images/flag-pixels.png" description="An array representing an image of a flag, with discrete pixels" classes="stretch"%}

### Texture space

  * The first element of the texel array (element `[0][0]`) is texture coordinates `(0,0)`. 
  * As we go down the first row of the array to element `[0][RowLength]`, we get to texture coordinates `(1,0)`. This may seem odd, but it's true. 
  * As we go down the first column of the array to element `[ColLength][0]`, we get to texture coordinates `(0,1)`. Again, this may seem odd, but it's true. 
  * The last element of the texel array is element `[ColLength][RowLength]`, texture coordinates `(1,1)`. 

{% include figure.html url="../readings/images/flag-pixels.png" description="An array representing an image of a flag, with discrete pixels" classes="stretch"%}

### Texture coordinates

  * Conventionally, the texture coordinates are called `(s,t)`
    * just as spatial coordinates are called `(x,y,z)`.
  * Thus, we can say that `s` goes along the _rows_ of the texture
    * along the "fly" of the flag
  * The `t` coordinate goes along the _columns_ of the texture
    * along the "hoist" of the flag

### Texture coordinate bounds

  * Although you will _often_ use the entire texture, (0 to 1) it is not _necessary_.
  * Because the dimensions of texture arrays are required to be powers of two, the actual
image that you want is often only a portion of the whole array
  * The computed US flag array has that property.
    * The array is 256 pixels wide by 128 pixels high
    * but the flag itself is 198 pixels wide by 104 pixels high.

### Texture coordinate bounds

  * Thus, the maximum texture coordinates (if you just want the flag and none of the gray area) are:

 fly |  = 198/256 = 0.7734  
 ---|---  
 hoist |  = 104/128 = 0.8125  

  * The result might look like this. The flag image only spans texture coordinates `(s,t)` from `(0,0)` to `(0.7734,0.8125)`.

{% include figure.html url="../readings/images/texturecoords3.png" description="Texture coordinates inside an image" classes="stretch"%}

### Texture repetitions

  * The texture parameters can also be _greater_ than 1
  * In which case, we can use parameter settings to get _repetitions_ of the texture
  * We can experiment with different values of `s` and `t` using the tutor next

## Texture Tutor

<iframe height="600" style="width: 100%;" scrolling="no" title="Texture tutor" src="https://codepen.io/asterix77/embed/ExVPeba?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/ExVPeba'>Texture tutor</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


## Code using Computed Textures

  * Let's start with texture-mapping with computed textures. Because they're computed, they'll be very simple, but we use them for two reasons:
    * It reinforces the concept that a texture is just an array, and 
    * it avoids issues of loading an additional file and having to use an event handler 

### First demo revisited

<iframe height="600" style="width: 100%;" scrolling="no" title="Plane flags" src="https://codepen.io/asterix77/embed/vYNLabL?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/asterix77/pen/vYNLabL'>Plane flags</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### First demo revisited

  * Look particularly at the implementation of `makeFlag()`. It
    * sets up the texture 
    * creates the mesh 
  * Notice that the texture is a property of the material, not the geometry.
  * The geometry, however, defines (default) texture parameters for each vertex.
    * Texture parameters of individual pixels of a face are done by interpolation from the texture parameters of the face's three vertices.




## Exercise: Three planes

  * Consider this codepen of a [relaxing floral scene](https://codepen.io/asterix77/pen/LYpGJgx?editors=1010)
  * We will convert it to use three different images on the three panels
  * The TW package provides a helper function, `TW.loadTextures()`
    * that takes an array of URLs for multiple image files and a callback function as inputs
    * and invokes the function on an _array of_ `THREE.Texture` objects that store the multiple images
  * Here is some skeleton code:

```javascript
        TW.loadTextures(["image1.jpg", "image2.jpg", ...],
                    function (textures) {
                        ...
                    } );
```

### Exercise: Three planes
    
    1. Use these two images for two of the panes: [flower1.jpg](https://s3-us-west-2.amazonaws.com/s.cdpn.io/2999896/flower1.jpg) [flower2.jpg](https://s3-us-west-2.amazonaws.com/s.cdpn.io/2999896/flower2.jpg)
    1. Fork my [relaxing floral scene](https://codepen.io/asterix77/pen/LYpGJgx?editors=1010)
    1. Modify it to load all three images of floral scenes and place them on the three different planes in the scene. 
    1. Remember that the texture is part of the _material_ , so you'll need create three different materials, instead of just cloning the mesh.
    1. Your solution might like like [this](https://codepen.io/asterix77/pen/yLYexGd?editors=1010)



