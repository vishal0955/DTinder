const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/Auth")
const { validateEditProfileData } = require("../utils/validator")

profileRouter.get("/profile/view",userAuth, async (req,res) => {
    try{
  const user = await req.user;
  
    res.send(user);
    }catch(err){
      res.status(400).send("login failed")
    }
  })


  //this is api to edit  profile details 
  // step 1 , check data i.e validateData 
  // stwp 2 - define what fields is allowed to edit 
  // step 3 - updatee the fields details
  //  step 4 - save the edited details
// /* this is my sol

  profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
     if(!validateEditProfileData(req)){
      throw new Error("invalid Edit Request")
     }
     const loggedInUser = req.user;

     Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]) );

    await loggedInUser.save();
    
    res.json({message: `${loggedInUser.firstName}, your profile updated Suceessfully`, data: {loggedInUser}})
    }catch(err){
       res.status(400).send("Error"+ err.message)
    }
  })
   
  //

  profileRouter.post("/profile/password", userAuth, async (req,res) => {
    try {
      
    } catch (error) {
      
    }

  })
 module.exports = profileRouter;