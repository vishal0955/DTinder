const express = require("express");
const userRouter  = express.Router();

const { userAuth } = require("../middlewares/Auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

 
const USER_SAFE_DATA = "firstName lastName age photo gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
   try {
    const loggedInUser = req.user;
    
    const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id, status: "interested" ,       
    }).populate("fromUserId", USER_SAFE_DATA)
    // .populate("User", ["firstName", "lastName", "age", "photo"])
    res.json({
         message: "Data fetched Successfully",
        data: requests 
    });
   } catch (error) {
    res.status(400).send("Error" + error.message)
   } 
})

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("fromUserId", USER_SAFE_DATA)

         const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({ data })
    } catch (error) {
        res.status(400).send("Error" + error.message)
    }
})

// Feed API 

userRouter.get("/feed", userAuth, async (req,res) => {
   
   try {

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit =  parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1)* limit;

    const connectionRequest = await ConnectionRequest.find({
        $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id }]
    }).select("fromUserId toUserId");

    const hideUsersfromFeed = new Set();
    connectionRequest.forEach((req) => {
        hideUsersfromFeed.add(req.fromUserId.toString()),
        hideUsersfromFeed.add(req.toUserId.toString())
    });
    
    const users =  await User.find({
        $and: [
            {_id :{$nin: Array.from(hideUsersfromFeed)} },
            {_id: {$ne: loggedInUser._id} }
        ],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

     res.json({data: users})

    } catch (err) {
     res.status(400).send("ERROR"+ err.message)
   } 
});

module.exports = userRouter;