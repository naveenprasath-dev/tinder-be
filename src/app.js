const express = require("express");

const app = express();

// request handler
app.use("/test",(req, res) => {
    res.send("Hello");
})
app.listen(3001, () => {
    console.log("server is listening");
});