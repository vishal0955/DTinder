const  mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20,
        },
        lastName: {
            type: String,
            required: true,
            maxLength: 20,
        },
        emailAddress: {
              type: String,
              required: true,
              unique: true,
              trim: true,
              lowercase: true,
            //   validate: {
            //     validator: async function(emailAddress) {
            //       const user = await this.constructor.findOne({ emailAddress });
            //       if(user) throw new Error("A user is already registered with this email address.")
            //     //     if(this.id === user.id) {
            //     //       return true;

            //     //     }
            //     //     return false;
            //     //   }
            //     //   return true;
            //     // },
            //     // message: 'The specified email address is already in use.'
            //     },
            //  },
             validate(value){
                if(!validator.isEmail(value)){
                    throw new Error ("email address incvalid "+ value)
                }
                }
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
          type: String,
          validate(value){
              if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
             }
         },
          
        password: {
            type: String,
            required: true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Password not strong ")
                }
            }
        },
        photo: {
            type: String,
            default: "https://geographyandyou.com/imges/user-profile.png",
            validate(value){
                    if(!validator.isURL(value)){
                        throw new error("url is invalid")
                    } 
                }
            },
        about: {
            type: String,
            default: "This is default  about"
        },
        skills: {
            type: [String]
        }

    },
    { timestamps: true}
  
)



userSchema.methods.getJWT = async function(){
    const user = this;
    const token  = await jwt.sign({_id: user._id},"Vishal@123",{expiresIn: "7d"});
    return token;
};

// userSchema.methods.validatePassWord = async function (passwordInputByUser) {
//     const user = this;
//     const passwordHash = user.password; 
//     const isPasswordValid = await bcrypt.compare(
//         passwordInputByUser,
//         passwordHash);
//     return isPasswordValid;
// };
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
  
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      passwordHash
    );
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);