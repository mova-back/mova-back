const Code = require('./secretCode.schema');

const save = async (newCode) => {
  await newCode.save();
};

const deleteMatches = async (email) => {
  Code.deleteMany({ email });
};

const findEmailAndSecret = async (email, code) => {
  return Code.findOne({
    email,
    code,
  });
};

module.exports = {
  save,
  deleteMatches,
  findEmailAndSecret,
};
