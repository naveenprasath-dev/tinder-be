const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
 /**
  * 1)Read the token from req cookies,
  * 2)Validate the tokem
  * 3)Find the user.
  */


 try {
    const cookie = req.cookies;
    const {token} = cookie;

   if (!token) {
    res.status(401).send("Please Login");
   }
    const decodedObject = await jwt.verify(token, process.env.JWT_SECRET);
   
    const {_id} = decodedObject;
   
    const user = await User.findById(_id);
   
    if (!user) {
       throw new Error("User Not Found");
    }

    req.user = user;
    next();
 } catch (error) {
    res.status(400).send("ERR" + error.message);
 }



};

module.exports = {
    userAuth
}
