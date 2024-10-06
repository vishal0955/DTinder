const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");
app.use(express.json())


app.post("/signup", async (req,res) => {
  const user = new User(req.body);

  try{
    await user.save();
    res.send("user added")
  }catch(error){
    res.status(400).send("went wrong ")
  }
})

//api to get all users 
app.get("/users",async (req,res) => {
     try {
      const users = await User.find();
      res.send(users);
     } catch (error) {
      res.status(401).send("something went wrong")
     }

})
//api to get a one user
app.get("/user",async (req,res) =>{
   const Email = req.body.emailAddress;
   console.log(Email);
  try{
    const user = await User.find( {emailAddress: Email});
   res.send(user);
  }catch(error){
    res.status(401).send("Something went wrong")
  }
})

//api to delete one user 
app.delete("/delete", async(req,res) => {
  const userId = req.body._id;
  try{
  await User.findOneAndDelete({_id: userId})
  res.send("user Deleted")
  }catch(err){
    res.status(404).send("update failed" + err.message)
  }
})
//update api 
app.patch("/update",async(req,res) => {
  const userId = req.body.userId;
  const Data= req.body;
  try{
  await User.findByIdAndUpdate({_id: userId},Data,{
    returnDocuments: "after",
    runValidators: true,
  })
  res.send("user updated successfully")
  }catch(error){
    res.status(400).send("Update Failed"+ error.message);
  }


})

connectDb().then( () => {
  console.log("db is connected ");
  app.listen(3000, ()=>{
    console.log("app listening on PORT 3000")
}) }
)
.catch(err => (
  console.log(err)
  
)) 


 