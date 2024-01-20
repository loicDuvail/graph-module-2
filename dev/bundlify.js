const fs = require("fs");
const p = require("path");

function getAllFiles(folderPath) {
  // get abs path of folder if given as relative
  folderPath = p.resolve(folderPath);

  const files = [];

  function recursive_getAllFiles(folderPath) {
    fs.readdirSync(folderPath).forEach((fileName) => {
      let filePath = p.join(folderPath, fileName);
      let isFolder = fs.statSync(filePath).isDirectory();
      // if file is a folder, don't add it to files[] but recurse the function
      // with it's path
      if (isFolder) recursive_getAllFiles(filePath);
      else files.push({ path: filePath, name: fileName });
    });
  }

  recursive_getAllFiles(folderPath);

  return files;
}

function orderFiles(files, order, options = { orderBy: "name" }) {
  let { orderBy } = options;
  return files.sort((f1, f2) => order.indexOf(f1[orderBy]) - order.indexOf(f2[orderBy]));
}

function bundlify(folderPath, bundlePath, options) {
  bundlePath = p.join(bundlePath, "bundle.js");
  const { filter, order, minifier } = options;
  let files = getAllFiles(folderPath);

  if (filter) files = files.filter(filter);
  if (order) files = orderFiles(files, order);

  console.log(files);

  let bundle = "";
  files.forEach((file) => (bundle += fs.readFileSync(file.path).toString()));

  fs.writeFile(bundlePath, bundle, () => {
    console.log("Successful bundlification!");
    if (minifier) {
      console.log("minifying");
      minifier(bundlePath);
    }
  });
}

let options = {
  filter: (file) => {
    let fn = file.name;
    let fileSuffix = fn.slice(fn.lastIndexOf("."));

    return fileSuffix === ".js" && fn != "bundle.js";
  },
  order: [
    "timeCheck.js",
    "typeCheck.js",
    "map.js",
    "deepMerge.js",
    "MathCanvas.js",
    "Grid.js",
    "PlotGrid.js",
    "Plotter.js",
    "demo.js",
  ],
  minifier: require("./minify"),
};

bundlify(p.resolve("../src"), p.resolve("../src/bundle"), options);
