const adminAuth = (req,res,next) => {
    const token = "xyzghj";
    const isAuthoruised = token ==="xyz"
    if(!isAuthoruised) { res.status(401).send("unauthorised access")}
    else{
      next();
    }
}

const  userAuth = (req,res,next) => {
    const token ="xyz";
    const isAuthorised = token === "xyz";
    if(!isAuthorised){
      res.status(401).send("unAuthorised access ")
    } 
    else {
      next();
    }
  }

  module.exports = { adminAuth, userAuth, }