const jwt= require("jsonwebtoken");
const User= require("../schema/user");


const auth = async(req,res,next)=>{

    try {const token= req.cookies.jwt;
        const verifyUser= jwt.verify(token,process.env.KEY);
        console.log(verifyUser);
        next();
        
       const data= await User.findOne({_id:verifyUser._id});
       console.log(data);
       req.token=token;
       req.user= user;

       
    } catch (error) {
        res.send(error);   
    }
    
}
module.exports=auth;

