/**
 * Reliably count decimal places
 *
 * @param {number} value
 * @returns {number}
 */
function countDecimals(value: number): number {
  if (value % 1 != 0) return value.toString().split(".")[1].length;
  return 0;
}

export default countDecimals;
