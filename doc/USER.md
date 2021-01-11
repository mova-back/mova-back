# User

```
type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    created_at: Date! default=Date.now()
    updated_at: Date! default=Date.now()
    bio: String
    image: String
    email_verified: Boolean
    refresh_token: String default=''
    access_token: String default=''
}
```

## REGISTER:

```
'/api/user' method: POST

{
    "username": "toma",
    "email": "toma@toma.com",
    "password": "toma"
}


refresh_token !== ''
access_token !== ''
!!! check register_already_user(status: 422) => message: USER_ALREADY_REGISTERED

!!! must create UserProfile

output: User

example: {
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY3ODYxNDcsIm5iZiI6MTU5Njc4NjE0NywianRpIjoiYTI4MzNlYWQtNDgyMi00OGJkLWE3MTItNGVmY2UwZDg0NzMyIiwiZXhwIjoxNTk2Nzg3MDQ3LCJpZGVudGl0eSI6OSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.8hULX1GFWS1D03U6FAYUvDtIgHycLkTl39w2xu1v8zw",
  "bio": null,
  "created_at": "2020-08-07T07:42:27.017673",
  "email": "toma@toma.com",
  "id": 9,
  "image": null,
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY3ODYxNDcsIm5iZiI6MTU5Njc4NjE0NywianRpIjoiYTdjMzQyOWUtZWIwZi00Njk5LWIwNWUtNGZlNTcyMDAxYjEwIiwiZXhwIjoxNTk5Mzc4MTQ3LCJpZGVudGl0eSI6OSwidHlwZSI6InJlZnJlc2gifQ.rYD1emfYHJ-3ah_23VeuRCskibANPKeWBGt7yw1iQV4",
  "updated_at": "2020-08-07T07:42:27.017685",
  "username": "toma"
}

example errors
{
  "errors": {
    "body": [
      "User already registered"
    ]
  }
}


```

## LOGIN:

```
'/api/user/login' method: POST

{
  "email": "toma@toma.com",
  "password": "toma"
}

refresh_token != ''
access_token != ''
!!! check to exist user

output: User

example output: {
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY3OTIwODcsIm5iZiI6MTU5Njc5MjA4NywianRpIjoiNjljNjE5ZDMtMWY0MS00ZTc1LThlY2MtZmQwNjJlNmMzNjRmIiwiZXhwIjoxNTk2NzkyOTg3LCJpZGVudGl0eSI6OSwiZnJlc2giOnRydWUsInR5cGUiOiJhY2Nlc3MifQ.v0kPNspF3MvjE-AGNxs0Z68rvHtU97IhlOVRVKf20Pw",
  "bio": null,
  "created_at": "2020-08-07T07:42:27.017673",
  "email": "toma@toma.com",
  "id": 9,
  "image": null,
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY3OTIwODcsIm5iZiI6MTU5Njc5MjA4NywianRpIjoiMWY0YWM1NDUtMGZhMS00OWZkLWI4ZjYtNzgzMGEwMzM5MDgwIiwiZXhwIjoxNTk5Mzg0MDg3LCJpZGVudGl0eSI6OSwidHlwZSI6InJlZnJlc2gifQ.EGMrpXU6iNC84CgV-5AhqglieZYyHm-8V_0_NmzAddc",
  "updated_at": "2020-08-07T07:42:27.017685",
  "username": "toma"
}

example errors:
{
  "errors": {
    "body": [
      "User not found"
    ]
  }
}

```

### GET_USER:

```
'/api/user' method: GET

headers={
'Authorization': 'Token access_token'
}

example headers: {
    Authorization: Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY4MDgyNTUsIm5iZiI6MTU5NjgwODI1NSwianRpIjoiMWE3MTczN2QtNjU4MC00YzU3LTk3YjEtMzlkYTFkNTFkZDk1IiwiZXhwIjoxNTk2ODA5MTU1LCJpZGVudGl0eSI6OSwiZnJlc2giOnRydWUsInR5cGUiOiJhY2Nlc3MifQ.iLphhXGkYTZUfxxORXjKX_Xd9BHIY9JHBJwWlV0y6z0
}

output: User

example output:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY5MDgwODAsIm5iZiI6MTU5NjkwODA4MCwianRpIjoiMGI0YjZiMDMtMjIwYy00ZGVhLThjZTMtNjA1NmMxOTllY2ZhIiwiZXhwIjoxNTk2OTA4OTgwLCJpZGVudGl0eSI6OSwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.GVevd8aPqQ-M97T_L_WDSy10vGhOJhHl4Qd1BrEzJV0",
  "bio": null,
  "created_at": "2020-08-07T07:42:27.017673",
  "email": "toma@toma.com",
  "id": 9,
  "image": null,
  "refresh_token": "",
  "updated_at": "2020-08-07T07:42:27.017685",
  "username": "toma"
}

output with errors:
{
  "msg": "Bad Authorization header. <some error>'"
}

```

## UPDATE_USER

```
'/api/user' method: PUT

input: updated fields User {
    'email': 'meh@mo.mo',
    'bio': 'I\'m a simple man',
    'username': 'hmm'
}

headers={
'Authorization': 'Token access_token'
}

example headers: {
    Authorization: Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY4MDgyNTUsIm5iZiI6MTU5NjgwODI1NSwianRpIjoiMWE3MTczN2QtNjU4MC00YzU3LTk3YjEtMzlkYTFkNTFkZDk1IiwiZXhwIjoxNTk2ODA5MTU1LCJpZGVudGl0eSI6OSwiZnJlc2giOnRydWUsInR5cGUiOiJhY2Nlc3MifQ.iLphhXGkYTZUfxxORXjKX_Xd9BHIY9JHBJwWlV0y6z0
}

!!! update field: updated_at

output: User

```

## CHANGE PASSWORD

```
'/api/user/change-password' method: PUT
input: {
    old_password, new_password1, new_password2
}

headers={
'Authorization': 'Token access_token'
}

example headers: {
    Authorization: Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTY4MDgyNTUsIm5iZiI6MTU5NjgwODI1NSwianRpIjoiMWE3MTczN2QtNjU4MC00YzU3LTk3YjEtMzlkYTFkNTFkZDk1IiwiZXhwIjoxNTk2ODA5MTU1LCJpZGVudGl0eSI6OSwiZnJlc2giOnRydWUsInR5cGUiOiJhY2Nlc3MifQ.iLphhXGkYTZUfxxORXjKX_Xd9BHIY9JHBJwWlV0y6z0
}

!!! check new password1 === new_password2
!!! check is_old_password_correct

output: {message : 'User password has been changed successfully!'}

output with errors:
{
  "errors": {
    "body": [
      "New passwords doesn't match"
    ]
  }
}
```

## UPDATE TOKEN

```
'/api/user/refresh' method: POST

headers={
  'Authorization': 'Token access_token'
}

!!! create_access_token

output: User
```

## VERIFY EMAIL

```
'/api/user/verify_email' method: GET

output: User
```

## VERIFICATION EMAIL

```
'/api/user/send-user-verification-email' method: GET
```

## RESET PASSWORD

```
'/api/user/send-password-reset-email' method: POST
```
