function checkAverageDuration(callback, tries = 100) {
  let sym = callback.name + "()";
  console.time(sym);
  for (let i = 0; i < tries; i++) {
    callback();
    console.timeLog(sym, `try: ${i}`);
  }
  console.timeEnd(sym);
}
