---
layout: default
title: Demos
---
## Examples

This is a list of the most important demos we have available to you, along with what they show.

### Template

If you just want a minimal template file to get started on your programming, try this [template file](Early/template.html).

### Barn

- [the barn, using TW](barn-tw.html). This is our earliest, simplest example. It builds a barn, with the colors of the faces corresponding to the orientation of the face (that is, the surface normal). It uses the TW module to simplify things like the camera setup.
- [the barn, documented](Early/barn-tw-documented.shtml). This is the same code, with code pretty-printed into the document, so you can view it more easily.

### Early

- [axes](Early/axes.html). This very simple example is just to show the three-dimensional coordinate system that we use.
- [single color barn](Early/barn-color1.html). This shows a barn in which the barn is just a single color, but one you can specify. Consequently, it's about direct-color specification.
- [multi-colored barn](Early/barn-color-multi.html). This is a different barn geometry, where each face has a different color index into a list of colors, showing how different faces of an object can have different colors that you specify.

### Color

- [color cube](Color/colorcube.html). Shows the RGB color cube.
- [color cones](Color/colorcones.html). Shows the two HLS color cones. Also demonstrates interacting with your model using keyboard callbacks.
- [triangle interpolation](Color/triangleInterpolation.shtml). Shows colors interpolating (smooth shading) over a triangle.
- [triangle interpolation 2](Color/triangleInterpolation2.shtml). Shows two adjoining triangles, with the colors at the common edge consistent.
- [triangle interpolation 2b](Color/triangleInterpolation2b.shtml). Shows two adjoining triangles, but with the colors at the common edge in-consistent.

### Basic Modeling

- [Barn Instance Transform](BasicModeling/barn-instance-transform-dat.html). This shows how to use the set() methods of an Object's position, rotation, and scale to modify an instance. These properties are defined by [THREE.Object3D() ](https://threejs.org/docs/index.html#api/core/Object3D). This demo uses a GUI to modify the 9 parameters.
- [Plane, Box and Sphere](BasicModeling/PlaneBoxSphere.html). This shows one of each of those geometries, without any instance transformation supplied.
- [polygonal sphere](BasicModeling/polygonalSphere.html). This shows a sphere, with a GUI to try different widthSegments and heightSegments.
- [Blocks](BasicModeling/Blocks.html). This shows an arrangement of blocks, showing the essentials of the instance transformation (translate, rotate, scale), to create a variety of instances of a particular geometrical object.
- [Cylinder Rotation](BasicModeling/CylinderRotation.shtml). This shows how you can rotate a cylinder either around its middle or around its end, by using a nested coordinate object. The demo has a GUI to modify the rotations.
- [Leg](BasicModeling/Leg1.shtml). This shows how you can create a complex nested object, comprising three cylinders. The demo has a GUI to modify the joint angles rotations.
- [Fence](BasicModeling/Fence.shtml). This shows how you can create an object by cloning, translating and adding to a container object.
- [Curved Fence](BasicModeling/Fence-curved.shtml). This shows how you can create an object by cloning, translating, rotating and adding to a container object.
- [Snow Person](BasicModeling/SnowPerson.html). This shows how to compose a graphics object from existing geometrical objects; in this case, three spheres and a cone. This is one of our simplest compositional objects. It also allows toggling of a global wireframe parameter, which shows how to set up a keyboard callback to do that.
- [Teddy Bear](BasicModeling/TeddyBear-composite.shtml). This shows how to compose a bear from spheres and tubes. A bit more complex than the snow person.

### Camera API

A few demos to help understand cameras:

- [visualization of a frustum](Camera/frustum.shtml)
- [camera api](Camera/camera-api.shtml) a demo of viewing a teddy bear, where you can modify the camera parameters via a GUI.
- [Simple Camera without TW](Camera/simpleCameraWithoutTW.html) shows how to set up a camera using the raw THREE.js API.
- [Simple Camera with TW](Camera/simpleCameraWithTW.html) shows how to set up a camera using TW.mainInit, which is a little easier.

### Material and Lighting

- [Teddy Bear, with material and lighting](MaterialLighting/TeddyBear.shtml). There's also a GUI to turn the lights on and off.
- [Jewel and Ball](MaterialLighting/JewelAndBall.shtml). Demonstrates the difference between flat and smooth shading.
- [Material Parameters](MaterialLighting/MaterialParameters.shtml). A tutor for material parameters.
- [Spotlight Tutor](MaterialLighting/spotlight.html) shows all the parameters of a spotlight.

### Texture Mapping

- [tutor-r80](TextureMapping/tutor-r80.html) shows a demo texture and allows you to adjust the texture parameters and the wrap setting.
- [Plane Flags](TextureMapping/plane-flags.html) shows computed textures (flags) on a plane.
- [Plane Flags v2](TextureMapping/plane-flags-v2.html) shows computed textures (flags) on a plane, but this time adjusting the texture coordinates so that the gray part of the US flag texture is omitted.
- [PlaneBuffy](TextureMapping/PlaneBuffy.html) shows an image (Buffy) on a plane.
- [PlaneBuffyTW](TextureMapping/PlaneBuffyTW.html) shows an image (Buffy) on a plane using the TW.loadTexture function
- [PlaneBuffyRepeating](TextureMapping/PlaneBuffyRepeating.html) shows multiple repetitions of an image (Buffy) on a plane.
- [PlaneBuffyAngel](TextureMapping/PlaneBuffyAngel.html) shows several images on several planes, built at once using the TW.loadTextures function.
- [Plane Harry](TextureMapping/PlaneHarry.html) _fails_ to shows an image (Harry Potter) on a plane, due to the browser's Same Origin Security Policy.
- [Mikey Cube](TextureMapping/mikeycube/threejsCube_multiTex.html) shows a texture on each side of a cube.

### Animation

- [bouncing ball](Animation/bouncingBall0.html)
- [rolling ball](Animation/rollingBall-controls.html)
- [moving, bouncing ball](Animation/movingBouncingBall-controls.html)
- [stop bouncing ball](Animation/stopBouncingBall-controls.html)
- [control cube](Animation/control-cube.html)
- [mass spring](Animation/mass-spring.html)
- [UFO](Animation/UFO.html)
- Cars
    - [cars v1](Animation/cars.html)
    - [cars v2, with an API for generic animated scene objects](Animation/cars2/cars2.html)
    - [cars v3, like v2 but adding acceleration (speeding up and braking)](Animation/cars3/cars3.html)

### Curves and Surfaces

- [S curve 1](CurvesAndSurfaces/s-curve1.html) the simplest, 2D Bezier curve demo
- [S curve 2](CurvesAndSurfaces/s-curve2.html) the previous demo, but with a GUI added, so you can play with all the controls
- [S curve 3](CurvesAndSurfaces/s-curve3.html) a simple demo, but in 3D, not 2D
- [dome-surface1.html](CurvesAndSurfaces/dome-surface1.html) a demo of a 2D surface, a dome.
- [flag.html](CurvesAndSurfaces/flag.html) a flag texture-mapped onto a 2D surface looking vaguely like a flag flapping in the wind.

### Interaction

- [events.html](Interaction/events.html) show what mouse events are happening. Also shows keyPress events.
- [click.html](Interaction/click.html) interacts with a scene using a (shift+) mouse click.

### Source

This page is based on <https://cs.wellesley.edu/~cs307/threejs/demos/all-demos.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 
