---
layout: reveal
title: The Phong shading model
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/09-lighting.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/09a.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

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



## Lambert Model


Phong's model combines the ambient, diffuse and specular components into one
big, hairy equation. We'll first address the Lambertian part of it, and then
get to the Phong Model.

First, we need some notational building blocks:

  * \\(\vec{n}\\) : the normal vector for the surface. In this context, the normal vector is a vector that is _perpendicular_ (or _orthogonal_ ) to the surface. The normal vector is how we define the "orientation" of a surface -- the direction it's "facing." The normal vector is the same over a whole plane, but may change over each point on a curved surface. The normal vector is often _normalized_ to be a unit vector (length 1). 
  * \\(\vec{\ell}\\) : the vector towards the light source; that is, a vector from the point on the surface to the light source (not used for ambient light). For distant lights, this vector doesn't change from point to point. 

In the model, we will have parameters captured in the vector \\(L\\) that
represent the intensity of the incoming light. We saw this in the Three.js
code above. Turn them up and the light gets brighter.

We also have to worry about how much of the incoming light gets reflected. Let
this be a number called \\(R\\). This number is a fraction, so if \\(R =0.8\\),
that means that 80 percent of the incoming light is reflected. (We actually
have 9 such numbers, specifying the reflection fraction for specular red,
ambient green, and so on, for all 9 combinations.)

As we discussed earlier, in general, \\(R\\) can depend on:

  * material properties: cotton is different from leather 
  * orientation of the surface 
  * direction of the light source 
  * distance to the light source 

The light that gets reflected is the product of the incoming light intensity,
\\(L\\) , and the fraction \\(R\\) :

\\[I = L R\\]

That is, the intensity of light that is reflected from a surface (and ends up
on the image plane and the framebuffer) is the intensity of the incoming light
(landing on the surface) multiplied by the reflection number.

Note that the above equation is just shorthand for the sum of 9 computations
multiplying the ambient/diffuse/specular, red/green/blue light by the
ambient/diffuse/specular, red/green/blue material. And that's just for one
light! If we have multiple lights, we need to add up more contributions.

This leads to the problem of _overdriving_ the lighting, where every material
turns white because there's so much light falling on it. This happens
sometimes in practice: you have a decently lit scene, and you add another
light, and then you have to turn down your original lights (and your ambient
light) to get the balance right.

Why does \\(R\\) depend on the light source? That is, why does the reflection
fraction depend on which light we're talking about? Because the direction and
distance change. But since all the light sources work the same way, we're not
going to worry about which light source it is, and we'll just have our
abstract Lambert Model:

Abstract Lambert Model
\\[ I = L_a R_a + L_d R_d \\]

That is, the intensity of the color of an object is

  * the ambient light falling on it, multiplied by the reflection amount for ambient light, plus 
  * the diffuse light falling on it, multiplied by the reflection amount for diffuse light. 

The above equation is our abstract Lambert Model. Now let's see how to compute
the two \\(R\\) values.

## Ambient

Reflection of ambient light doesn't depend on direction or distance or
orientation, so it's solely based on the material property: is the material
dark or light? Note that it can be dark for blue and light for red and green.
If white light falls on such a material, what does it look like? So, \\(R_a\\)
is a simple constant, which we will call kamb, just to remind ourselves that
it's a constant:

\\[R_a = k_a\\]

Note that \\(0 \\le k_a \\le 1\\). Why?

This constant is chosen by you the programmer as part of the material
properties for an object, in the same way that you choose color. There are
actually three such values, one each for red, green, and blue.

## Diffuse/Lambertian

For Lambertian/diffuse surfaces, we assume that light scatters in all
directions. In lay person's vocabulary, such surfaces are often called
"matte".

However, the angle of the light does matter, because the energy (photons) is
spread over a larger area. Consequently, we have

\\[R_d = k_d \vec{\ell} \cdot \vec{n}\\]

Recall that \\(\vec{\ell}\\) is the light vector, the direction to the light source, and
\\(\vec{n}\\) is the normal vector, the orientation of the surface. The \\(\cdot\\) operator
is the _dot product_ between the two vectors, described in the reading on
[geometry](http://m.mr-pc.org/t/cisc3620/2020sp/lectureGeometry.pdf). The dot product of two normalized vectors (unit
length) gives the cosine of the angle between them. Thus the meaning of this
equation is that the amount of light reflected from a diffuse surface is the
product of a constant, chosen by you the programmer, multiplied by the cosine
of the angle between \\(\vec{\ell}\\) and \\(\vec{n}\\). As before, there are actually 3 such
constants, one each for red, green, and blue.

Now, we finally have our finished Lambert Model:

\\[ I = L_a k_a + L_d k_d \vec{\ell} \cdot \vec{n}\\]  


## Lambertian Materials in Three.js

