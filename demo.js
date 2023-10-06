const canvas = document.getElementById("graph");

const poppins = new FontFace("Poppins", "url(src/fonts/poppins.woff2)");

poppins
  .load()
  .then(() => {
    document.fonts.add(poppins);
    const m = new MathCanvas(canvas);
    let plane = [0, 10, -5, 5];
    m.setPlane(plane);
    m.line([1, -5], [1, 5], { color: "black", lineWidth: 1 });
    m.line([0, 0], [10, 0]);
    m.rect(0, 0, 2, 2, { color: "black", fill: false });
    m.text("aaa", 5, 0, {
      text: {
        font: "20px Poppins",
        fill: true,
      },
    });
  })
  .catch((err) => console.error(err));
