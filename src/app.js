const express = require("express");
const connectDB = require("../src/config/database");
const app = express();

const User = require("../src/models/user");
const bcrypt = require('bcrypt');
const validator = require("validator");
const {validateSignUpData} = require("./utils/validation");

// Middlewares

/**
 * Reads the json data
 * Converts the json data to javascript body
 * Pass back to request
 */
app.use(express.json());

// API

/**
 * SignUp API
 *
 */
app.post("/signup", async (req, res) => {

  try {
   // Validate the data.
   validateSignUpData(req);
   //Encrypt the password.
   const saltRounds = 10;
   const {firstName,lastName, emailId, password} = req.body;

   const passwordHash = await bcrypt.hash(password, 10);
  // creating a new instance of the user Model.
    const user = new User({
        firstName, 
        lastName,
        emailId,
        password: passwordHash
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

app.post("/login", async(req, res) => {

    try {
        const {emailId, password} = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Email is not valid");
            
        }
       
        const user = await User.findOne({emailId: emailId});

        if (!user) {
            throw new Error("Invalid Creds");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid Creds");
        }
        res.send("Logged In Successfully");
        
    } catch (error) {
        res.send("Error: " + error.message)
            .status(500);
    }
});




/**
 * Feed API - Get all data
 *
 */

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Error Fetching user from feed API" + error.message);
  }
});

/**
 * GET specific User
 *
 *
 */

app.get("/user", async (req, res) => {
  try {
    // More than one user
    const users = await User.find({ emailId: req.body.email });

    // one user only
    // const users = await User.findOne({emailId:req.body.email});
    res.send(users);
  } catch (error) {
    res.status(500).send("Error Fetching user from feed API" + error.message);
  }
});

/**
 * DELETE an user
 *
 *
 */

app.delete("/user", async (req, res) => {
  try {
    // More than one user
    await User.findOneAndDelete({ emailId: req.body.email });

    // one user only
    // const users = await User.findOne({emailId:req.body.email});
    res.send("deleted successfully");
  } catch (error) {
    res.status(500).send("Error Fetching user from feed API" + error.message);
  }
});

/**
 * PATCH API
 *
 */
app.patch("/user/:userId", async (req, res) => {
  // creating a new instance of the user Model.
  // const user = new User(req.body);
  const userId = req.params?.userId;
  const data = req.body;

  console.log("data", data);

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    newUser = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(newUser);
  } catch (error) {
    res.status(500).send("Error adding user" + error.message);
  }
});

// DB connection
connectDB()
  .then(() => {
    app.listen(3001, () => {
      console.log("server is listening");
    });
  })
  .catch(() => {
    console.log("Db connection failed");
  });
