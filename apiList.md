# devTinder APIs

## SIGNUP/LOGIN/LOGOUT FEATURES

# authRouter:

POST /signup
POST /login
POST /logout

## UPDATING PROFILE FEATURES

# profileRouter:

GET /profile/view - (VIEW PROFILE)
PATCH /profile/edit - (UPDATING PROFILE EXCEPT EMAIL)
PATCH /profile/password - (FORGOT PASSWORD)

## VIEWING ALL THE USERS AND REVIEWING RECEIVED REQUESTS :

# userRouter:

GET user/feed (GETS THE PROFILES OF OTHER USERS IN PLATFORM)
GET user/connections
GET user/requests/received (VIEWING INCOMING REQUESTS)

## SENDING REQUESTS TO THE USERS OR PASSING THEM & ACCEPTING THE REQUEST OR REJECTING THE REQUEST - STATUS (ACCEPTED OR REJECTED) :

# connectionRequestRouter:

POST /request/send/interested/:userID - (SENDING THE REQUEST)
POST /request/send/ignore/:id - (PASSING)

# URL CAN HANDLE BOTH STATUS AND USERID - DYNAMIC BEHAVIOR BASED ON USER REQUEST

POST /profile/send/:status/:toUserId - :status - interested, ignored (left and right swipe) if interested -> that userId comes in "toUserId

POST /request/review/accepted/:requestID - (ACCEPTING THE INCOMING REQUEST)
POST /request/review/rejected/:requestID - (REJECTING THE INCOMING REQUEST)

## (STATUS - IGNORE, INTERESTED, ACCEPTED, REJECTED)

## (TINDER - BY DEFAULT GIVES 30 USERS CARD, IT WILL NOT MAKE API CALLS FOR EACH AND EVERY LIKE AND PASS)
