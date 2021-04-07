const { ListWordsAction } = require('./ListWordsAction');
const { GetWordByIdAction } = require('./GetWordByIdAction');
const { CreateWordAction } = require('./CreateWordAction');
const { AddLikeAction } = require('./AddLikeAction');
const { AddDislikeAction } = require('./AddDislikeAction');
const { AddReportAction } = require('./AddReportAction');
const { RemoveLikeAction } = require('./RemoveLikeAction');
const { AddFavoriteAction } = require('./AddFavoriteAction');
const { RemoveFavoriteAction } = require('./RemoveFavoriteAction');

const { UpdateWordAction } = require('./UpdateWordAction');
const { RemoveWordAction } = require('./RemoveWordAction');

const { ReportListAction } = require('./ReportListAction');
const { ReturnToFeedAction } = require('./ReturnToFeedAction');

module.exports = {
  ListWordsAction,
  CreateWordAction,
  GetWordByIdAction,
  AddLikeAction,
  AddDislikeAction,
  RemoveLikeAction,
  UpdateWordAction,
  RemoveWordAction,
  AddFavoriteAction,
  RemoveFavoriteAction,
  AddReportAction,
  ReportListAction,
  ReturnToFeedAction,
};
