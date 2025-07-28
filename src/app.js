const express = require("express");

const app = express();

// This over-ride's all the routes.
// Put this at last.
// app.use("/",(req, res) => {
//     res.send("Hello");
// })

// Only GET call
app.get("/user", (req,res) => {
    res.send("Naveenprasath");
})

app.post("/user", (req,res) => {
    res.send("Data Saved");
})
/**
 * The route will be on order of line written.
 * Order of route matters.
 * 
 */
// request handler
// This will match all the http method api calls.
app.use("/test",(req, res) => {
    res.send("Hello Test");
})




app.use("/",(req, res) => {
    res.send("Hello");
})
app.listen(3001, () => {
    console.log("server is listening");
});