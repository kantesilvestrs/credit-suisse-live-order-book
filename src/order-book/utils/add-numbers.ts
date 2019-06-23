/**
 * Accurately add two numbers with up to 12 decimal points
 *
 * TODO:
 *  - Unit tests
 *  - Optional decimal spaces configuration
 *  - Chained number additions
 *
 * @export addNumbers
 * @param {number} a - Left number
 * @param {number} b - Right number
 * @returns {number} - Sum result
 */
function addNumbers(a: number, b: number): number {
  return Math.round((a + b) * 1e12) / 1e12;
}

export default addNumbers;
