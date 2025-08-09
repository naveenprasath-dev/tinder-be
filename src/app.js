const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("../src/config/database");
const app = express();
require("dotenv").config();
const User = require("../src/models/user");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");


// Middlewares

/**
 * 
 * CORS 
 * 
 */
app.use(cors({
  origin: "http://localhost:5173/",
  credentials: true,
}));

/**
 * Reads the json data
 * Converts the json data to javascript body
 * Pass back to request
 */
app.use(express.json());

/**
 * Reads the cookie.
 * 
 */
app.use(cookieParser());



app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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
      console.log("server is listening in 3001");
    });
  })
  .catch(() => {
    console.log("Db connection failed");
  });
