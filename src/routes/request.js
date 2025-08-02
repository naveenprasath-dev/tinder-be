const express = require('express');
const router = express.Router();
const {userAuth} = require("../middlewares/auth");


/**
 * GET profile API
 *
 */

router.post("/send-connection-req", userAuth, async (req, res) => {
  res.send(req.user.firstName + " sent the connection request!!!");
});


module.exports = router;