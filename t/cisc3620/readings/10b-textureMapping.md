---
layout: default
title: Texture mapping, Part 2
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---
# Texture mapping, Part 2

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

This reading covers several important issues:

  * Loading multiple images to create an object 
  * Repeating a texture a number of times 
  * Modifying texture parameters in a geometry 
  * Combining (blending) color and texture. The color might be computed from material and lighting. 


## Texture Parameters

As we know, texture parameters are defined in the _geometry_ , not the
material. Suppose we have a simple image texture-mapped onto a plane, as we've
seen with
[PlaneBuffyTW.html](../demos/TextureMapping/PlaneBuffyTW.html), which
just has two triangular faces. Given this, we can ask how the texture
parameters are defined for each face. Here's a figure that shows this:

{% include figure.html url="images/faceVertexUvs.svg" description="The faceVertexUvs property is an array of an array of face descriptors." classes=""%}

The `faceVertexUvs` property is an array of an array of
"face descriptors". Each face descriptor is an array of exactly three "face
texture descriptors", one for each vertex (a, b, and c). Each face texture
descriptor is a `THREE.Vector2`.

With this knowledge, we can reach into a geometry object to change the default
texture coordinates. We'll return to this later in the reading.

## Box Flag

Now let's look at how textures work on a `BoxGeometry`.

Take a look at this demo and read the code; it's only a couple dozen lines of
code, most of which you already know.

[Box Flag](../demos/TextureMapping/BoxFlag.html)

In fact, the code conceals too much. It will take some work to figure out how
the texture maps onto each side of the box. Furthermore, Three.js gives us no
parameters to control how the texture is mapped onto the sides. We'll learn
how to do that.

## Modifying Texture Parameters

By looking at how the US Flag maps onto the box, we can deduce the texture
parameters for each side. (What are they?) We can confirm this by looking at
the source code for `THREE.BoxGeometry`.

But, how to modify them? There are at least two basic approaches:

  * Figure out exactly the right indices into the face list, use them as indices into `faceVertexUvs` and modify the `THREE.Vector2` that have the texture parameters. This isn't too hard for fairly simple geometries like the Plane or even a simple Box, but the indexing becomes much more difficult once you have a box with more than one segment along the width, height, or depth. 
  * Determine a way to distinguish the faces we want to modify from the ones we don't, and also devise a general replacement algorithm to map the old (s,t) to a new pair. 

To illustrate the latter approach, let's take a look at a variation of the Box
Flag that prints out the geometry of the box:

[BoxFlag-v2.html](../demos/TextureMapping/BoxFlag-v2.html): Box Flag
with French Flag and Geometry display

Suppose we want to modify the front side? Which faces are those? Is there any
other way to characterize them? How about the faces with a normal vector like
(0,0,1)? Alternatively, we could use the face with `materialIndex == 5`.

Suppose we want to flip both texture parameters? (By "flip", I mean change 0
to 1 and 1 to 0, which would have the effect of flipping the direction of the
texture on this face.) We could compute something like this:

    
```javascript    
    var UV = ...; // index into structure of coords
    UV.x = 1-UV.x;
    UV.y = 1-UV.y;
```

Alternatively, if we want to have repetitions on one side, say in a 2x3
pattern, we could do something like this:

    
```javascript    
    var UV = ...; // index into structure of coords
    UV.x = 2*UV.x;
    UV.y = 3*UV.y;
```

Notice that if the texture parameter is a zero, multiplying it by 2 or 3
doesn't affect it, but if it's a one, multiplying it by 2 or 3 gets us exactly
the repetitions we want.

Consequently, we could modify this geometry object, even if it had more
segments, with code like this:

    
```javascript
    var geom = cube.geometry;
    var faces = geom.faces;
    var UVs = geom.faceVertexUvs[0];
    for( var i = 0; i < faces.length; i++ ) {
        var face = faces[i];
        // modify (s,t) parameters to give 2x3 pattern on front face (4)
        if( face.materialIndex == 4 ) {
            var faceUV = UVs[i];
            // for all three vertices
            for( j = 0; j < 3; j++ ) {
                var UV = faceUV[j];
                UV.x = 2*UV.x;
                UV.y = 3*UV.y;
            }
        }
    }
```

