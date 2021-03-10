const bcrypt = require('bcrypt');

const isComparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  isComparePassword,
};
