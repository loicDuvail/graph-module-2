let defaultPadding = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

/**
 * Creates an object with methods to draw in canvas passed as argument.
 *
 * The y axis is inverted (goes from bottom to top) to follow math graphing conventions.
 *
 * A plane can be defined for the MathCanvas instantiation,
 * which maps every input coordinates passed to drawing methods
 * from the given plane to the actual pixel canvas dimensions.
 */
class MathCanvas {
  #plane;
  #mode = "normal";
  #padding;
  /**
   * @param {HTMLCanvasElement} canvas The canvas element the class methods will draw in
   * @param {Array<Number>} [plane] Optional, the plane from which to map drawing
   * coordinates to canvas pixel coordinates
   */
  constructor(canvas, plane) {
    if (!canvas) throw new Error("Canvas parameter cannot be null.");
    if (plane) this.#checkPlaneType(plane);

    this.canvas = canvas;
    this.c = this.#setupCanvas();
    this.setPlane(plane);
  }

  /**
   * Sets up the canvas for high PPI (Pixel Per Inch) devices
   * and returns a scaled rendering context, to preserve same drawing size render-time
   * on any device.
   * @returns {CanvasRenderingContext2D} The scaled canvas rendering context.
   */
  #setupCanvas() {
    const { canvas } = this;
    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    let c = canvas.getContext("2d");
    c.scale(dpr, dpr);

