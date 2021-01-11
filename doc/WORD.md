# WORD

```
type Word = {
  id: ID!
  wordname: String!
  wordname: reference
  meaning: String!
  extended_description: String
  usages: String
  synonyms: String
  tags: Tag[];
  created_at: String default=Date.now()
  updated_at: String default=Date.now()
  is_anonymous: Boolean
  is_on_report_feed: Boolean
  tags: reference
  favoriters: reference
};
Exist 2 property:
favorites_count: Number
marked_as_favorite: Boolean

type Tag = {
  tagname: String
}

type Report = {
  word_id: reference
  category: String
  description: String
  created_at: date
  profile_id: reference
}

type Rating = {
  value: DISLIKE = 0 || LIKE = 1
  word_id: reference
  profile_id: reference
  created_at: date
  updated_at: date
}
```

## CREATE_WORD

```
'/api/dictionary/word' method: POST

input: Word {
  wordname='wordname',
  extended_description='some body',
  meaning='meaning',
  usages='usages',
  synonyms='synonyms'
}

author=current_user,

!!! check to exist word

output: Word
```

## EDIT WORD

```
'/api/dictionary/word/:id' method: PUT

  input: wordId, Word {
      "wordname": wordname,
      "meaning": "Ever wonder how?",
      "extended_description": "You have to believe",
      "tags": [],
      "usages": "In Minsk, in Belarus etc",
      "synonyms": "Cool",
      "is_anonymous": True,
  }
  headers={
      'Authorization': 'Token token'
  }

  !!!  update field: updated_at

  output: Word
```

## RETURN WORD TO FEEDBACK

```
'/api/dictionary/word/:id/return_to_feed' method: PUT

input: id

!!! check rights
!!! update word.is_on_report_feed = False
!!! update field: updated_at

output: Word

```

## MOVE TO REPORT FEED

```
'/api/dictionary/word/:id/move_to_report_feed' method: PUT
input: id

!!! check rights
!!! update word.is_on_report_feed = true
!!! update field: updated_at

output: Word

```

## GET WORD

```
'/api/dictionary/word/:id' method: GET

input: id
!!! check to exist word

output: Word
```

## DELETE WORD

```
'/api/dictionary/word/:id' method: DELETE

input: id

output: '', status: 200

```

## GET WORDS

```
'/api/dictionary/word' method: GET

input: id, tags=[], favorited=None, author=None, limit=20, offset=0

output: [Word]

```

## WORDS FEED

```
'/api/dictionary/feed' method: GET

input: limit=20, offset=0

???
words = .join(Rating.word).filter(Word.created_at > dt.datetime.utcnow() - dt.timedelta(days=3))\.filter(not Word.is_on_report_feed).offset(offset).limit(limit).with_only_columns([func.count()]).group_by(Word).order_by(Word.created_at.desc())

output: [Word]

```

## REPORTED WORDS FEED

```
'/api/dictionary/report/feed' method: GET


input: limit=20, offset=0

!!! check rights
 words = filter(Word.is_on_report_feed).offset(offset).limit(limit)

output: [Word]

```

## REPORT WORDS

```
'/api/dictionary/word/:id/report' method: POST

input: id, {value, word_id, profile_id}

!!! check to exist word

!!! update created_at, updated_at

???

output: report
```

## REMOVE WORD FROM REPORTED

```
'/api/dictionary/word/:id/report' method: DELETE

input: id

!!! check to exist word

!!! check rights

word.is_on_report_feed = False

output: word
```

## LIKE WORD

```
'/api/dictionary/word/:id/like' method: POST

input: id

!!! check to exist word

output: true or false

```

## DISLIKE WORD

```
'/api/dictionary/word/:id/dislike' method: POST

input: id

!!! check to exist word

output: true or false
```

## FAVOURITE WORD

```
'/api/dictionary/word/:id/favotite' method: POST
input: id

!!! check to exist word

output: Word

```

## UNFAVOURITE WORD

```
'/api/dictionary/word/:id/favotite' method: DELETE

input: id

!!! check to exist word

output: Word
```
