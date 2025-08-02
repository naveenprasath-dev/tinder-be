const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const router = express.Router();


/**
 * Get all the interested collection. for the loggedin user.
 * 
 */
router.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);

        res.json({
            "message": "connection request list",
            "data": connectionRequests,
        });
    } catch (error) {
        res.send("Error " + error.message).status(400);
    }
});


/**
 * Get all the Accepted collection. for the loggedin user.
 * 
 */

router.get("/user/requests/connections", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId : loggedInUser._id},
                {fromUserId : loggedInUser._id},
            ],
            status: "accepted",
        }).populate("fromUserId", ["firstName", "lastName"])
        .populate("toUserId", ["firstName", "lastName"]);

        const data = connectionRequests.map((row) => {
            // cannot compare the two  mongoDb id as it is an object.
            // have to do object1.id.equals(object2.id) or object1.id.toString === object2.id.toString
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                 return row.toUserId; 
            }
            return  row.fromUserId; 
        
        });
        res.json({
            "message": "connection  list fetched successfully",
            "data": data,
        });
    } catch (error) {
        res.send("Error " + error.message).status(400);
    }
});







module.exports = router;