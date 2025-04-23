/**
 * Utility functions for input validation
 */

/**
 * Validates if the email format is correct
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if the password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password is valid
 */
export const isValidPassword = (password) => {
  // Minimum 6 characters
  return password.length >= 6;
};

/**
 * Validates if passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Second password to compare
 * @returns {boolean} - True if passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates if OTP is complete
 * @param {Array} otpArray - Array of OTP digits
 * @returns {boolean} - True if OTP is complete
 */
export const isOtpComplete = (otpArray) => {
  return otpArray.every(digit => digit !== '');
};

export default {
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
  isOtpComplete
}; 