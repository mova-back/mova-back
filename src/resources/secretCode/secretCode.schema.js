const mongoose = require('mongoose');
const moment = require('moment');

// const { CODE_EXP } = require('../../config/index');

const { Schema } = mongoose;

const secretCode = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: moment(),
    expires: 'CODE_EXP',
  },
});

// expire 10 min

const Code = mongoose.model('code', secretCode);
module.exports = Code;
