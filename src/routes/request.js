const express = require('express');
const router = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");



/**
 * GET profile API
 *
 */

router.post("/send-connection-req", userAuth, async (req, res) => {
  res.send(req.user.firstName + " sent the connection request!!!");
});

router.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      res.status(422).send("plese enter validate status");
    }
    const toUser = await User.findById(toUserId);

    if (!toUser) {
      res.status(400).send("user is not available");
    }
    // existing connection request.
    const existingConnection = await ConnectionRequest.findOne({
      $or:[
        { fromUserId,toUserId},
        { fromUserId: toUserId, toUserId: fromUserId},
      ]
    });

    if (existingConnection) {
      res.status(400).send("Conneciton already exists");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })
   const data = await connectionRequest.save();
   res.status(200).json({
    "message" : `${loggedInUser.firstName}  sent request to ${toUser.firstName} successfully`,
    "data": data
   });
  } catch (error) {
    return res.status(400).send("Error : " + error.message )
  }
})

router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        res.status(400).json({
          "message": "Invalid status"
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      })

      if (!connectionRequest) {
        res.status(404).json({
          "message": "Request Not found"
        });
      }

      connectionRequest.status = status;

      const data = await  connectionRequest.save();

      res.json({
        "message" : "Connection accepted",
        "data" : data,
      });
      // if loggedin user is from a toUserId.
      // status = Interested
      // request id should be valid.
      // 
      // 
  } catch (error) {
    res.status(400).send("error" + error.message);
  }
});


module.exports = router;