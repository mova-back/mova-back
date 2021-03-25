const { ListWordsAction } = require('./ListWordsAction');
const { GetWordByIdAction } = require('./GetWordByIdAction');
const { CreateWordAction } = require('./CreateWordAction');
const { AddLikeAction } = require('./AddLikeAction');
const { AddDislikeAction } = require('./AddDislikeAction');
const { RemoveLikeAction } = require('./RemoveLikeAction');

const { UpdateWordAction } = require('./UpdateWordAction');
const { RemoveWordAction } = require('./RemoveWordAction');

module.exports = {
  ListWordsAction,
  CreateWordAction,
  GetWordByIdAction,
  AddLikeAction,
  AddDislikeAction,
  RemoveLikeAction,
  UpdateWordAction,
  RemoveWordAction,
};
