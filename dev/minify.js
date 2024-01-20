const fs = require("fs");

let i = 0;

function getSmallest_nonUsedString(charset) {
  charset ||= "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLXZCVBNM";

  j = Math.floor(i / (charset.length - 1));

  let string = charset[i % (charset.length - 1)] + (j > 0 ? charset[j - 1] : "");

  i++;

  return string;
}

function minifyNames(js) {
  let varNames_re = "(?<=(let|const|var|function) )\\w+";
  let paramNames_re = `(?<=[^i][^f]\\([\\w,="'{}]*)\\w+(?=[\\w,="'{}]*\\))`;
  let names_re = new RegExp(`${varNames_re}|${paramNames_re}`, "g");

  let names = js.match(names_re);

  console.log(names);

  names.forEach((name) => (js = js.replace(new RegExp(`(?<=\\W)${name}(?=\\W)`, "g"), getSmallest_nonUsedString())));

  return js;
}

function minifyJs(filePath) {
  let content = fs.readFileSync(filePath).toString();

  content = content
    .replace(/\/\*\*[^*][^/]*\*\//g, "")
    .replace(/\/\/[^\n]*\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\W\s+|\s+\W/g, (match) => match.replace(" ", ""));

  content = minifyNames(content);

  return fs.writeFile(filePath, content, () => console.log("writing done"));
}

module.exports = minifyJs;
