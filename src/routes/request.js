const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;


    const allowedStatus = ["interested", "ignored"];
    if(!allowedStatus.includes(status)){
  return res.status(400).json({
    message: "Status is invalid" + status
   })
    };

    const toUser = await User.findById(toUserId);
    if(!toUser){
   return res.status(404).json({
    message: "User not Found"
   })
    }

    const Connectionexists = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId},
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    })

    if(Connectionexists){
      return res.status(400).json({
        message: "Connection Already Exists"
      })
    }

    const connection = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
 


 const data = await connection.save();
 res.json({
  message: req.user.firstName + "sent connection  request  to" + toUser.firstName,
  data,
 })
  } catch (error) {
    res.status(400).send("ERROR" + error.message)
  }
  });

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const{ status, requestId } = req.params;
    const toUserId = req.params.toUserId;
    
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({ message: "Status inValid"});
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if(!connectionRequest){   
      return res.status(404).json({ message: "Connection Request not found"})
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    
    res.json({ message: "Connection request " + status, data });
  } catch (error) {
    res.status(400).send("Error" +  error.message)
  }
});

  module.exports= requestRouter;