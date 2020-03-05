---
layout: reveal
title: Parametric lines and triangles
stylesheets:
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/03a-color.html), [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/03b-color.html), [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/03.html), and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/03b.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


## Plan: Parametric lines and triangles



## Smooth and Flat Shading

![](http://www.ece.northwestern.edu/local-apps/matlabhelp/techdoc/visualize/chlighta.gif)

  * There is special software for the graphics card for computing the color of a "fragment" (such as a triangle).
    * This software is called the _shader_
  * Modern OpenGL allows you to write code for the shader
    * Fortunately, the Three.js software writes these shaders for us.
  * When shading a fragment where the vertices are different colors, the shader has two choices:
    * _flat_ shading: only one color is used, the color of one of the vertices. All the pixels get the same color. 
    * _smooth_ shading: interpolate the color between vertices.


### Smooth and Flat Shading

  * Note that only triangles are reliable for smooth shading
  * quads (four-sided facets) can be broken into triangles in different ways
    * leading to ambiguity in smooth shading
    * which is another reason why Three.js uses triangles for all its geometry
    

## Parametric Equation for a Line

  * To learn how WebGL/OpenGL does this linear interpolation, we first have to
understand how OpenGL represents lines.
  * It uses **parametric equations**.
  * Suppose we want to define a line from point A to point B.
    * Points A and B could be in 2D or 3D; everything works the same.
  * The _vector_ from A to B we will call **v**.
  * All the following are equivalent ways to generate a point on the line given t

 P(t) | = A + vt
---|---
 P(t) | = A + (B-A)t  
 P(t) | = A(1-t) + B*t  

### The parameter t

>  P(t) = A + (B-A)t  

  * All of these equations generate a point on the line given the value of t.
  * The parameter t can be any real number.
  * Any value of t generates a point on the line.
  * Thus, the 3D line is like the number line
  * What point is at t=0? t=1? t<0? t>1?

### Analogies

> P(t) = A + vt  

  * Defines the line using point A and a _vector_, v.
  * A is a location, v is a direction
  * If you start at A and go in direction v, your path will be a line.
  * If we imagine that you start at A at time 0 and you move with constant velocity
    * any point on the line is defined just by the time.
    * For example, P(4.5) would be your location 4.5 hours after you started.

### Same line, different parameter

  * We can define lines that go through the same points but that have different equations
  * For example, a line from B to A.
  * In that case, the equation looks like:

> Q(s) = B + (A-B)s

  * What point is a s=0? s=1? s<0? s>1?
  * It generates the same points as P(t), but the interpretation of the parameter is different.
  * In this case, the parameter goes in the opposite direction.
    * Someone driving on I-95 from NYC to Boston drives the same road
    * as someone driving I-95 from NYC to Boston, same road, different trip



## Parametric Line Metaphor: Bug Paths

{% include figure.html url="../readings/images/line.png" description="Figure 1: a line in a 2D coordinate system" classes="stretch" %}

  * consider the picture in Figure 1. The coordinates of the points are:
    * A = (2,2), B = (4,3), C = (8,5)
  * Suppose we have an ant crawling along the line.
    * It starts at point A at time 0 and gets to point B at time 1
    * Let's measure time in minutes and position in meters


### Ant path

{% include figure.html url="../readings/images/line.png" description="Figure 1: a line in a 2D coordinate system" classes="stretch" %}

  * consider the picture in Figure 1. The coordinates of the points are:
    * A = (2,2), B = (4,3), C = (8,5)
  * What vector is the ant moving along?
  * What is the parametric equation for the line?
  * What is the ant's height as a function of time?
  * What is the ant's horizontal position as a function of time?
  * How fast is the ant moving?


### Beetle path

{% include figure.html url="../readings/images/line.png" description="Figure 1: a line in a 2D coordinate system" classes="stretch" %}

  * consider the picture in Figure 1. The coordinates of the points are:
    * A = (2,2), B = (4,3), C = (8,5)
  * Now we have a beetle that starts at B at t=0 and gets to C at t=1.
  * What vector is the beetle moving along?
  * What is the parametric equation for the line?
  * What is the beetle's height as a function of time?
  * What is the beetle's horizontal position as a function of time?
  * How fast is the beetle moving?

### But wait

  + Why are there two different equations for the same line?
  + There are infinitely many parametric equations for the same line
    * We can choose one that is convenient for the problem we want to solve
  * Also, we can ask questions like:

> Suppose a centipede starts at C at time 0 and gets to A at time 1. At what time does it meet (and eat) the ant? Where does this gruesome event occur?

## When do lines meet?

Before we answer that question, let's look at another situation, this with two lines:

{% include figure.html url="../readings/images/lines.png" description="Figure 2: two lines in a 2D coordinate system" classes="stretch" %}

  * We now have two lines, the cyan one and the magenta one.
    * We can see that they intersect, but where? Do the bugs meet?
  * What is the equation of the cyan line?
  * What is the equation of the magenta line?
  * At what point do the lines meet?
  * At what value of t in the cyan line do the lines meet? s for magenta?
    * If they are the same, the bugs are there at the same time

### Parametric line meaning

  * Lines are intuitively one-dimensional things
  * So a single 1D number should be sufficient for specifying a location on the line
  * That is the parameter of the parametric equation

## Parametric Line Metaphor: Mixtures

  * We can think of parametric lines in another way
  * Namely as a _weighted average_ or as a _mixture_.

{% include figure.html url="../readings/images/line.png" description="Figure 3: a line in a 2D coordinate system" classes="stretch" %}

  * Let's think about a line from A to C:

 P(t) | = A + (C-A)t
---|---
 P(t) | = A + Ct - At  
 P(t) | = A(1-t) + Ct

  * Intuitively, the point B is 1/3rd of the way from A to C


### Parameter of B

  * We can make the following observations:
    * B = (4,3) 
    * The parametric equation evaluated at 1/3 gives us B: 

 P(1/3) | = A(2/3) + C(1/3)
---|---
 P(1/3) | = (2,2)(2/3) + (8,5)(1/3)  
 P(1/3) | = (4/3,4/3) + (8/3,5/3)  
 P(1/3) | = (12/3,9/3)  
 P(1/3) | = (4,3)  

### Weighted sum

  * This is a weighted sum
  * there's a weight on A and a weight on C, and we multiply the points by the weights and then add: 

> P(1/3) = A(2/3) + C(1/3)  

  * The weight on A is twice the weight on C,
    * and the point B is twice as close to A as it is to C.
    * That's why we used 2/3 as the weight instead of 1/3.

### Weighted sum: Course grades

  * Thus, points on the line segment from A to C can be viewed as weighted averages of the two endpoints.
    * For example, if a course's grade depends only on a midterm and a final
    * and the final counts twice as much as the midterm
  * How would you compute the course grade?

### Weighted sum: Cooking rice

  * We can also think of the points on the line segment as different _mixtures_ of the endpoints.
  * For example, when cooking rice, we need to get the right balance of rice and water.
  * If the point A represents 100% water and the point C represents 100% rice
    * the parameter of any point on the line segments represents a ratio of rice to water.
  * The point B has a parameter of 1/3, so what proportion is it?

### Mixtures outside of 0-1

  * The "mixture" metaphor doesn't work so well for points on the line outside the line segment (110% rice and -10% water?),
  * but it works very well for points on the interior of the line segment
  * and computer graphics is usually more concerned with line segments than infinite lines.
  * So this is a useful metaphor.

### Color mixtures

  * If points A and C are different colors and the line segment is being drawn with interpolated color
    * the points on the line segment can be colored using the mixture idea.
  * If A is red (1,0,0) and C is green (0,1,0), what color is B?


## 3D Parametric Line Example

  * Suppose we want a line from A through B, with:

 A | = (1,2,3)
---|---
 B | = (2,5,1)

  * We can write down the following equations:

 P(t) | = A+(B-A)t
---|---
 P(t) | = (1,2,3)+(1,3,-2)t  
 P(t) | = (1+t, 2+3t, 3-2t)  

  * By introducing a parameter (in this case, "t"), we write an equation that generates each coordinate independently.
    * The equations in this example are:

 x(t) | = 1+t
---|---
 y(t) | = 2+3t  
 z(t) | = 3-2t  

### Why are parametric equations so cool???

  * No special cases! Unlike "y=mx+b," which we all learned in high school, parametric equations work just fine for all lines. (Where does "y=mx+b" fail?) 
  * They work in 3D! Each coordinate gets its own equation! 
  * Lines and segments have **direction** , because vectors do. This is useful for rays of light, for example. 
  * Special values of t: 0, 1, between 0 and 1. For example, if you know that the parameter of a point on line from A to B is t=0.3, you know that the point is _between_ A and B, and is closer to A. 
  * We can think of this as a mixture (that is, as a _convex sum_ or a _weighted average_ ) of the endpoints. So, if one vertex is red and the other is yellow, all the points on the line segment connecting them are mixtures of red and yellow in different proportions. 

## Exercise: Finding a Point on a Parametric Line

Problem: Find the coordinates of a point 2/3 of the way from A=(2,3,4) to B=(5,9,1)


### Solution

  * Since the point is 2/3 of the way from A to B, our parameter is 2/3 and our starting point is A.
  * Our vector v is (B-A).

> v = B-A = (5-2, 9-3, 1-4) = (3,6,-3)  
>

  * Now, we can substitute into our equation and solve

P(2/3)| = A+v(2/3)  
---|---  
 | = (2,3,4) + (3,6,-3)(2/3)  
 | = (2,3,4) + (2,4,-2)  
 | = (4,7,2)  
  
  * So, the point 2/3 of the way from A to B has coordinates (4,7,2). Done!

### Solution 2

We could also use the mixture formulation: two parts B to one part A:

P(2/3)| = A(1/3)+B(2/3)  
---|---  
 | = (2,3,4)(1/3) + (5,9,1)(2/3)  
 | = (2/3,1,4/3) + (10/3,6,2/3)  
 | = (4,7,2)  
  
This may seem weird at first, because we're using a weight of 1/3 on A and a
weight of 2/3 on B, but the point is closer to B, so the weight on B has to be
greater.


## Exercise: Color mixing

Problem: Suppose that vertex A is red (1,0,0) and vertex B is magenta (1,1,0).
What is the color of the point that is 2/3 of the way from A to B?


### Solution

Solution: We can use the same mixture equation that we just used to find
coordinates:

 P(2/3) | = A(1/3) + B(2/3)
---|---
 P(2/3) | = (1,0,0)(1/3) + (1,1,0)(2/3)  
 P(2/3) | = (1,2/3,0)  

**Note** if a problem calls for more than one line, each line gets its own
parameter, such as r, s, or u. This makes sense because the parameters have
meaning: t=0 means the initial point of the line, so s=0 would be the initial
point of the other line.


## Exercise: Placing the Steeple on the Church

  * Can we use this to place the steeple on top of the barn?
  * Suppose we know that the vertex at the front of the ridge is R = (15, 55, 0) and the "shoulder" of the barn is S = (0, 30, 0).
  * Suppose we want to compute the vertex that is part of the base of the steeple, B,
    * as a point one-fifth of the way down the roof from R to S.

How can we do this? Working with a partner, compute the coordinates of B.
(Don't assume that the ridge angle is 90 degrees.)

{% include figure.html url="img/church-vertices.png" description="church vertices with R, B, and S" classes="stretch" %}

### Solution

 B | = (4/5)R + (1/5)S
---|---
 B | = (4/5)*(15,55,0) + (1/5)*(0,30,0)  
 B | = (12,44,0) + (0,6,0)  
 B | = (12,50,0)

{% include figure.html url="img/church-vertices.png" description="church vertices with R, B, and S" classes="stretch" %}

## Three.js Support for Interpolation

  * Three.js has some useful functions for doing interpolation on [`Vector3`](http://threejs.org/docs/#api/math/Vector3) objects.
  * Suppose `v1`, `v2`, and `v3` are all `Vector3` objects:
    * `v1.add(v2)` adds vector `v2` to `v1`
    * `v1.addVectors(v2,v3)` sets `v1` to the sum `v2+v3`
    * `v1.multiplyScalar(s)` multiplies `v1` by a scalar `s`
    * `v1.sub(v2)` subtracts vector `v2` from `v1`
    * `v1.subVectors(v2,v3)` sets `v1` to the difference `v2-v3`
    * `v1.lerp(v2,theta)` moves `v1` towards `v2`, by a fraction θ, using linear interpolation 
  * Warning, these methods all modify the object
    * so if you want to compute a new vertex, it's best to `.clone()` the vertex first.

### Computing with Three.js interpolation

  * Here's an example of computing a new point B, given a point A and a vector V,
  * and then computing the midpoint of the line segment from A to B

```javascript
    var A = new THREE.Vector3(1,3,5);
    var V = new THREE.Vector3(10,20,30);
    var B = A.clone();
    B.add(V);
    alert("B is " + JSON.stringify(B));
    var Mid1 = A.clone();
    Mid1.lerp(B,0.5);
    alert("midpoint is " + JSON.stringify(Mid1));
```

### Computing with Three.js interpolation

  * Here's another way to do the same thing

```javascript
    var A = new THREE.Vector3(1,3,5);
    var V = new THREE.Vector3(10,20,30);
    var B = A.clone();
    var Mid2 = A.clone();
    var Vhalf = V.clone();
    Vhalf.multiplyScalar(0.5);
    Mid2.add(Vhalf);
    alert("midpoint is also " + JSON.stringify(Mid2));
```

### Interpolating the steeple coordinate using Three.js

  * The code below carries out our earlier computation of the coordinates of the point B for the steeple, given the vertices R and S.

```javascript
    var R = new THREE.Vector3(15,55,0);
    var S = new THREE.Vector3(0,30,0);
    var Ans1 = S.clone();
    Ans1.lerp(R,0.8);
    alert("Ans1 is " + JSON.stringify(Ans1));
```

### Interpolating the steeple coordinate using Three.js

  * And another way

```javascript
    var R = new THREE.Vector3(15,55,0);
    var S = new THREE.Vector3(0,30,0);
    var V = new THREE.Vector3();
    V.subVectors(S,R);   // vector down the roof
    V.multiplyScalar(0.2);
    var Ans2 = R.clone();
    Ans2.add(V);
    alert("Ans2 is " + JSON.stringify(Ans2));
```


### Colors, Interpolation and RGB

  * RGB color is a three-dimensional system just like our 3D spatial coordinates.
  * Color interpolation works pretty much the same way as spatial interpolation.
  * Assuming the vertex S is cyan and R is red, what color is B?

```javascript
    var cyan = new THREE.Vector3(0,1,1);
    var red = new THREE.Vector3(1,0,0);
    var mix = cyan.clone();
    mix.lerp(red,0.8);
    alert("mix is " + JSON.stringify(mix));
```

## Parametric Equation for a Triangle

  * Since a triangle is a 2D thing, the parametric equation for a triangle will have _two_ parameters. One way to think about them is
  * the first parameter, say t, moves you along one side of the triangle, from vertex A to vertex B.
    * Let P(t) be that point along the AB edge of the triangle.
  * The second parameter, say s, is the parameter of a line from vertex C to P(t).
    * That is, the endpoint of the second line is a moving target.
  * The point Q(s,t) is a point in the triangle, on a line between C and P(t).

### Parametric equation for a triangle

 Q(s,t) | = C + (P(t) -C)s
---|---
 Q(s,t) | = C + (P(t)s - Cs)  
 Q(s,t) | = [A(1-t) + B(t)]s + C(1-s)  
 Q(s,t) | = A(1-t)s + Bts + C(1-s)  

{% include figure.html url="../readings/images/param-triangle.png" description="Lines to set up parametric equation of a triangle" classes="stretch" %}

### Choices

Notice that we have several choices:

  * The line from A to B could instead go from B to A.
  * Similarly, the line from C to P(t) could go from P(t) to C.
  * These yield equivalent equations
    * just as the equation of a line from A to B is equivalent to the equation of a line from B to A.

### Parametric triangle as a weighted sum

> Q(s,t) = A(1-t)s + Bts + C(1-s)

  * This is a three-way mixture of the vertices.
  * Meaning a triangle is all points in the _convex sum_ of the vertices.
  * A _convex sum_ is a weighted sum of N things, where the weights all add up to 1.0:

 S | =  w1 A + w2 B + w3 C
---|---
 1 | = w1+w2+w3


### Parametric triangle as weighted sum

  * Do the weights sum to 1 for 

> Q(s,t) = A(1-t)s + Bts + C(1-s)

  * Let's see

> (1-t)s+ts+(1-s)=1

  * Incidentally, the center of the triangle is where all the weights are equal: one-third.

## Example: Equation of a Triangle from Three Points

Suppose we have a triangle ABC whose vertices are:

 A | = (1,2,3)
---|---
 B | = (2,4,1)  
 C | = (3,1,5)

We could write down the following equation for the triangle:

 Q(s,t) | = A(1-t)s + B(t)s + C(1-s)
---|---
 Q(s,t) | = (1,2,3)(1-t)s + (2,4,1)ts + (3,1,5)(1-s)  

### Example: Equation of a Triangle from Three Points

We could write down the following equation for the triangle:

 Q(s,t) | = A(1-t)s + B(t)s + C(1-s)
---|---
 Q(s,t) | = (1,2,3)(1-t)s + (2,4,1)ts + (3,1,5)(1-s)  

Each coordinate separately is:

 x(s,t) | = (1-t)s + 2ts + 3(1-s)
---|---
 y(s,t) | = 2(1-t)s + 4ts + (1-s)  
 z(s,t) | = 3(1-t)s + ts + 5(1-s)  


### Example: Equation of a Triangle from Three Points

We can simplify this algebraically to

 x(s,t) | = (1-t)s + 2ts + 3(1-s)  
---|---  
 | = s-ts+2ts+3-3s  
 | = ts-2s+3  
  
  y(s,t) | = 2(1-t)s + 4ts + (1-s)  
---|---  
 | = 2s -2ts + 4ts + 1-s  
 | = 2ts + s + 1  
  
 z(s,t) | = 3(1-t)s + ts + 5(1-s)  
---|---  
 | = 3s -3ts + ts + 5 - 5s  
 | = -2ts -2s + 5  
  

### Example: Equation of a Triangle from Three Points

  * Suppose we have a point whose parameters with respect to that triangle are (0.5,0.5).
  * What does that mean?
  +  It means that the point is halfway between C and the midpoint of AB.
  + The coordinates are:

 x(0.5,0.5) | = (0.5)(0.5)-2(0.5)+3 = 2.25
---|---
 y(0.5,0.5) | = 2(1-0.5)0.5 + 4(0.5)(0.5) + (1-0.5) = 2  
 z(0.5,0.5) | = 3(1-0.5)0.5 + (0.5)(0.5) + 5(1-0.5) = 3.25  

  * So the coordinates of Q(0.5,0.5) are (2.25,2,3.25).

### Equivalent solution

  * We can also think of computing Q(s,t) as a weighted sum of the triangles' vertices:

 Q(s,t) | = A(1-t)s + B(t)s + C(1-s)
---|---
 Q(0.5,0.5) | = A(1-0.5)(0.5) + B(0.5)(0.5) + C(1-0.5)  
 Q(0.5,0.5) | = A(0.25) + B(0.25) + C(0.5)  

  * Then, to find the coordinates of Q(0.5,0.5), we just substitute the coordinates of ABC and calculate the weighted sum.


## Color Interpolation in a Triangle

  * If the colors of the vertices are different, OpenGL interpolates them
    * using the same equations that we used for calculating coordinates.
  * Suppose A is red (1,0,0), B is magenta (1,0,1), and C is yellow (1,1,0).
  * We can compute the color of the middle point, Q(0.5,0.5), as:

 Q(0.5,0.5) | = A(0.25) + B(0.25) + C(0.5)
---|---
 Q(0.5,0.5) | = (1,0,0)(0.25) + (1,0,1)(0.25) + (1,1,0)(0.5)  
 Q(0.5,0.5) | = (1,0.5,0.75)  

  * The triangle as a whole looks like this:

{% include figure.html url="../readings/images/colorInterpolation.png" description="A triangle with smooth interpolation" classes="stretch" %}

### Color Interpolation in Three.js

  1. The `THREE.Geometry()` object has a `vertexColors` property that is an _array_ of colors. 
  2. Each `THREE.Face3()` object (an array of these is in the Geometry object) has a three-element array of colors, each of which is the color of the corresponding vertex of the face. 
  3. Using `THREE.MeshBasicMaterial`, we set the `vertexColors` property to `THREE.VertexColors`. The value of this property alerts Three.js that the vertices of a face (a triangle) could have different colors. 

### Color interpolation RGB triangle

<iframe height="600" style="width: 100%;" scrolling="no" title="Triangle interpolation" src="https://codepen.io/asterix77/embed/jOPmVbR?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/jOPmVbR'>Triangle interpolation</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Color interpolation two triangles

<iframe height="600" style="width: 100%;" scrolling="no" title="Triangle interpolation on a square" src="https://codepen.io/asterix77/embed/RwPVoaQ?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/RwPVoaQ'>Triangle interpolation on a square</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Inconsistent color interpolation

<iframe height="600" style="width: 100%;" scrolling="no" title="Inconsistent triangle interpolation on a square" src="https://codepen.io/asterix77/embed/jOPmVro?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/jOPmVro'>Inconsistent triangle interpolation on a square</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


### Inconsistent color interpolation

  * Notice that at the lower right we have:
    * vertex B, coordinates (1,0,0), color THREE.ColorKeywords.lime 
    * vertex B2, coordinates (1,0,0), color THREE.ColorKeywords.blue 


## Exercise: Colorful Stars

  * This [stars-start](https://codepen.io/asterix77/pen/poJWOMp?editors=1010) pen contains a function `starGeometry()`
    * that creates and returns a `Three.Geometry` object for a three-pointed star.
  * Let's take a minute to understand that geometry.

### Exercise: Colorful Stars

  * Modify this code to create a star that uses _color interpolation_ of the triangular faces
  * and adds it to the scene.
  * Your result might look like this: [stars1](03b-exercises/stars1.html)

Some tips:

  * The starting code includes an array of `THREE.Color` objects named `colors`. Feel free to change the colors to whatever you want! 
  * When creating the material for the star using `THREE.MeshBasicMaterial`, add a second property to the input object (in addition to the `vertexColors` property) that tells Three.js to render both sides of the triangular faces: `side: THREE.DoubleSide` 

### Exercise: Add stars to the scene

  * Add six additional stars to the scene that each have a uniform color
  * and which are placed around the central star
  * Something like this: [stars](03b-exercises/stars.html).

Some tips for this part:

  * Think about how this can be done with a loop 
  * Use the same array of colors that you used for the central star 
  * Recall that `position.set()` can be used to place a mesh at a desired location 
  * Remember to adjust the bounding box supplied to `TW.cameraSetup()` to see the additional stars 
