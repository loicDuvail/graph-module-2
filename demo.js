const canvas = document.getElementById("graph");

const poppins = new FontFace("Poppins", "url(src/fonts/poppins.woff2)");

let plane = [-15, 12, -40, 10];
const pg = new Plotgrid(canvas, plane);
pg.autoStep();

function pseudoRandData(start, end, dataRange = [0, 10]) {
  let data = [];
  for (let x = start; x <= end; x++) {
    let dtr = dataRange[1] - dataRange[0];
    data.push({ x, y: Math.round(Math.random() * dtr + dataRange[0]) });
  }
  return data;
}

// let data = pseudoRandData(-5, 17, [-3, 12]);
const data = [
  { x: -5, y: 1 },
  { x: -4, y: 7 },
  { x: -3, y: 2 },
  { x: -2, y: 8 },
  { x: -1, y: 8 },
  { x: 0, y: 6 },
  { x: 1, y: 9 },
  { x: 2, y: -15 },
  { x: 3, y: 7 },
  { x: 4, y: 8 },
  { x: 5, y: -2 },
  { x: 6, y: 5 },
];

let plotter = new Plotter(canvas);
plotter.addDataContext({
  main: true,
  data,
  plotStyle: "graph",
});

let test = () => {
  plotter.plot();
  // pg.drawGrid();
};

poppins
  .load()
  .then(() => {
    document.fonts.add(poppins);
    // checkAverageDuration(test, 10000);
    test();
  })
  .catch((err) => console.error(err));
