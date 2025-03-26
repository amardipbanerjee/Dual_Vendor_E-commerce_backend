// utils/generateToken.js
const crypto = require("crypto");

/**
 * Generates a random token.
 * @param {number} [length=20] - The number of bytes to generate. Defaults to 20.
 * @returns {string} - A hexadecimal string token.
 */
function generateToken(length = 20) {
  return crypto.randomBytes(length).toString("hex");
}

module.exports = { generateToken };
