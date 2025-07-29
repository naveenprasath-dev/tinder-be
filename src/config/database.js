const mongoose = require("mongoose");


const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://naveenprasathdev:C8qMihgafc1yp1gB@devlopment-cluster.rnpze3f.mongodb.net/dev-tinder"
    );
}

module.exports = connectDB;


