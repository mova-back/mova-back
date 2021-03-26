const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 1 && v.length <= 300,
        message: (prop) => `${prop.value} - UUID`,
      },
    },
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'words',
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

const ReportSchema = mongoose.model('report', schema);

module.exports = { ReportSchema };
