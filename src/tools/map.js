/**
 * Maps a value from "from" interval to "to" interval.
 *
 * If "val" outside of "from" range, the output value will be outside of "to" range.
 * @param {Number} val The value to map.
 * @param {[Number,Number]} from The input interval.
 * @param {[Number,Number]} to The output interval.
 * @returns {Number} The mapped value
 */
function map(val, from, to) {
  let Val0To1 = (val - from[0]) / (from[1] - from[0]);
  return Val0To1 * (to[1] - to[0]) + to[0];
}
