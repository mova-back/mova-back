const word = require('./word.schema');

const createWord = async (data) => word.create(data);

const getAllWords = async () => word.find({});

const sortByFilter = async (offset, limitPage) =>
  word.find({}, null, {
    skip: offset,
    limit: limitPage,
    sort: { likes: 'descending' }
  });

const getWordById = async (id) => word.findById(id);

const updateWord = async (id, data) =>
  word.updateOne({ _id: id }, { ...data, updated_at: Date.now() });

const deleteWord = async (id) => word.deleteOne({ _id: id });

module.exports = {
  createWord,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
  sortByFilter
};
