const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

/**
 * GET profile API
 *
 */

profileRouter.get("/user/profile/view",userAuth, async (req, res) => {
  try {
    
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Error fetching profile" + error.message);
  }
  
});


profileRouter.patch("/user/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid update fields");
    };

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key]; // ← correct dynamic access
    });

    await loggedInUser.save();
    res.json(
      {
        "message" : `${loggedInUser.firstName}, Your Profile is updated`,
        "status" : 201,
        "data" : loggedInUser
      }
    );

  } catch (error) {
    res.status(500).send("Error updating profile: " + error.message);
  }
});





module.exports = profileRouter;