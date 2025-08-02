const validator = require("validator");
const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if(firstName.length < 4 || lastName.length < 4) {
        throw new Error("Name is not valid");
    } else if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not valid");
    }
}


const validateEditProfileData = (req) => {
    const allowedEditFields = ["age", "gender", "skills", "lastName"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));    
    return isEditAllowed;
}
module.exports = {validateSignUpData, validateEditProfileData};