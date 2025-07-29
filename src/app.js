const express = require("express");

const app = express();

const {adminAuth, userAuth} = require("../middleware/auth");


app.use("/admin", adminAuth);

app.use("/user", userAuth);

app.get("/admin/getData", (req, res) => {
    res.send("hello admin");
});


app.get(
    "/user",
    (req, res, next) => {
      console.log("Handling the route user!!");
      next();
    },
    (req, res, next) => {
      console.log("Handling the route user 2!!");
      // res.send("2nd Response!!");
      next();
    },
  
    (req, res, next) => {
      console.log("Handling the route user 3!!");
      // res.send("3rd Response!!");
      next();
    },
    (req, res, next) => {
      console.log("Handling the route user 4!!");
      // res.send("4th Response!!");
      next();
    },
    (req, res, next) => {
      console.log("Handling the route user 5!!");
      res.send("5th Response!!");
    }
  );
  


app.listen(3001, () => {
    console.log("server is listening");
});