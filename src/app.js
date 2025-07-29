const express = require("express");

const app = express();


app.get("/user", (req, res) => {
    throw new Error("test");
    
    res.send("Hello data");
})

// order matters
//  2 - req, res
//  3 - req, res, next
// 4- err, req, res, next
// 
app.use("/", (err, req, res, next) => {
    if (err) {
      res.status(500).send("Something went wrong");
    } 
})


app.listen(3001, () => {
    console.log("server is listening");
});