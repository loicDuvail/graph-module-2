const canvas = document.getElementById("graph");

const poppins = new FontFace("Poppins", "url(src/fonts/poppins.woff2)");

let plane = [-5, 5, -10, 10];
const grid = new Grid(canvas, plane, {
  subGridLines: {
    vertical: {
      displayed: true,
    },
    horizontal: {
      displayed: true,
    },
  },
});
grid.changeSettings({
  gridLines: {
    vertical: { displayed: true },
    horizontal: { displayed: true },
  },
});
grid.setMode("performance");

let test = () => {
  grid.drawGrid();
};

poppins
  .load()
  .then(() => {
    document.fonts.add(poppins);
    // checkAverageDuration(test, 10000);
    test();
  })
  .catch((err) => console.error(err));
