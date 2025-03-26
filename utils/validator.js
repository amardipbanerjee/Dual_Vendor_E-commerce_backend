// utils/validator.js

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number (example uses a simple regex; customize as needed).
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10}$/; // Example: exactly 10 digits
  return phoneRegex.test(phone);
}

/**
 * Validates if a given string is not empty.
 * @param {string} str - The string to validate.
 * @returns {boolean} - True if non-empty, false otherwise.
 */
function isNonEmpty(str) {
  return Boolean(str && str.trim().length > 0);
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isNonEmpty,
};
