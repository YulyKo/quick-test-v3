## License

Nest is [MIT licensed](LICENSE).

# Authentication

## Registration
User registrants using: `email`, `password` and `name`

## Login
User authorized using: `email`, `password`. Response with `token` and `refresh-token`

`Token` uses in authorization to routes. `Refresh-token` can be used instead of casual authorization. That mean you don't need use email and password after some time when you want login.

## Refresh
Send `refresh-token` in authorization header. Response with `token` and `refresh-token` if refresh-token not expired and equal to user refresh-token in DB.

## Logout
Delete user `refresh-token` from DB. `Token` still working until it expired.

----------
### Changing password
First you need receive code on your email inbox using `auth/forgotPassword`. You can check if code valid using `auth/code`. Change password using `auth/changePassword`.

## ForgotPassword
Receive email address. Server will send code to email to change password. Code valid some period of time. If you don't want to change password won't use code.

## Code
Code sended to email. Receive email and code. Check if user with email has this code and code lifetime not end.

## ChangePassword
Code sended to email. Receive email, code, new password. If code valid and password not equal to old password then change password.
