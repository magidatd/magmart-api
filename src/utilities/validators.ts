const validator = require('validator');

/**
 *
 * @param password
 * @returns any
 */
export const isValidPassword = (password: string): any => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  });
};

const roles = ['admin', 'customer'];

export const isValidRole = (role: string): boolean => {
  console.log(role);
  return roles.includes(role);
};

export const isValidPhone = (number: string): any => {
  return validator.isMobilePhone(number, 'any', { strictMode: false });
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

const NAME_REGEX =
  /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+([ \-']{0,1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u01FF]+){0,2}[.]{0,1}$/;

export const isValidName = (name: string): any => {
  return NAME_REGEX.test(name);
};
