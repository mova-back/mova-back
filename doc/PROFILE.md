# USER PROFILE

```
type UserProfile = {
  id: ID!
  role: USER_ROLE default=USER_ROLE
  user_id: reference
  follows: [idsUsers]
}
property:
following
username
bio
can_edit_reports: RIGHTS
image
email
```

## ROLES: GUEST_ROLE || REGULAR_ROLE || MODERATOR_ROLE

## RIGHTS: EDIT_WORDS || EDIT_REPORTS

```
  REGULAR_ROLE: EDIT_WORDS
  USER_ROLE
  MODERATOR_ROLE: EDIT_REPORTS
```

## GET PROFILE

```
'/api/profiles/:username' method: GET

input: username

!!! check to exist user

output: UserProfile

```

## FOLLOW USER

```
'/api/profiles/:username/follow' method: POST

input: username

!!! check to exist user

output: UserProfile
```

## UNFOLLOW USER

```
'/api/profiles/:username/follow' method: DELETE

input: username

!!! check to exist user

output: UserProfile
```

# TODO: remove before release, this is debug method!

## PROMOTE TO MODERATOR

```
'/api/profiles/<username>/promote' method: POST

input: username

!!! check to exist user

current_user.profile.role = MODERATOR_ROLE

output: UserProfile
```
