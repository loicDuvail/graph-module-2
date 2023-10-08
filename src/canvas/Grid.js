let defaultGridSettings = {
  gridLines: {
    vertical: {
      displayed: true,
      color: "grey",
      lineWidth: 0.5,
    },
    horizontal: {
      displayed: true,
      color: "grey",
      lineWidth: 0.5,
    },
  },
  subGridLines: {
    vertical: {
      displayed: true,
      color: "lightGrey",
      lineWidth: 0.5,
    },
    horizontal: {
      displayed: true,
      color: "lightGrey",
      lineWidth: 0.5,
    },
  },
  axis: {
    x: {
      displayed: true,
      color: "black",
      lineWidth: 1,
    },
    y: {
      displayed: true,
      color: "black",
      lineWidth: 1,
    },
  },
};

class Grid {
  #mode = "normal";
  #m;
  #plane;
  #xStep = 2.5;
  #yStep = 5;
  // number of subgrid lines
  #xSubsections = 4;
  #ySubsections = 4;

  constructor(canvas, plane, settings = defaultGridSettings) {
    this.#m = new MathCanvas(canvas);
    this.setPlane(plane);

    // set settings to default then modify only the properties defined
    // in "settings" parameter
    this.settings = defaultGridSettings;
    deepMerge(this.settings, settings);
  }

  /**
   * Only overwrites settings existing in both this.settings
   * and newSettings argument
   * @param {Object} newSettings
   */
  changeSettings(newSettings) {
    deepMerge(this.settings, newSettings);
  }

  /**
   * Sets the performance mode for the MathCanvas instantiation
   *
   * If set to "performance", no type checking will be made,
   * should be used after testing in "normal" mode.
   * @param {String} mode "normal" | "performance"
   */
  setMode(mode = "normal") {
    this.#m.setMode(mode);
    this.#mode = mode;
  }

  /**
   * Sets a new input plane for the Grid instantiation.
   *
   * plane defaults to canvas dimension ( [0,<canvas client width>,0,<canvas client height>] )
   * @param {Array<Number>} plane plane = [xmin,xmax,ymin,ymax]
   */
  setPlane(plane) {
    // error handling made by m.setPlane

    // if plane not defined, m.setPlane returns
    // a default plane, otherwise the unmodified plane
    plane = this.#m.setPlane(plane);
    this.#plane = plane;
  }

  setXStep(xStep) {
    if (this.#mode != "performance") argMustBeOfType(xStep, "number", "xStep");
    this.#xStep = xStep;
  }
  setYStep(yStep) {
    if (this.#mode != "performance") argMustBeOfType(yStep, "number", "yStep");
    this.#yStep = yStep;
  }
  setXSubsections(xSubsections) {
    if (this.#mode != "performance") argMustBeOfType(xStep, "number", "xStep");
    this.#xSubsections = xSubsections;
  }
  setYSubsections(ySubsections) {
    if (this.#mode != "performance") argMustBeOfType(yStep, "number", "yStep");
    this.#ySubsections = ySubsections;
  }

  translate(x, y) {
    if (this.#mode != "performance")
      argsMustBeOfType([x, y], "number", ["x", "y"]);

    x ||= 0;
    y ||= 0;

    const p = this.#plane;
    this.setPlane([p[0] - x, p[1] - x, p[2] - y, p[3] - y]);
  }

  /**
   * Draws axis of the current plane,
   * following the current grid setting
   */
  #drawAxis() {
    const { x: xAxis, y: yAxis } = this.settings.axis;
    const p = this.#plane;
    const m = this.#m;

    if (xAxis.displayed) {
      m.line([p[0], 0], [p[1], 0], {
        color: xAxis.color,
        lineWidth: xAxis.lineWidth,
      });
    }
    if (yAxis.displayed) {
      m.line([0, p[2]], [0, p[3]], {
        color: yAxis.color,
        lineWidth: yAxis.lineWidth,
      });
    }
  }

  /**
   * Draws a grid of the current plane,
   * following the current grid setting
   */
  drawGrid() {
    const { gridLines: gs, subGridLines: ss, axis: as } = this.settings;
    const m = this.#m;
    const p = this.#plane;
    const xStep = this.#xStep;
    const yStep = this.#yStep;
    const xs = this.#xSubsections;
    const ys = this.#ySubsections;

    m.clear();

    for (let y = p[2] - (p[2] % yStep) - yStep; y <= p[3]; y += yStep) {
      if (ss.horizontal.displayed)
        for (let i = gs.horizontal.displayed ? 0 : 1; i < ys; i++) {
          let subLineY = y + (i * yStep) / ys;
          m.line([p[2], subLineY], [p[3], subLineY], {
            color: ss.horizontal.color,
            lineWidth: ss.horizontal.lineWidth,
          });
        }

      if (gs.horizontal.displayed) {
        m.line([p[2], y], [p[3], y], {
          color: gs.horizontal.color,
          lineWidth: gs.horizontal.lineWidth,
        });
      }
    }

    for (let x = p[0] - (p[0] % xStep) - xStep; x <= p[1]; x += xStep) {
      if (ss.vertical.displayed)
        for (let i = gs.vertical.displayed ? 0 : 1; i < xs; i++) {
          let subLineX = x + (i * xStep) / xs;
          m.line([subLineX, p[2]], [subLineX, p[3]], {
            color: ss.vertical.color,
            lineWidth: ss.vertical.lineWidth,
          });
        }

      if (gs.vertical.displayed) {
        m.line([x, p[2]], [x, p[3]], {
          color: gs.vertical.color,
          lineWidth: gs.vertical.lineWidth,
        });
      }
    }

    this.#drawAxis();
  }
}
