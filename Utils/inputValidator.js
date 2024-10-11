// utils/normalizeInput.js

const normalizeInput = (username, email) => {
  return {
    normalizedUsername: username.toLowerCase(),
    normalizedEmail: email?.toLowerCase(),//byChance if email is not provided
  };
};

module.exports = { normalizeInput };
