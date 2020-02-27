---
layout: reveal
title: Nested Transforms
stylesheets:
  - ../css/3620.css
---

# {{ page.title }}
#### {{ site.author }}

Based on [this CS 307 reading](https://cs.wellesley.edu/~cs307/readings/05-nested-transforms.html) and [this CS 307 lecture](https://cs.wellesley.edu/~cs307/lectures/05b.html) which are copyright &copy; Scott D. Anderson and licensed under a [Creative Commons BY-NC-SA License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


## Plan: Nested Transforms

Previously, we looked at the instance transformation: translate, rotate and
scale, to place on object in the scene. The following discussion is about more
complex sequences and nested transformations.

 * 

## Composite Objects

  * When building a complex object, we don't want to build it out of low-level vertices and faces
    * like a bicycle, a teddy bear, or a complex scene
  * Instead, we'd like to build it out of high-level components
    * maybe cubes, spheres and cylinders,
    * or even higher-level things, like wheels, trees, snowpeople, etc.

### Example: Snow person

  * Let's take a snowperson as our basic example.
  * A snowperson is a composite object comprised of three or four components:
    * three white spheres
    * and an optional orange cone for the nose
      * (No, we're not doing anything as complicated as Olaf)

### Snow person container

Our basic strategy will be to:

  * Create a "container" object that represent our snowperson.
    * The spheres that make up the snowperson are put into it
  * The container is an instance of `THREE.Object3D`, parent class of `THREE.Mesh`.
    * Has the attributes and methods for the instance transform
    * so we can place our snowperson in the scene
    * but doesn't need a `THREE.Geometry` object. 

### Snow person container

  * The container has methods to add components
    * using the same `.add()` method we know from adding things to the scene.
    * It also has properties that include the list of components (`.children`)
    * and methods to find a particular component. 
  * Use the instance transform to place components in the container
    * need to decide where the origin and axes will be for our container (snowperson)
    * and arrange the components within that structure. 

### Coordinate system vs frame

  * Technically, a _coordinate system_ is the directions that the x, y, and z axes point
  * Versus a _frame_ is a coordinate system plus a location for the origin
  * Thus, a snowperson can have its own _frame_ and we position the components in that frame.
  * You should usually choose frames for your composite objects that make it easy to position them within your scene
    * or a larger composite object that they are components of

### Demo: Snow person

<iframe height="602" style="width: 100%;" scrolling="no" title="Snowperson" src="https://codepen.io/asterix77/embed/bGdqbVy?height=602&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/bGdqbVy'>Snowperson</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
    
### `createSnowPerson()`

```javascript
function createSnowPerson (wireframe, radiusBottom, radiusMiddle, radiusTop) {
    /* Returns a three-sphere snowperson. The args are the radii of the
    spheres, starting from the bottom. The snowperson sits on the origin,
    and the spheres are stacked along the y axis. */
    //
    // these could also be parameters
    var bodyColor = 0xFFFFFF;
    var bodyMaterial = new THREE.MeshBasicMaterial({color: bodyColor});
    bodyMaterial.wireframe = wireframe;
    var sphereDetail = 10;
    //
    // here is our container
    var frosty = new THREE.Object3D();
    //
    // function to add one snowball to frosty.  
    // height is distance of origin to sphere center along y.
    function addSphere(radius,height) {
        var sg = new THREE.SphereGeometry(radius,sphereDetail,sphereDetail);
        var s = new THREE.Mesh(sg, bodyMaterial);
        console.log("adding sphere: " + radius + " at " + height);
        s.position.y = height;   // specify where along Y to add it
        frosty.add(s);
    }
    //
    // ================================================================
    // main code of function
    //
    var y = radiusBottom;  // center of bottom sphere
    addSphere(radiusBottom,y);
    y += radiusBottom + radiusMiddle;  // center of middle sphere
    addSphere(radiusMiddle,y);
    y += radiusMiddle + radiusTop;  // center of top sphere
    addSphere(radiusTop,y);
    //
    return frosty;
}
```

### `createSnowPerson()`

  * `addSphere()` creates a sphere geometry of a given radius, a mesh, positions the sphere at a given height above the origin, and adds it to the container, `frosty`.
    * Like adding objects to the scene
  * Notice that we have to set the position of the bottom sphere up by its radius
   *  if we want the "position" (origin) of the snowperson to be at its base
   * and not in the center of any of its spheres.
   * It's _convenient_ for positioning the snowperson to have the origin there

### `addSnowPersonGUI()`

  * `addSnowPersonGUI()` adds that snowperson to the scene.
  * Notice that adding a snowperson isn't really much different from adding a box.
  * Note also that the instance transform applies to the whole snowperson, not just one part.
    * That's very powerful.

```javascript
function addSnowPersonGUI(scene) {
    var sp = createSnowPerson( guiParametersSnowperson.wireframe,
                               guiParametersSnowperson.radiusBottom,
                               guiParametersSnowperson.radiusMiddle,
                               guiParametersSnowperson.radiusTop);
    // instance transform to place it in the scene.
    sp.position.set( guiParametersSnowperson.X,
                     guiParametersSnowperson.Y,
                     guiParametersSnowperson.Z );
    // don't forget this!
    scene.add(sp);
    return sp;
}
```

## Rotating a Cone

  * Positioning something is pretty straightforward
    * though we did see some trickiness with positioning the spheres in the snowperson's frame
  * But rotating is a bit more complicated.
  * If we create a `THREE.ConeGeometry`, say with a length of 10
    * it is constructed in a frame with the Y axis running through the center of the cone
    * with the top at 5 (half the height) and the bottom at -5.
  * Rotations are always performed around the origin.
    * for mathematical reasons that we'll see soon
    * That's fine for certain kinds of rotations, but not so great for others
  * But: We can use composite objects to rotate around whatever location we want

### Rotating a Cone

<iframe height="599" style="width: 100%;" scrolling="no" title="Ringing a bell" src="https://codepen.io/asterix77/embed/yLNMBae?height=599&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/yLNMBae'>Ringing a bell</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Try to use the GUI to swing the cone like a bell from the top.

### `makeConeScene()`

Here is the code that makes that scene:
    
```javascript
function makeConeScene(scene,parameters) {
    var rb = parameters.radiusBottom;
    var height = parameters.height;
    //
    var inner = TW.createMesh(new THREE.ConeGeometry(rb, height));
    inner.name = "inner";
    inner.position.y = parameters.positionOffset;
    inner.rotation.z = parameters.innerRotation;
    //
    var outer = new THREE.Object3D();
    outer.name = "outer";
    outer.add(inner);
    outer.rotation.z = parameters.outerRotation;
    scene.add(outer);
}
```

### `makeConeScene()`

 * The code creates a cone as the _inner_ object
 * And puts it inside a `THREE.Object3D`, the _outer_ object
 * The inner one is placed inside the outer at an offset
 * If we rotate the inner one, the cone rotates around its center, as we expected
 * If we rotate the outer one, the displaced cone rotates around the origin of the container, a different point
 * If you offset the cone downward by half its height and set the inner rotation to zero
   * the point of the cone is at the origin of the outer frame
   * and we can rotate the cone around its apex!

## Demo: A jointed leg

<iframe height="599" style="width: 100%;" scrolling="no" title="Jointed leg" src="https://codepen.io/asterix77/embed/dyovbVK?height=599&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/dyovbVK'>Jointed leg</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
    

### Demo: A jointed leg

 * The code is more complicated, but not conceptually harder
 * Still, it can help to visualize the various parts.
   * foot: the object containing the "shoe". The origin is the ankle. 
   * lower leg: the object containing the calf and the foot. The origin is the knee. 
   * leg: the object containing the thigh and the lower leg. The origin is the hip. 

{% include figure.html url="../readings/images/leg-annotated.png" description="Leg with components shown in yellow" classes="stretch"%}


## Kinematics and Inverse Kinematics

 * Programming with nested frames is not necessarily easy
 * But it is much easier than programming without nested frames.
 * Imagine trying to position a soccer ball near the end of the foot
   * You need to know the (x,y,z) coordinates of the end of the foot
   * so that you can position the soccer ball there.
   * So, "all" you have to do is calculate the end point of the foot, given the lengths of the limbs and the joint angles. An hour or so of trigonometry should do the trick....
 * This problem of figuring out where the endpoint is given a set of limb lengths and joint angles is called a _kinematics_ problem.

### Inverse kinematics aside

 * Your body/mind is amazingly good at calculating the joint angles necessary to put your feet and hands where they need to be.
 * Roboticists call that the [inverse kinematics](http://en.wikipedia.org/wiki/Inverse_kinematics) problem
   * and it's not easy!
 * It also comes up in 3D Graphics and Animation
   * as we try to have graphical objects interact with each other.

## Sequences of Transformations

 * How is the barn like a picket of a fence?
   * They're certainly different in size
   * and of course a picket is tall and skinny
   * while a barn is relatively squat.
 * But these are just scalings!
 * In other words, given a scale transformation, the barn is the same as a picket.
 * So, we can make a picket fence by drawing the barn many times!

### Demo: picket fence

<iframe height="603" style="width: 100%;" scrolling="no" title="Sibling picket fence" src="https://codepen.io/asterix77/embed/yLNMVQV?height=603&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/yLNMVQV'>Sibling picket fence</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Picket fence code

 * Notice the transformations in the code.
 * By the time we get to the end of the fence
   * the last picket has been translated `numPickets` times
   * set to 30 in the code that calls the `makeFence()` function

### Cloning

 * In the picket fence example, we used a new method `clone()`
 * The clone method is defined for all descendants of [`THREE.Object3D`](http://threejs.org/docs/#api/core/Object3D)
 * It is a convenient way to make another instance of something you've built.

### Demo: chain picket fence

<iframe height="598" style="width: 100%;" scrolling="no" title="Relative picket fence" src="https://codepen.io/asterix77/embed/LYVWGOR?height=598&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/LYVWGOR'>Relative picket fence</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Chain picket fence

  * In this case, each picket is a child of its neighbor
    * As opposed to all being "siblings" of a single `Object3D`
  * "Absolute" positions are actually relative to this parent
    * i.e., the neighbor
  * Easier to work with and think about

```javascript
var picket = TW.createBarnSolidColor(0.1, 1, 0.01, "brown");
var fence = picket;
for (var i = 0; i < params.numPickets; i++) {
  var newPicket = picket.clone();
  newPicket.position.x = params.xOffset;
  newPicket.rotation.y = params.yRotation;
  picket.add(newPicket);
  picket = newPicket;
}
scene.add(fence);
```


## Scene Graphs

 * The data structure we are building is eventually added to the `THREE.Scene` object
   * itself an instance of `THREE.Object3D`
   * Along with other graphical objects.
 * The entire scene, then, is a _graph_ of objects.
   * A_directed, acyclic graph_ or DAG.
 * It is therefore called the _scene graph_.
 * The scene graph for the leg example looks like this:

{% include figure.html url="../readings/images/leg-graph.svg" description="Scene graph for leg example" classes="stretch"%}


## The Teddybear

<iframe height="600" style="width: 100%;" scrolling="no" title="Teddybear" src="https://codepen.io/asterix77/embed/oNXZgVw?height=600&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/oNXZgVw'>Teddybear</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Teddybear tricks

  * Positions are _calculated_ as much as possible,
    * so if you make the body bigger, the head is still attached
  * Looking at `addNose()`
    * the nose is placed nn the surface of the head by positioning it
    * then it is moved up and down on the head in an extra frame rotating around the center of the head
  * Similarly, in `addEar()`
    * the ears are placed on the surface of the head, symmetrically, by multiplying the x position by -1 for the left ear and +1 for the right ear
    * we can move them up and down the head by rotating this earframe around the Z axis
  * The ear itself is a flattened sphere, done by scaling in the Z direction.

### Teddybear tricks 2

  * Eyes are just spheres, like the nose, and placed similarly
    * except there are two of them, so we use the -1/+1 trick for symmetry
    * and we have an angle around the Y axis (eye separation)
    * and another angle around the X axis (high or low eye location). 
  * Arms are cylinders, but the placement is a bit tougher
    * because if we put them right on the surface of the body, the joint will stick out.
    * So, we do some approximating here. 
  * We use non-uniform scaling on the body, to make the sphere into an ellipse. 

## Summary: Key ideas

  * Build complex items out of boxes, spheres, cylinders,
    * and of course, other complex components built out of them. 
  * We can build up our scene out of a hierarchy of components. This is called the _scene graph_. 
  * Embedded frames make it possible to use the instance transform on higher-level components:
    * whole legs and teddy bears, instead of just a box. 
  * Embedded frames also make it possible to put the reference point (origin of the object) and axes wherever you like
    * so that you can position, rotate and scale however you like. 


## Exercise: Luxo family

 * This exercise highlights the idea of creating an instance of the `THREE.Object3D` class
   * to store a set of `THREE.Mesh` objects that represent the parts of a composite object
 * The `THREE.Object3D` container object can then be placed anywhere in a scene using the instance transforms
 * To begin, fork [luxo-start](https://codepen.io/asterix77/pen/ExjWjxN)
   * The pen contains a function named `luxo()` that creates a simple luxo lamp and adds it to a scene.
   * A green rug is also added to the scene.
 * Modify it to add a second "Luxo Jr."

### Exercise: Luxo family

  1. Modify the `luxo()` function to 
     * create an instance of a `THREE.Object3D` to serve as a container object 
     * add all meshes to this container object (instead of the scene) 
     * return the container object 
  2. Replace the single call to the `luxo()` function with code to create two luxo lamps, mom and junior, where 
     * mom is placed at location `(60,0,60)` in the scene's coordinate frame 
     * junior is half the size of mom, placed at scene location `(160,0,60)`, and rotated so that he is facing mom  

### Luxo family solution

<iframe height="601" style="width: 100%;" scrolling="no" title="Luxo family" src="https://codepen.io/asterix77/embed/abOJOzJ?height=601&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/abOJOzJ'>Luxo family</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>



## Exercise: Build a Tree as a Composite Object

Let's create a better tree (green cone with a brown cylindrical trunk) as a
composite object and place two of them in the scene.

  1. Start with this [town-forest-start](https://codepen.io/asterix77/pen/LYVWVpz?editors=1010) pen
     * press 'g' to see the ground plane for the scene
  2. Complete the function `createTree()` to create and return an instance of a tree, which should be a `THREE.Object3D` object 
  3. The following Three.js classes will be helpful here: 
     * [Mesh (geometry, material)](http://threejs.org/docs/#api/objects/Mesh)
     * [MeshBasicMaterial ( {color: color} )](http://threejs.org/docs/#api/materials/MeshBasicMaterial)
     * [ConeGeometry (radius, height)](http://threejs.org/docs/#api/geometries/ConeGeometry)
     * [CylinderGeometry (radiusTop, radiusBottom, height)](http://threejs.org/docs/#api/geometries/CylinderGeometry)
  4. Complete the code to position two trees **of different sizes** in the scene 

### Tree as composite object solution

<iframe height="601" style="width: 100%;" scrolling="no" title="Town forest" src="https://codepen.io/asterix77/embed/poJeJyJ?height=601&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/asterix77/pen/poJeJyJ'>Town forest</a> by Michael Mandel
  (<a href='https://codepen.io/asterix77'>@asterix77</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>