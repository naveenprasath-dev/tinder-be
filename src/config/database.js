const mongoose = require("mongoose");


const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://naveenprasathdev:CMBnjaupkB8isJgn@devlopment-cluster.rnpze3f.mongodb.net/dev-tinder"
    );
}

module.exports = connectDB;




