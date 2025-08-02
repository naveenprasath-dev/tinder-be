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
- Post /request/send/interested/:userID
- Post /request/send/ignored/:userId

## connectionReviewRouter
- Post /request/review/accepted/:requestId
- Post /request/review/rejected/:requestId

## myConnectionsRouter.
- Get /connections
- Get /requests/received
- Get /feed - gets the profiles of other users.

## status : ignore, interested,accepted,rejected.
