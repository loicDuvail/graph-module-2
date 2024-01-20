class Plotter {
  #plotGrid;
  #graphCanvas;
  #dctxs = [];
  constructor(canvas, settings) {
    this.#plotGrid = new Plotgrid(
      canvas,
      null,
      settings || defaultGridSettings
    );
    this.#graphCanvas = new MathCanvas(canvas);
    this.#graphCanvas.setPadding(this.#plotGrid.getPadding());
  }

  addDataContext(dataContext) {
    this.#dctxs.push(dataContext);
  }

  plot() {
    this.#graphCanvas.clear();
    this.#plotGrid.clear();

    for (const dctx of this.#dctxs) {
      if (dctx.plotStyle == "graph" && !!dctx.data[0]) {
        let data = dctx.data;
        data.sort((a, b) => a.x - b.x);

        if (!!dctx.main) {
          let dataYOrdered = [...data].sort((a, b) => a.y - b.y);
          let plane = [
            data[0].x,
            data[data.length - 1].x,
            dataYOrdered[0].y,
            dataYOrdered[dataYOrdered.length - 1].y,
          ];
          console.log(plane);

          this.#graphCanvas.setPlane(plane);
          this.#plotGrid.setPlane(plane);
          this.#plotGrid.autoStep();
          this.#graphCanvas.rect(
            plane[0],
            plane[2],
            plane[1] - plane[0],
            plane[3] - plane[2],
            {
              color: "white",
              fill: true,
            }
          );
          this.#plotGrid.drawGrid();
        }

        let lastPoint = data[0];
        for (const point of data) {
          this.#graphCanvas.line(
            [lastPoint.x, lastPoint.y],
            [point.x, point.y],
            { color: dctx.color || "red", lineWidth: dctx.lineWidth || 1 }
          );
          lastPoint = point;
        }
      }
    }
  }
}
