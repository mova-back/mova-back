const wordModel = require('./word.model');

const { NotFound } = require('../../error');
const { catchErrors } = require('../../middlewares/errorMiddleware');

const createWord = catchErrors(async (req, res) => {
  const word = await wordModel.createWord(req.body);
  return res.status(200).json({ word });
});

const getAllWords = catchErrors(async (_, res) => {
  const words = await wordModel.getAllWords();

  if (!words) {
    throw new NotFound('Words not found.');
  }

  return res.status(200).json({ words });
});

const getWordById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Words not found.');
  }

  return res.status(200).json({ word });
});

const updateWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.updateWord(id, req.body);

  if (!word) {
    throw new NotFound('Words not found.');
  }

  const updatedWord = await wordModel.getWordById(id);

  return res.status(200).json({ word: updatedWord });
});

const deleteWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.deleteWord(id);

  if (!word) {
    throw new NotFound('Words not found.');
  }

  return res.status(200).json({ message: 'Word was deleted.' });
});

module.exports = {
  createWord,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord
};
