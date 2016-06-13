Three.js Camera Spline Follower
===============================

This file makes it easy to have a Three.js camera follow a given open or closed [spline](https://en.wikipedia.org/wiki/Spline_(mathematics)) (curve). 

This code is a modification of [this example](http://threejs.org/examples/#webgl_geometry_extrude_splines) in the Three.js documentation, which can also be viewed [on GitHub](https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html).

___

### Usage

First include the `follow-spline` JS file.

Then inside your JS make sure to do the following on initialization:

```
// Set your camera you want to use to the camera that is returned from
// the initialization function
camera = initFollowCamera(<scene>, [offset from center of curve], [look ahead boolean]);

// Create the object from the curve given
addTube(spline, segNum, closeBool, radSeg, color, geoSide, scaleVar)
addTube(<curve>, [number of segments], [closed or not boolean], [number of radius segments], [mesh to use], [scale], [side to render], [color]);

```

And inside of your render function make sure to call `renderFollowCamera();`

That's it!

___

For a full example, [look at this CodePen](http://codepen.io/Zeaklous/pen/JKXpzy?editors=0010) or download the files and open `/examples/index.html` in a web browser that runs WebGL.