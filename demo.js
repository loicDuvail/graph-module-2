const canvas = document.getElementById("graph");

const poppins = new FontFace("Poppins", "url(src/fonts/poppins.woff2)");

const m = new MathCanvas(canvas);
let plane = [0, 10, -5, 5];
m.setPlane(plane);
m.setMode("normal");

let test = () => {
  m.setBackground("rgba(50,200,60,0.4)");
  m.line([1, -5], [1, 5], { color: "black", lineWidth: 1 });
  m.line([0, 0], [10, 0]);
  m.text("aaa", 5, 0, {
    text: {
      font: "20px Poppins",
      fill: true,
    },
  });
  m.arc(5, 0, 10, 0, 2 * Math.PI, false, {
    color: "rgba(50,200,60,0.4)",
    fill: true,
  });
};

poppins
  .load()
  .then(() => {
    document.fonts.add(poppins);
    // checkAverageDuration(test, 10000);
    test();
  })
  .catch((err) => console.error(err));
