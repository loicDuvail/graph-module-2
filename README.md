# Data-visualisation library

## Goal

The goal of this library is to be able to easely render 2 and 3 dimensional visual representations of data on a cartesian-coordinate-system.

## folder architecture

- bundle

* bundle.js is a minified version of every js files in dependency order

- canvas

* MathCanvas.js offers a class which is an extension of a 2d canvas rendering context, in order to easely drawing shapes in a mathematical standard approach.
  It possesses a setPlane method, which sets a virtual plane in which to draw. Instead of using pixel coordinates, one can then set a arbitrary plane (\[xmin, xmax, ymin, ymax\]) and use coordinates inside this virtual when using MathCanvas.&lt;some-drawing-method&gt;, which will be internally mapped to actual pixel coordinates and then drawn on the canvas.
* Grid.js offers a grid class, that can draw any cartesian coordinates grid. It depends styling settings (for colors, lineWidth, which line is displayed...) and of geometrical settings (virtual distance between grid lines, number of subgrid lines...).

## License

Coded by Loic Duvail, 2023
