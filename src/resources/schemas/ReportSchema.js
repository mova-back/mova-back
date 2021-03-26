const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
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