    return c;
  }

  /**
   * Throws an error if plane parameter is not an array of 4 numbers
   * @param {*} plane The argument that will be verified as a plane or not
   */
  #checkPlaneType(plane) {
    argMustBeArrayOfType(plane, "number", 4, "plane");
  }

  /**
   * Sets a new input plane for the MathCanvas instantiation.
   *
   * plane defaults to canvas dimension ( [0,<canvas client width>,0,<canvas client height>] )
   * @param {Array<Number>} plane plane = [xmin,xmax,ymin,ymax]
   */
  setPlane(plane) {
    if (!plane) {
      const r = this.canvas.getBoundingClientRect();
      plane = [0, r.width, 0, r.height];
    }

    if (this.#mode != "performance") this.#checkPlaneType(plane);

    this.#plane = plane;

    return plane;
  }

  /**
   * Sets a padding for the canvas.
   * @param padding
   */
  setPadding(padding = defaultPadding) {
    padding = deepMerge({ ...defaultPadding }, padding);

    this.#padding = padding;
  }

  /**
   * Sets the performance mode for the MathCanvas instantiation
   *
   * If set to "performance", no type checking will be made,
   * should be used after testing in "normal" mode.
   * @param {String} mode "normal" | "performance"
   */
  setMode(mode = "normal") {
    this.#mode = mode;
  }

  /**
   * Maps input coordinates from plane to actual canvas dimensions
   * @param {Number} x The x component of the coordinates to map to pixel value
   * @param {Number} y The y component of the coordinates to map to pixel value
   * @returns {[Number,Number]} [x,y], the input values mapped to pixel position
   */
  #mapCoords([x, y]) {
    if (this.#mode != "performance")
      argsMustBeOfType([x, y], "number", ["x", "y"]);

    let [xmin, xmax, ymin, ymax] = this.#plane;
    const pad = this.#padding;
    const padTotX = pad.left + pad.right;
    const padTotY = pad.top + pad.bottom;

    // input coords bounded to avoid overflow when non-null padding
    if (x < xmin) x = xmin;
    if (x > xmax) x = xmax;
    if (y < ymin) y = ymin;
    if (y > ymax) y = ymax;

    let r = this.canvas.getBoundingClientRect();
    let w = r.width;
    let h = r.height;
    // maps x and y from plane range to canvas actual px range
    // coords are always mapped to multiples of 0.5, in order
    // to render cleaner vertical and horizontal lines
    let mappedX =
      Math.floor(map(x, [xmin, xmax], [0, w - padTotX])) + 0.5 + pad.left;
    // h and 0 swapped to invert y axis
    let mappedY =
      Math.floor(map(y, [ymin, ymax], [h - padTotY, 0])) + 0.5 + pad.top;

    return [mappedX, mappedY];
  }

  /**
   * Draws a line in the defined plane
   * @param {[Number,Number]} from [x,y] coordinates of the start of the line
   * @param {[Number,Number]} to [x,y] coordinates of the end of the line
   * @param [style]
   */
  line(from, to, style = { color: "black", lineWidth: 1 }) {
    if (this.#mode != "performance") {
      argMustBeArrayOfType(from, "number", 2, "from");
      argMustBeArrayOfType(to, "number", 2, "to");
      argMustBeOfType(style, "object", "style");
    }

    const { c } = this;
    from = this.#mapCoords(from);
    to = this.#mapCoords(to);
    c.strokeStyle = style.color || "black";
    c.lineWidth = style.lineWidth || 1;

    c.beginPath();
    c.moveTo(...from);
    c.lineTo(...to);
    c.stroke();
  }

  /**
   * Either fills or strokes a rectangle, going from (x,y) to (x+w,y+h)
   * in the defined plane.
   * @param {Number} x x component of the start coordinates of the rectangle
   * @param {Number} y y component of the start coordinates of the rectangle
   * @param {Number} w width of the rectangle (can be negative)
   * @param {Number} h height of the rectangle (can be negative)
   * @param [style] Optional, text styling and position.
   */
  rect(x, y, w, h, style = { color: "black", fill: false, lineWidth: 1 }) {
    if (this.#mode != "performance") {
      argsMustBeOfType([x, y, w, h], "number", ["x", "y", "w", "h"]);
      argMustBeOfType(style, "object", "style");
    }

    let p = this.#plane;
    const r = this.canvas.getBoundingClientRect();
    [x, y] = this.#mapCoords([x, y]);

    w = parseInt(map(w, [0, p[1] - p[0]], [0, r.width]));
    h = parseInt(map(h, [0, p[3] - p[2]], [0, r.height]));

    const { c } = this;
    c.beginPath();
    if (style.fill) {
      c.fillStyle = style.color || "black";
      c.fillRect(x, y, w, -h);
    } else {
      c.strokeStyle = style.color || "black";
      c.lineWidth = style.lineWidth || 1;
      c.rect(x, y, w, -h);
      c.stroke();
    }
  }

  /**
   * Either fills or stroke text, on (x,y) coordinates in the defined plane.
   * @param {String} txt The text to render.
   * @param {Number} x The x component of the text coordinates.
   * @param {Number} y The y component of the text coordinates.
   * @param {*} [style] Optional, text styling and position.
   */
  text(
    txt,
    x,
    y,
    style = {
      fill: true,
      text: {
        color: "black",
        lineWidth: 1,
        font: "15px Arial",
        baseline: "middle",
        align: "center",
        outline: false,
        outlineColor: "red",
      },
      position: {
        marginLeft_px: 0,
        marginTop_px: 0,
        stayInBound: true,
        inBoundMargin_px: 20,
      },
    }
  ) {
    if (this.#mode != "performance") {
      argsMustBeOfType([x, y], "number", ["x", "y"]);
      argMustBeOfType(txt, "string", "txt");
      argMustBeOfType(style, "object", "style");
    }

    const [cw, ch] = [this.canvas.width, this.canvas.height];
    const { c } = this;

    [x, y] = this.#mapCoords([x, y]);

    if (style.position) {
      let sp = style.position;

      x += sp.marginLeft_px || 0;
      y += sp.marginTop_px || 0;

      // if stayInBound true, x and y are bounded between 0 + inBoundMargin
      // and canvas.<width|height> - inBoundMargin
      if (sp.stayInBound) {
        let ibm = sp.inBoundMargin_px;
        if (x < ibm) x = ibm;
        if (x > cw - ibm) x = cw - ibm;
        if (y < ibm) y = ybm;
        if (y > ch - ibm) y = ch - ibm;
      }
    }

    let st = style.text;

    c.textAlign = st ? st.textAlign || "center" : "center";
    c.textBaseline = st ? st.baseline || "middle" : "middle";
    c.font = st ? st.font || "15px Arial" : "15px Arial";

    c.beginPath();
    if (style.fill !== false) {
      c.fillStyle = st ? st.color || "black" : "black";
      c.fillText(txt, x, y);
    } else {
      c.strokeStyle = st ? st.color || "black" : "black";
      c.strokeText(txt, x, y);
    }
  }

  /**
   * Either fills or strokes an arc, on (x,y) coordinates in the defined plane.
   * @param {Number} x The x component of the arc coordinates.
   * @param {Number} y The y component of the arc coordinates.
   * @param {Number} radius_px The radius of the arc in pixels.
   * @param {Number} startAngle start angle of arc
   * @param {Number} endAngle end angle of arc
   * @param {Boolean} [counterclockwise] Optional, wether to arc counterclockwise or not, defaults to false
   * @param [style] Optional, style of the arc, defaults to {color:"black", lineWidth:1, fill:false}
   */
  arc(
    x,
    y,
    radius_px,
    startAngle,
    endAngle,
    counterclockwise,
    style = {
      color: "black",
      lineWidth: 1,
      fill: false,
    }
  ) {
    if (this.#mode != "performance") {
      argsMustBeOfType([x, y, radius_px, startAngle, endAngle], "number", [
        "x",
        "y",
        "radius_px",
        "startAngle",
        "endAngle",
      ]);
      argMustBeOfType(counterclockwise, "boolean", "counterclockwise");
      argMustBeOfType(style, "object", "style");
    }

    [x, y] = this.#mapCoords([x, y]);
    const { c } = this;

    c.arc(x, y, radius_px, startAngle, endAngle, counterclockwise);

    if (style.fill) {
      c.fillStyle = style.color || "black";
      c.fill();
    } else {
      c.lineWidth = style.lineWidth || 1;
      c.strokeStyle = style.color || "black";
      c.stroke();
    }
  }

  /**
   * clears the canvas
   */
  clear() {
    let r = this.canvas.getBoundingClientRect();
    this.c.clearRect(0, 0, r.width, r.height);
  }

  /**
   * Sets a background color for the canvas
   * @param {String} color
   */
  setBackground(color) {
    const p = this.#plane;
    this.rect(p[0], p[2], p[1] - p[0], p[3] - p[2], {
      fill: true,
      color,
    });
  }
}
