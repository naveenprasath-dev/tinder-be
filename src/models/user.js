const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 20,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 99
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
                
            }
        }
    },
    photoUrl: {
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtfu1E496BPLcg5jjM69udAclqrs3dgukmyOjUrbQHCo5MhpaXCReO2pU&s",
    },
    about: {
        type: String,
        default:"This is a default about page"
    },
    skills: {
        type: [String]
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;