See it in action here:
[BoxFlag-v3.html](../demos/TextureMapping/BoxFlag-v3.html), only we've
switched to the US flag, since that makes repetitions more obvious, and we've
used the `(1-UV.y)` trick to flip the texture vertically.

## Using Multiple Textures

First, take a look at this demo that Kelsey Reiman built for us a few years
ago (rotate the cube with your mouse to see all 6 sides):

[Mikey
Cube](../demos/TextureMapping/mikeycube/threejsCube_multiTex.html)

Now, take a look at the source code that builds the cube:

    
```javascript
    TW.loadTextures(
        [ 'mikeypics/mikey1.jpg', 'mikeypics/mikey2.jpg', 
          'mikeypics/mikey3.jpg', 'mikeypics/mikey4.jpg',        
          'mikeypics/mikey5.jpg', 'mikeypics/mikey6.jpg' ],
        function (textures) {
            // create an array of materials from these textures
            var mats = [];
            for( var i=0; i < textures.length; i++ ) {
                mats.push(new THREE.MeshBasicMaterial( {map: textures[i]} ));
            }
            // create a cube using MeshFaceMaterial, one material for each face
            var cube = new THREE.Mesh( new THREE.BoxGeometry(2,2,2),
                                       new THREE.MeshFaceMaterial( mats ) );
            scene.add(cube);
            TW.render();
        });
```

The `TW.loadTextures()` function loads an array of images and invokes the
callback once all of them have been loaded.

So, it's pretty easy to put a different material on each side of a cube.

Of course, as we discovered earlier, this is powerful, but only if you want to
do what it makes easy. In particular, you have no control over the texture
coordinates for each side. Suppose we want to put repetitions of some image on
some side? We'd have to change all the texture parameters that are 1 to a 2,
but just for that face. We'll have to dig in to do that.

## Face Materials and Texture Parameters

You probably won't be surprised that with `THREE.MeshFaceMaterial`, each face
has a _materialIndex_ that indexes into the array of materials, and each
material has its own texture.

Thus, if we wanted to have a 2x3 pattern of Mikey on the front side
`(materialIndex == 4)` of the cube, we could use code from above. That's
actually implemented in the [Mikey
Cube](../demos/TextureMapping/mikeycube/threejsCube_multiTex.html)
example, bound to the 'p' key. Try it!

## An Alternative to Modifying Texture Parameters

The code above isn't horrible, once we get the basic pattern, but it's not
trivial, either. You can see how it might be easier just to launch your
favorite graphics editor (PhotoShop or whatever) and create a version of the
image for the front of the cube that contains the repetitions you want.
There's certainly nothing wrong or disreputable about that approach.
Sometimes, it's clearly the only approach, if the modification you want is not
something that can be done by setting texture parameters.

For this course, I'd prefer you to try to program when you can, and photoshop
when you must, but talk to me if you think that a graphics editor is the
better way.

## Lighting and Textures

So far, we've just mapped textures onto plain white surfaces. In fact, the
texture is _multiplied_ by the color of the surface (depending on the shader).
Consider the following demo:

[ Buffy on a Colored
Plane](../demos/TextureMapping/PlaneBuffyColored.html)

Now, if the color of the face isn't direct color (`THREE.MeshBasicMaterial`),
but is a function of the material (`THREE.MeshPhongMaterial`) and lighting of
the scene, you can easily see how we can combine this lighting information
with a texture.

One question, though, is what _color_ the material should be. You can see that
if the material has any _hue_ , it might interact in odd-looking ways with the
colors of the texture. Thus, it makes sense for the material to be _gray_. It
will probably be a fairly light shade of gray, maybe even white, since
lighting works by multiplying the material by a value less than one, so
typically the result is darker than the original. However, it also depends on
how many lights are in the scene, since the contributions of all the lights
are added up, so colors can also get brighter, even over-driven. So, there's
still some artistic judgment involved.

Consider one last demo:

[ Buffy on a Spotlit
Plane](../demos/TextureMapping/PlaneBuffySpotlit.html)

The trick here is to create a Phong material and then to set the `.map`
property:

    
```javascript
    var mat = new THREE.PhongMaterial();  // default is white
    mat.map = texture;
```

## Computing Lit Textures

