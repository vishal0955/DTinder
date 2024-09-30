const express = require("express");
 const app = express();



 app.use("/test",(req,res) => {
    res.send("This is test pade")
 })

 app.use("/",(req,res) => {
    res.send("this is homepage");
 })

 app.listen(3000, ()=>{
      console.log("app listening on PORT 3000")
 })