In the past, we created surfaces with `THREE.MeshBasicMaterial`, which doesn't
take into account the lights available in the scene. In Three.js, you can make
a [Lambertian
material](https://threejs.org/docs/index.html#api/materials/MeshLambertMaterial)
like this:

    
```javascript
    var mat = new THREE.MeshLambertMaterial( {color: THREE.ColorKeywords.cyan} );
```

Of course, you can specify the color in many ways, as we've seen before. The
developers of Three.js decided that materials will reflect ambient light the
same way they reflect diffuse light, captured with the `color` property. Using
color specifications like this is a shorthand for specifying reflection
coefficients for the red, green, and blue primaries.

## Phong Model

Now, let's turn to the full Phong Model by adding in specular reflections.
With specular reflections, the material is (locally) smooth and is acting like
a mirror. The incoming light rays bounce off the material and head off at an
angle equal to their incoming angle. To understand what this means, we first
need some more notational building blocks:

  * \\(\vec{v}\\) : the vector towards the eye; that is, the Center of Projection (COP). If \\(\vec{v}\\) says that the surface faces away from the viewer, the surface is invisible and OpenGL can skip the calculation. 
  * \\(\vec{r}\\) : the reflection vector of the light. If the surface at that point were a shiny plane, like a mirror, \\(\vec{r}\\) is the direction that the light would bounce in. 

The following figure illustrates these vectors:

{% include figure.html url="images/specular-reflection.png" description="The eye vector (purple) and the reflection vector (red)" classes=""%}

The blue vector is
the incoming light. The red vector is \\(\vec{r}\\), the reflection vector. The purple
vector is \\(\vec{v}\\), the vector from the surface to the eye. If \\(\vec{r}\\) and \\(\vec{v}\\) are
"close," the specular highlight will be visible.

If the direction of our view, \\(\vec{v}\\) , is "near" the reflection direction,
\\(\vec{r}\\) , as in the above diagram, we should see a lot of that reflected light.
This is called a "specular highlight".

\\[R_s = k_s ( \vec{v} \cdot \vec{r} )^\alpha \\]

The dot product is large when the two vectors are "lined up." The \\(\alpha\\) exponent
is a number that gives the "shininess." The higher the shininess, the smaller
the spotlight, because the dot product (which is less than one), is raised to
a higher power. OpenGL allows  \\(\alpha\\) to be between zero and 128. In addition to \\(\alpha\\),
the OpenGL programmer gets to choose the specularity coefficient, \\(k_s\\) for
each of red, green, and blue. As usual, the specularity coefficient is between
zero and one.

## The Complete Phong Model

Adding this last part to the Lambert Model gives us the Abstract Phong Model:

\\[I = L_a R_a + L_d R_d + L_s R_s\\]

Filling in the details of the above mathematical models, we get the Concrete Phong Model:

\\[I = L_a k_a + L_d k_d \vec{\ell} \cdot \vec{n} + L_s k_s (\vec{v} \cdot \vec{r} )^\alpha \\]


## Phong Materials in Three.js

All that work is to understand the following deceptively simple lines of code
to set up a [Phong
Material](http://threejs.org/docs/#api/materials/MeshPhongMaterial) in
Three.js:

    
```javascript
    var mat = new THREE.MeshPhongMaterial(
        {color: THREE.ColorKeywords.cyan,
         specular: 0xCCCCCC,
         shininess: 30});
```

In the example above, we used `0xCCCCCC` (silver) as the specular color. Since
`0xCC` is 204, and 204/255 is 0.8, this amounts to a specularity coefficient
of 80 percent, equally for red, green, and blue. This material will reflect
80% of all specular light falling on it.

The dot product of the reflection vector and the eye vector is raised to the
30th power, which makes this a fairly shiny object.

## Summary

  * There are three kinds of light: ambient, diffuse and specular 
  * Ambient is constant from all directions 
  * Diffuse depends on the angle between the light and the surface 
  * Specular depends on the angle between the reflected incoming light and the eye, and also depends on a scalar quantity called shininess 
  * In Three.js, the `color` attribute of a material captures how it interacts with diffuse and ambient light, and the `specular` and `shininess` properties capture the specular reflection of the surface material 
  * In Three.js, you can have: 
    * Point lights 
    * Ambient light  




## Activities

  * Surface materials, reflectance, lights: ambient, diffuse, specular ([slides](Lect10_light.pdf)) 
  * Lambert and Phong models 
  * Materials and light sources in Three.js 
  * Exercises: pink ball, add a light source to the Luxo lamp  

## Compelling 3D Surfaces with Material & Lighting

By modeling different kinds of surface materials and how they reflect light,
we can create a more compelling three-dimensional appearance of object
surfaces, as illustrated in this picture from the Wikipedia page on the [Phong
model](http://en.wikipedia.org/wiki/Phong_reflection_model)

![](PhongWiki.png)

What is the difference between _local_ and _global_ lighting models?

![mirror reflection](globalReflect.png) ![local lighting](localLight.png)
![cast shadows](globalShadows.gif)

[Teddy bear with material and
lighting](../threejs/demos/MaterialLighting/TeddyBear.shtml)

## Ambient Calculations

Independent of any light source other than a global ambient

## Diffuse Calculation

  * **LV** is the vector from the surface fragment to the light 
  * **NV** is the surface normal (a vector) of the surface fragment 
  * The dot product shows how closely **LV** and **NV** are aligned 

## Specular Calculation

  * **EV** is the vector from the surface fragment to the eye 
  * **RV** is the vector from the surface fragment in the direction of perfect reflection (angle of incidence equals angle of reflection) 
  * the dot product between the two vectors shows how closely these are aligned 
  * shininess is a scalar, the exponent that the dot product is raised to. A larger exponent 
    * causes the shine to diminish more quickly, so 
    * a smaller range of angles get a specular reflection. 
    * This makes the specular highlight smaller, and 
    * the object looks shinier.  

## The Complete Lambert Model

The Lambert model takes into account the surface normal and the angle towards
the light:

> I = **L** amb **R** amb \+ **L** diff **R** diff  
>  Abstract Lambert Model

Filling in the details of mathematical models, we get:

> I = **L** amb kamb \+ **L** diff kdiff ( **LV** • **NV** )  
>  Concrete Lambert Model

## The Complete Phong Model

Adding specularity to the Lambert model gives us the Phong model:

> I = **L** amb **R** amb \+ **L** diff **R** diff \+ **L** spec **R** spec  
>  Abstract Phong Model

Filling in mathematical models, we get:

> I = **L** amb kamb \+ **L** diff kdiff ( **LV** • **NV** ) \+ **L** spec
kspec ( **EV** • **RV** )e  
>  Concrete Phong Model

## Material and Lighting Tutor

We'll spend some time with an imitation of Nate Robins' tutor for material and
lighting. Note that the _emissive_ property of the material, controlled with
the `matEmissive` parameter in the demo, is the color that the material
_emits_. It doesn't act as a real light source, but is a solid color that is
not affected by other lighting in the scene.

[Material
Parameters](../threejs/demos/MaterialLighting/MaterialParameters.shtml)

## Materials and Light Sources in Three.js

Materials with
[Lambertian](https://threejs.org/docs/index.html#api/materials/MeshLambertMaterial)
or
[Phong](https://threejs.org/docs/index.html#api/materials/MeshPhongMaterial)
reflectance properties can be created in Three.js as follows:

    
    
    var matLamb = new THREE.MeshLambertMaterial
                               ( {color: THREE.ColorKeywords.cyan} );
    
    var matPhong = new THREE.MeshPhongMaterial
                               ( {color: THREE.ColorKeywords.green,
                                  specular: THREE.ColorKeywords.white,
                                  shininess: 30,
                                  shading: THREE.SmoothShading  // or THREE.FlatShading
                                 } );
    

`color` is the color of the surface for both materials. `specular` is the
color of specular highlights and `shininess` is the exponent in the Phong
model.

The graphics card can either

  * interpolate the lighting calculations across a face (smooth shading), or 
  * it can use a single value for the entire face (flat shading) 

You might think that smooth is always better than flat, but what if the
geometry is _not_ a polygonal approximation of a smooth object like a ball?
What if, in fact, the geometry is accurate, and the object is _faceted_ with
flat faces, like a jewel?

See this, from [Wikipedia on Phong
Shading](http://en.wikipedia.org/wiki/File:Phong-shading-sample.jpg) ![Phong
shading sample](http://upload.wikimedia.org/wikipedia/commons/8/84/Phong-
shading-sample.jpg)

You can implement flat shading by setting the `shading` attribute for the
`THREE.MeshPhongMaterial` to `THREE.FlatShading`.




## Exercises: Pink Ball and Luxo Lamp

Scott took these photos of his daughter's pink plastic ball:

![a pink plastic ball](08-exercises/pinkball1.jpg)![a pink plastic
ball](08-exercises/pinkball2.jpg)

Do you see the effects of specularity? If so, where?  
Do you see the effects of diffuse reflection? If so, where?  
Do you see the effects of ambient light? If so, where?

### Exercise: Imitate the pink ball

Using this [starter code](08-exercises/pink-ball-starter.html), try to imitate
the pink plastic ball.

Here's a GUI to help: [pink ball GUI](08-exercises/pinkBall.html)

Your final code might look something like this [pink ball
solution](08-exercises/pinkBall-solution.html)

Perfection is not required!





## Useful Facts about Material and Lighting

  * Spotlights (and lights in general), are not affected by the transformations that we apply to geometry. Therefore, it doesn't work to add a light to, say, a clown's hat, and add that to the head, which gets added to the body, and so forth. You should add your lights directly to the scene, and use "global" coordinates when parameterizing them.
  * Lights have a boolean attribute, `.visible`. If they are not visible, they don't contribute to the scene. This makes them easy to turn on and off. You don't have to re-build anything, though you will need to re-render. 
  * Spotlights only interact properly with `THREE.MeshPhongMaterial`, not with `THREE.MeshLambertMaterial`. This is not what the Three.js documentation says. 
