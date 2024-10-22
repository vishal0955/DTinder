const  express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const User  = require("../models/user");
const { signupValidateData } = require("../utils/validator")

authRouter.post("/signup", async (req,res) => {
    //valindate the requested data
    try{
    signupValidateData(req);
    const { emailAddress,firstName,lastName,password } = req.body;
    
    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)
    
      const user = new User({
        firstName,
        lastName,
        emailAddress,
        password: passwordHash,
      });
      
       const savedUser =  await user.save();
       const token = await savedUser.getJWT();

       res.cookie("token", token, {
        expires: new Date(Date.now() + 8* 3600000),
       });
        res.json({message: " User added successfully", data: savedUser});
      }catch(error){
        res.status(400).send("ERror"+ error.message)
      }
    })

    authRouter.post("/login",async (req,res) => {
        try{
        const  {emailAddress, password } = req.body;
      
        const user = await User.findOne({ emailAddress: emailAddress})
        if(!user){
          throw new Error("Invalid Credentials Email")
        }
        const isPasswordValid = await user.validatePassword(password);
       if(isPasswordValid){
         const token = await user.getJWT();
       //Add token to cookie and send back to user
       res.cookie('token',token,{ expires: new Date(Date.now() + 8 * 3600000)})
       res.send(user)
       }else {
        throw new Error ("invalid credentials Password")
       }
        
      }catch(err){
       res.status(400).send("ERROr" + err.message)
      }
      });



      authRouter.post("/logout", async (req,res) => {
        try{
          res.cookie('token', null,
            {
              expires: new Date(Date.now())
            }
          )
          res.send("logout Successfully")
        }catch(err){
          res.status(400).send(err.message);
        }
      })

module.exports = authRouter;