const express = require("express");
const connectDb = require("./config/database");
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser')

app.use( cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/", userRouter);

connectDb().then( () => {
  console.log("db is connected ");
  app.listen(3000, ()=>{
    console.log("app listening on PORT 3000")
}) }
)
.catch(err => (
  console.log(err)
  
)) 


 