# APIS

## auhtRouter
- POST  /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- Post /request/send/:status/:userID
- Post /request/review/:status/:requestId

## myConnectionsRouter.
- Get /connections
- Get /requests/received
- Get /feed - gets the profiles of other users.

## status : ignore, interested,accepted,rejected.
