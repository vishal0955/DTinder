const validator = require("validator")

const signupValidateData = (req) => {
            const { firstName,lastName,emailAddress,password } = req.body;
    if(!firstName || !lastName){ 
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailAddress)){
        throw new Error("EmailAddress not Valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("enter Strong password");
    }

};

const validateEditProfileData = (req) => {
    
    const allowedEditFields = ["firstName","lastName","emailAddress", "photo", "gender", "age","about", "skills" ];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
     return isEditAllowed;
    
}
module.exports = {signupValidateData, validateEditProfileData }