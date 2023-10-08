/**
 * Overwrites an object (o1) with an other (o2) by keeping every o1 properties
 * which are not defined in o2, even in deeper object layers.
 *
 * ex:
 *
 * const o1 = { a: { a1: 0, a2: 0 } };
 *
 * const o2 = { a: { a1: 1 }, b: { b1: 1 } };
 *
 * deepMerge(o1, o2); --> returns { a: {a1:1, a2:0}, b:{b1:1} }
 * where { ...o1,...o2 } would return { a:{a1:1}, b:{b1:1} }
 * @param {Object} o1 The object to modify
 * @param {Object} o2 The object that will be used to modify o1 with its last layer properties
 * @returns a reference to the (modified) o1 object
 */
function deepMerge(o1 = {}, o2 = {}) {
  for (const key in o2) {
    if (o2[key].constructor === Object) {
      // if o1[key] is not an defined, initialize it as an object
      // to pass o1[key] to recursive deepMerge as a reference
      if (!o1[key]) o1[key] = {};
      deepMerge(o1[key], o2[key]);
    } else o1[key] = o2[key];
  }
  return o1;
}
