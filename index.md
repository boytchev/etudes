This is a repository for the source code of various 3D programlets.

### Capping clipping [Three.js]
Once a student asked me how to cap clipped object without stencil buffers and without CSG. It appears it is possible to make fake capping by drawing the back faces of the models (they are seen through the clipped areas) in flat colour. [Live demo](threejs/capping-clipping.html). 

### Brain and motion [Three.js]
You know that animals' brains are wired in a way to detect motion. The human brain is no exception. We use motion to detect shape, position and orientation ot objects. Do not believe me? Try it for yourself [Live demo](threejs/brain-and-motion.html). 

### Negative morphs [Three.js]
Do you know that morph target influence could be negative? Thus the morth target will not attract, but repel the shape. This étude use three spheres as morth targets with user-defined interactive influence. [Live demo](threejs/negative-morphs.html). 

### Psychedelic tapeworm [Three.js]
A deformed sphere with 21 bones and fast lights are enough to create a psychedelic tapeworm. [Live demo](threejs/psychedelic-tapeworm.html). 

### Tentacle with suckers [Three.js]
Skinned mesh works fine with displacement and bump maps. The skeleton is responsible for the tentacle motion. The displacement map extrudes the suckers as 3D shapes. The bump map fixes the lighting. The trick is that the texture for the displacement and the bump is the same. [Live demo](threejs/tentacle-with-suckers.html). 

### Freezing cube [WebGL]
Textured can be used to represent time offsets. The cube in this étude changes its texture from [moss](webgl/freezing-cube/moss.jpg) to [ice](webgl/freezing-cube/frost.jpg) based on a [temporal texture](webgl/freezing-cube/time.jpg). Thus time factor of each texel is modified by the corresponding texel from the temporal texture. [Live demo](webgl/freezing-cube.html). 

### Rolling ball [Three.js]
Rolling a ball along a curved path requires rotation around a moving axis. This is achieved by using `rotateOnWorldAxis` on an axis perpendicular to the direction of rolling. The angle of rotation is the travelled distance devided by the ball's radius. [Live demo](threejs/rolling-ball.html). 

### Happy New Year [Three.js]
A small animated New Year greeting card for all Three.js-ers. [Live demo](threejs/happy-new-year.html). 

### Interference [WebGL]
Interference is the phenomenon when two or more waves interfere and create patterns of reinforced or cancelled displacements. This model overlaps bluish sine waves and reddish cosine waves [Live demo](webgl/interference.html). 

### Negative spave [Three.js]
Negative space is when the shape of an object is defined by the solid space around it. The object per se does not exist. This model of a negative space kanji is actually a homework assignment for my students. It is given 9 hours after they met Three.js and JavaScript for the first time. [Live demo](threejs/negative-space.html). 

### Matrix chaplet [WebGL]
Object data may not contain vertex coordinates at all. The data buffer of this étude contains the numbers 0 to 59 that define a circle, which is transformed by matrices into a chaplet. [Live demo](webgl/matrix-chaplet.html). 

### Jelly balls [Three.js]
A low-cost approximation of bouncing jelly balls uses the observation that a vertically compressed ball should expand horizontally. [Live demo](threejs/jelly-balls.html). 

### Look Ma, no quaternions [Three.js]
For free-walking on a sphere you can use pure Three.js vector arithmetic. No need to fight with quaternions, matrices, Euler angles and gimbal locks. Slide the mouse or your finger to see it in this [Live demo](threejs/look-ma-no-quaternions.html). 

### Minimalistic village [Three.js]
Sometimes simple minimalistic solutions provide enough complexity. A 2D upvote arrow shape could be extruded into a house. And then, multiple houses could be arranged in a small village. [Live demo](threejs/minimalistic-village.html). 

### Sine cheers [WebGL]
The sine curve can be used to define hundreds of rotational shapes. Do you know that the wine jug and the wine glass are among those shapes? See [here](webgl/sine-cheers-graph.jpg). Cheers! [Live demo](webgl/sine-cheers.html).

### Lantern [Three.js]
Constructive Solid Geometry ([CSG](https://en.wikipedia.org/wiki/Constructive_solid_geometry)) is a technique to build models by combining, subtracting or intersecting shapes. CSG also provides algebraic notation of models' construction. [Live demo](threejs/lantern.html). 

### Graphical integration [WebGL]
Every curved or bending surface could be represented by a set of small flat plates. This is the computer graphics analog to mathematical integration. [Live demo](webgl/graphical-integration.html).

### Bingo balls [Three.js]
Not all textures need to be loaded from files. These bingo balls get their textures drawn at startup via [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). [Live demo](threejs/bingo-balls.html). 

### Supersphere [WebGL]
Spheres, cubes, octahedrons ... are all instances of the supesphere X<sup><small>n</small></sup> + Y<sup><small>n</small></sup> + Z<sup><small>n</small></sup> = 1. [Live demo](webgl/supersphere.html).

### Crystal planet [Three.js]
A planet is created as a level-5 icosahedron with a randomized geometry &ndash; actually, only the distance to the center is randomized. [Live demo](threejs/crystal-planet.html). 

### Neon tori [WebGL]
Using shader to generate neonish shiny surface of a torus. Colour stripes are defined by the direction of the reflection rays. [Live demo](webgl/neon-tori.html).

### Snowing [Three.js]
A simple model of snowing scene. The snowflake's texture is generated programmatically. [Live demo](threejs/snowing.html). 

### Hearts [WebGL]
One of the most aesthetically pleasing heart curve is defined by (x<sup>2</sup>+y<sup>2</sup>-1)<sup>3</sup>-x<sup>2</sup>y<sup>3</sup>=0. Let's improvise on it. [Live demo](webgl/hearts.html).

### Negative Light [Three.js]
Three.js allows negative intensities of lights. This might be used to simulate circular soft shadows. [Live demo](threejs/negative-light.html).

