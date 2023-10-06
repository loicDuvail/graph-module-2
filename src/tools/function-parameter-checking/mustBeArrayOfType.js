/**
 * Throws an error if:
 *    -the "arg" array is not defined
 *    -the "arg" array is not an array
 *    -the "arg" array is not of precised length if a required length is precised
 *    -at least one value inside the "arg" array is not of the precised type
 *
 * Every error has its own error message, and points out where exactly was the error.
 * @param {Array} arg -The array to check.
 * @param {String} requiredType -The required type of every value inside "arg" array
 * @param {Number} [requiredLen] -Optional, the required length of the array
 * @param {String} [argName] -Optional, the name of the parameter, used to better display errors.
 * @returns 0 if no error thrown
 */
function argMustBeArrayOfType(arg, requiredType, requiredLen, argName = "") {
  // check if argument defined
  if (arg === undefined) throw new Error(`"${argName}" parameter undefined.\n`);

  //check if argument is array
  if (!Array.isArray(arg))
    throw new Error(`"${argName}" parameter must be an array\n`);

  // check if length match, if requiredLen is not falsy (undefined,null,0,false...)
  if (requiredLen)
    if (arg.length != requiredLen)
      throw new Error(
        `"${argName}" parameter must be an array of length ${requiredLen}.\n--> "${argName}" length: ${arg.length}\n`
      );

  // check if every arguments are of the required type
  let wrongTypeValsIndexes = [];
  arg.forEach((val, i) => {
    if (typeof val != requiredType.toLowerCase()) wrongTypeValsIndexes.push(i);
  });
  if (wrongTypeValsIndexes.length == 0) return 0;

  let errorMsg = `"${argName}" parameter must be an array of only ${requiredType}s.\n`;
  wrongTypeValsIndexes.forEach((i) => {
    let val = arg[i];
    let stringVal = typeof val == "string" ? `"${val}"` : val;
    errorMsg += `--> ${argName}[${i}]: ${stringVal}, type: "${typeof val}"\n`;
  });

  throw new Error(errorMsg);
}
