class Plotgrid {
  #mode = "normal";
  #grid;
  #settings;
  #plane;
  #xStep;
  #yStep;
  #xStep_str;
  #yStep_str;
  #xSubsections;
  #ySubsections;
  #xValCtx;
  #yValCtx;
  #possibleBases = [1, 2, 5];
  #padding = {};

  constructor(canvas, plane, settings = defaultGridSettings) {
    this.canvas = canvas;

    this.#grid = new Grid(canvas);
    this.#xValCtx = new MathCanvas(canvas);
    this.#yValCtx = new MathCanvas(canvas);

    this.setPlane(plane);

    this.#settings = { ...defaultGridSettings };
    deepMerge(this.#settings, settings);
    this.#grid.changeSettings({
      axis: { x: { displayed: false }, y: { displayed: false } },
      subGridLines: {
        horizontal: { displayed: true },
        vertical: { displayed: false },
      },
    });

    this.#padding = {
      left: 50,
      right: 30,
      bottom: 25,
      top: 10,
    };

    //! TEMPORARY, setting default padding to let room for grid values
    this.#grid.setPadding(this.#padding);
    this.#xValCtx.setPadding({
      left: 50,
      right: 30,
    });
    this.#yValCtx.setPadding({
      top: 10,
      bottom: 25,
    });
  }

  setPlane(plane) {
    plane = this.#grid.setPlane(plane);
    this.#xValCtx.setPlane(plane);
    this.#yValCtx.setPlane(plane);
    this.#plane = plane;
  }

  setXStep(xStep) {
    this.#xStep = xStep;
    this.#grid.setXStep(xStep);
  }
  setYStep(yStep) {
    this.#yStep = yStep;
    this.#grid.setYStep(yStep);
  }

  autoStep() {
    const { step_px } = this.#settings;
    const p = this.#plane;
    const pb = this.#possibleBases;

    const idealRowNb = this.canvas.height / step_px;
    const idealColNb = this.canvas.width / step_px;
    const xInterval = p[1] - p[0];
    const yInterval = p[3] - p[2];

    let xStep = 1,
      yStep = 1;
    let pow;

    let i = 0;
    while (xInterval / xStep > idealColNb) {
      pow = Math.floor(i / pb.length);
      let base = pb[i % pb.length];
      xStep = base * 10 ** pow;
      i++;
    }
    this.#xStep_str = pow > 3 ? base + "10^" + pow : xStep;
    this.setXStep(xStep);

    i = 0;
    while (yInterval / yStep > idealRowNb) {
      pow = Math.floor(i / pb.length);
      let base = pb[i % pb.length];
      yStep = base * 10 ** pow;
      i++;
    }
    this.#yStep_str = pow > 3 ? base + "10^" + pow : yStep;
    this.setYStep(yStep);
  }

  getPadding() {
    return this.#padding;
  }

  drawGridValues() {
    let xc = this.#xValCtx;
    let yc = this.#yValCtx;
    let p = this.#plane;
    let xs = this.#xStep;
    let ys = this.#yStep;

    // draw x values
    for (let x = p[0] - (p[0] % xs); x <= p[1]; x += xs) {
      xc.text(x, x, p[2], {
        text: { baseline: "bottom" },
      });
    }

    // draw y values
    for (let y = p[2] - (p[2] % ys); y <= p[3]; y += ys) {
      yc.text(y, p[2], y, {
        text: { align: "center", baseline: "middle" },
      });
    }
  }

  drawGrid() {
    this.#grid.drawGrid();
    this.drawGridValues();
  }

  clear() {
    this.#grid.clear();
    this.#xValCtx.clear();
    this.#yValCtx.clear();
  }
}
