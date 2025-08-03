const express = require('express');
const validator = require("validator");
const router = express.Router();
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");



/**
 * SignUp API
 *
 */

router.post("/signup", async (req, res) => {

    try {
     // Validate the data.
     validateSignUpData(req);
     //Encrypt the password.
     const saltRounds = 10;
     const {firstName,lastName, emailId, password,age, gender, skills, photoUrl} = req.body;
  
     const passwordHash = await bcrypt.hash(password, 10);
    // creating a new instance of the user Model.
      const user = new User({
          firstName, 
          lastName,
          emailId,
          password: passwordHash,
          age, 
          gender, 
          skills, 
          photoUrl
      });
      newUser = await user.save();
      res.send(newUser);
    } catch (error) {
      res.status(500).send("Error adding user" + error.message);
    }
  });


/**
 * Login API
 * 
 *   
 */

router.post("/login", async(req, res) => {

    try {
        const {emailId, password} = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
            
        }
       
        const user = await User.findOne({emailId: emailId});

        if (!user) {
            throw new Error("Invalid Creds");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
          // this getJWT is a schema method, written in userSchema.
          const token = await user.getJwt();
          
          // Add the token to the cookies. and send the response back to the user.
          res.cookie("token" , token);
          res.send(user);
        } else {
          throw new Error("Invalid Creds");
        }
        
    } catch (error) {
        res.status(500)
        .json({
          "message" : "Error: " + error.message
        });
    }
});

router.post("/logout", async (req, res) => {
    res.cookie("token" , null, {
        expires: new Date(Date.now()),
    });
    res.send("Log out Successfull");
})

module.exports = router;