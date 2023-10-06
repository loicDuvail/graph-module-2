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
