import { countDecimals } from ".";

const checkMissingParameter = (name: string, value: any) => {
  if (typeof value === "undefined") {
    throw new Error(`The ${name} parameter is missing.`);
  }
};

const checkPositiveNumber = (name: string, value: any) => {
  if (typeof value === "number" && value <= 0) {
    throw new Error(`${name} must be a positive and none zero number.`);
  }
};

const checkAllowedDecimals = (name: string, value: any) => {
  if (typeof value === "number" && countDecimals(value) > 12) {
    throw new Error(`${name} must have maximum of 12 decimal places.`);
  }
};

const checkValidValues = (name: string, value: any, validValues?: string[]) => {
  if (
    typeof value !== "object" &&
    typeof validValues !== "string" &&
    Array.isArray(validValues) &&
    validValues.indexOf(value) === -1
  ) {
    throw new Error(`${name} must be one of ${validValues.join(", ")}.`);
  }
};

const checkWrongType = (name: string, value: any, type?: string) => {
  if (typeof type !== "undefined" && typeof value != type) {
    throw new Error(`${name} must be a ${type}.`);
  }
};

const checkValidObjectProperties = (
  name: string,
  value: any,
  validValues?: string[]
) => {
  if (typeof value === "object" && Array.isArray(validValues)) {
    const invalidProperties = [] as string[];
    Object.keys(value).forEach(key => {
      if (validValues.indexOf(key) === -1) invalidProperties.push(key);
    });
    if (invalidProperties.length > 0)
      throw new Error(
        `${name} contains invalid properties ${invalidProperties.join(", ")}.`
      );
  }
};

/**
 * Perform series of validations on give parameters
 *
 * TODO:
 *  - Unit tests
 *  - Cleaner implementation with funneling
 *  - Validation builder with chain methods
 *
 * @param {string} name - parameter name
 * @param {*} value - parameter value
 * @param {string} [type] - (Optional) parameter type as string value
 * @param {string[]} [validValues] - (Optional) valid parameter values as string[]
 */
const validate = (
  name: string,
  value: any,
  type?: string,
  validValues?: string[]
) => {
  checkMissingParameter(name, value);
  checkWrongType(name, value, type);
  checkPositiveNumber(name, value);
  checkAllowedDecimals(name, value);
  checkValidValues(name, value, validValues);
  checkValidObjectProperties(name, value, validValues);
};

export default validate;
