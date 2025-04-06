const validator = require('validator');

/**
 *
 * @param password
 * @returns any
 */
export const isValidPassword = (password: string): any => {
  return (
    validator.isLength(password, { min: 8 }) &&
    validator.isAlphanumeric(password)
  );
};

/**
 *
 * @param email
 * @returns
 */
export const isValidEmail = (email: string): any => {
  return validator.isEmail(email);
};

/**
 *
 * @param str
 * @returns string
 */
export const sanitizeString = (str: string): string => {
  return validator.escape(str);
};
