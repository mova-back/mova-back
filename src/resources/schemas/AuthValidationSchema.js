const isEmail = require('validator/lib/isEmail');
const isUUID = require('validator/lib/isUUID');

const schema = {
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v) && v.length <= 50,
      message: 'string; email; max 50 chars;',
    },
  },
  password: {
    type: String,
    validate: {
      validator: (v) => typeof v === 'string' && v.length >= 8,
      message: 'string; min 8 chars;',
    },
  },
  fingerprint: {
    type: String,
    validate: {
      validator: (v) => typeof v === 'string' && v.length >= 10 && v.length <= 50,
      message: 'string; min 10; max 50 chars;',
    },
  },
  refreshToken: {
    type: String,
    validate: {
      validator: (v) => isUUID(v),
      message: 'string; UUID;',
    },
  },
};

class AuthValidationSchema {
  static get schema() {
    return schema;
  }
}

module.exports = { AuthValidationSchema };
