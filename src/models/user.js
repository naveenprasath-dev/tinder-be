const mongoose = require("mongoose");
var validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter a valid email Id");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not valid");
            }
        }
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
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo Url is not valid");
            }
        }
    },
    about: {
        type: String,
        default:"This is a default about page"
    },
    skills: {
        type: [String]
    },
}, { timestamps: true });

userSchema.index({firstName: 1})

// this is like attributes in laravel.
userSchema.methods.getJwt = async function () {
     // create a JWT Token.
     const token = await jwt.sign({_id: this._id}, "Dev@tindersecretkey", {expiresIn: "1d"});
     return token;
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    // create a JWT Token.
    const isValid = await bcrypt.compare(passwordInputByUser, this.password);
    return isValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;