# Data-visualisation library

## Goal

The goal of this library is to be able to easely render 2 and 3 dimensional visual representations of data on a 2d cartesian-coordinate-system.
This must be made possible by the use of a single Plotter class.

ex:

```javascript
const canvas = document.getElementById("canvas");

const data = [
  { x: -5, y: 1 },
  { x: -4, y: 7 },
  { x: -3, y: 2 },
  { x: -2, y: 8 },
  { x: -1, y: 8 },
  { x: 0, y: 6 },
  { x: 1, y: 9 },
  { x: 2, y: -1 },
  { x: 3, y: 7 },
  { x: 4, y: 8 },
  { x: 5, y: -2 },
  { x: 6, y: 12 },
  { x: 7, y: 10 },
  { x: 8, y: 3 },
  { x: 9, y: 4 },
  { x: 10, y: 0 },
  { x: 11, y: -2 },
  { x: 12, y: -1 },
  { x: 13, y: 0 },
  { x: 14, y: -1 },
  { x: 15, y: 0 },
  { x: 16, y: 11 },
  { x: 17, y: 6 },
];

const plot = new Plotter();

plot.addDataContext({
  main: true, // indicates if the grid should be based on this dataContext
  data,
  plotStyle: "graph",
});
```

## folder architecture

- bundle [->](src/bundle/)

  - [bundle.js](src/bundle/bundle.js) is a minified version of every js files in dependency order

- canvas [->](src/canvas)

  - [MathCanvas.js](src/canvas/MathCanvas.js) offers a class which is an extension of a 2d canvas rendering context, in order to easely drawing shapes in a mathematical standard approach.  
    It possesses a setPlane method, which sets a virtual plane in which to draw.  
     Instead of using pixel coordinates, one can then set a arbitrary plane (\[xmin, xmax, ymin, ymax\]) and use coordinates inside this virtual when using MathCanvas.&lt;some-drawing-method&gt;, which will be internally mapped to actual pixel coordinates and then drawn on the canvas.
  - [Grid.js](src/canvas/Grid.js) offers a grid class, that can draw any cartesian coordinates grid. It depends styling settings (for colors, lineWidth, which line is displayed...) and of geometrical settings (virtual distance between grid lines, number of subgrid lines...).

## License

Coded by Loic Duvail, 2023