Now that we know how to combine material and lighting with texture-mapping,
consider what the graphics card is doing. For each pixel, it's computing the
entire Phong Model to yield values for RGB (which will often be all the same,
if we have grayscale materials), then multiplying each component by the same
component of the texture to yield the color of the pixel.

Food for thought: When might you use colored material and grayscale textures?

## Coming Up

In the remaining reading and final lecture on texture-mapping, we'll discuss:

  * Texture-mapping on objects other than planes and cubes 
  * Looking at using _nearest_ versus _interpolated_ texture values 
  * The representation of textures as arrays, and the representation of images in RGB, including the concept of accessing an array in row major order. 
  * Bump mappings and environment mappings 


## Loading Images, Part 2 (Optional)

The last reading included a demo of Buffy texture-mapped onto a plane. Here's
a virtually identical demo showing an image file being loaded and texture-
mapped onto the same plane we used before:

[Plane Harry Potter](../demos/TextureMapping/PlaneHarry.html)

However, there's a hitch with this version that we didn't have with Buffy,
namely the [Same-Origin Policy](http://en.wikipedia.org/wiki/Same-
origin_policy), a security policy in web browsers. That policy covers
XMLHttpRequests (Ajax requests) as well, which is where JavaScript code issues
the request for the resource. So, even though the browser can request the
image from the Harry Potter Wikia, our JavaScript code _can't_.

I tried the demo above on all three browsers I have handy on my Mac, and
here's what I get:

Google Chrome (38.0.2125.104)

     Uncaught SecurityError: Failed to execute 'texImage2D' on 'WebGLRenderingContext': the cross-origin image at [url] may not be loaded. 
Firefox (33.0)

     Error: WebGL: It is forbidden to load a WebGL texture from a cross-domain element that has not been validated with CORS. See https://developer.mozilla.org/en/WebGL/Cross-Domain_Textures  
SecurityError: The operation is insecure.

Safari 6.0.5 (8536.30.1)

     Security_ERR: DOM Exception 18: An attempt was made to break through the security policy of the user agent. 

A solution could be CORS:

  * [what is CORS](http://enzolutions.com/articles/2014/05/31/what-is-cross-origin-resource-sharing-cors/), which is short and readable 
  * [CORS, Cross-origin resource sharing](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
  * [Mozilla: Cross-Domain Textures](https://developer.mozilla.org/en/WebGL/Cross-Domain_Textures) 

If the site we are loading an image from allows CORS, we should be able to do
so by adding an extra header to the request, using the following:

    
```javascript    
    THREE.ImageUtils.crossOrigin = "anonymous";  // or
    THREE.ImageUtils.crossOrigin = "";           // the default
```

However, Scott has not yet been able get this to work, so for now, just keep
the following in mind:

> Your images have to be on the same computer as your JavaScript program.

## Working Locally (Optional)

The Three.js people are aware of the issue with this Same-Origin Policy, and
they also know how nice it is to work locally, as we do on the lab Macs or on
our own laptops. In their online documentation, they wrote this nice
explanation of [ how to run things locally.
](https://threejs.org/docs/#manual/introduction/How-to-run-thing-locally)

We will use the "Run a local server" option, using Python.  We did this in
class, and the essentials are:

  * Start a terminal window 
  * `cd` to the directory that has your downloaded HTML file in it, such as `cd ~/Desktop`. 
  * Start a web server on port 8000 (by default) using Python: 
    
              python -m SimpleHTTPServer
        

  * Go back to your web browser and try the following URL, substituting your HTML filename for the `foo.html`
    
              http://localhost:8000/foo.html


## Summary

Here's what we learned

  * When loading images other than from our domain, we will probably run into a problem, violating the Same Origin Policy. 
  * When loading images from the local machine, we can start up a web server using Python's `SimpleHTTPServer` module. 
  * We learned how a single image is mapped onto a `THREE.BoxGeometry` and a strategy for modifying the textures by iterating over all the faces, determining which ones we want to modify, and modifying each in a generic way. 
  * We learned how to use `THREE.FaceMaterials` to map several images onto a single Box. We also learned how we might modify the texture parameters on particular faces by using `materialIndex`. 
  * Finally, we looked at combining material and lighting with texture mapping. We'll typically use gray materials with gray lights and colored textures. 




### Source

This page is based on <https://cs.wellesley.edu/~cs307/readings/10-texture-mapping-b.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

