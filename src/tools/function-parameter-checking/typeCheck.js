/**
 * Throws an error if at least one the arguments passed in "args" array
 * is not of the wanted type.
 *
 * Every non-matching argument in "args" will have its error message displayed
 * @param {Array} args The array of arguments whose types should be checked
 * @param {String} type The type every arguments in "args" should be
 * @param {Array<String>} [argNames] Optional, the ordered names of the arguments
 * to check, used to display better errors
 * @returns 0 if no error thrown
 */
function argsMustBeOfType(args, type, argNames) {
  let invalidArgs = [];
  args.forEach((arg, i) => {
    if (typeof arg != type.toLowerCase())
      invalidArgs.push([arg, argNames[i] || ""]);
  });
  if (invalidArgs.length == 0) return 0;

  let errMsg = "";
  invalidArgs.forEach(([arg, argName]) => {
    let strArg = typeof arg == "string" ? `"${arg}"` : arg;
    errMsg += `"${argName}" parameter must be of type ${type}\n"${argName}" value: ${strArg}, type: ${typeof arg}`;
  });
  throw new Error(errMsg);
}

/**
 * Throws an error if "arg" is the wrong type.
 *
 * Supported types: bigint,boolen,function,number,object,string,symbol,undefined
 * @param {*} arg The argument whose type will be checked
 * @param {String} type The type "arg" should be of
 * @param {String} argName Optional, the name of the argument
 * @returns 0 if no error thrown
 */
function argMustBeOfType(arg, type, argName = "") {
  if (typeof arg == type.toLowerCase()) return 0;

  return `${argName} parameter must be of type ${type}\n${argName} value: ${arg}, type: ${typeof arg}`;
}

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
