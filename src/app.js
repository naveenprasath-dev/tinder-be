const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
const User = require("../src/models/user");


// API 

app.post("/signup", async (req, res) => {

   
    // creating a new instance of the user Model.
    const user = new User({
        firstName: "Naveenprasath",
        lastName: "selvam",
        emailId:"test@gmail.com",
        age:28,
        gender:"Male",
        password:"Naveen@123",
    });

    try {
        newUser = await user.save();
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
    })


