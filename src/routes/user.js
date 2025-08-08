const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
        }).populate("fromUserId", ["firstName", "lastName", "age", "photoUrl", "about" ]);

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
        }).populate("fromUserId", ["firstName", "lastName", "age", "photoUrl", "about"])
        .populate("toUserId", ["firstName", "lastName","age", "photoUrl", "about"]);

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

/**
 * Get all the feed
 * 
 */

router.get("/user/feed", userAuth, async (req, res)=> {
    try {
        // User should not see all the cards except.
        // 0. his own card.
        // 1.his connections.
        // 2. his ignored list.
        // 3. his sent connection list.
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)* limit;

        if (limit > 100) {
            limit = 5;
        }
        // Find all connection req, 
        // either sent or received.
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ],
        }).select("fromUserId toUserId");
        // .populate("fromUserId", "firstName")
        // .populate("toUserId", "firstName");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach(element => {
            hideUserFromFeed.add(element.fromUserId._id);
            hideUserFromFeed.add(element.toUserId._id);

        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
           
        }).select("firstName lastName age photoUrl")
        .skip(skip).limit(limit);


        res.status(200).send(users);
    } catch (error) {
        res.status(400).send("Error getting feed: " + error.message);
    }
});





module.exports = router;