const  mongoose = require("mongoose");

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
              validate: {
                validator: async function(emailAddress) {
                  const user = await this.constructor.findOne({ emailAddress });
                  if(user) throw new Error("A user is already registered with this email address.")
                //     if(this.id === user.id) {
                //       return true;

                //     }
                //     return false;
                //   }
                //   return true;
                // },
                // message: 'The specified email address is already in use.'
                },
              
              
            },
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
          type: String,
          required: true,
          validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
          },
        },
        password: {
            type: String,
            required: true,
        },
        photo: {
            type: String,
            default: "https://geographyandyou.com/imges/user-profile.png"
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

//create a model 

const User = mongoose.model("User", userSchema)

module.exports = User;