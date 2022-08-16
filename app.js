require('dotenv').config();
const express = require("express");
const app= express();
const port= process.env.PORT||2000;
const cookieParser= require("cookie-parser");



require("./db/conn");
app.use(cookieParser());
app.use(express.json());
const User= require("./schema/user");
const jwt = require("jsonwebtoken")
const bcrypt= require("bcrypt");
const auth= require('./middleware/auth')
app.get("/",(req  ,res)=>{
    res.send("hello from the home side");
})

app.get("/new",auth,(req,res)=>{
  res.send("welcome to the new page");
  
})


app.post("/register", async(req,res)=>{
  const{name,lastname,email,password,cpassword,phone}=req.body;
  if(!name||!lastname||!email||!password||!cpassword||!phone){
    res.send("please enter the all fileds");
  }
try{
    const userExist=await User.findOne({email:email})
    if(userExist){
        res.send("user is already exist")
    }
    if(password===cpassword){
       const user= await new User(req.body);
       const saveUser= await user.save()
       console.log(saveUser);
       const token= user.generateAuthtoken();
       console.log(token)
       res.cookie("jwt",token,
       {expires: new Date(Date.now()+24*60*60*1000),
        httpOnly:true
    })
      
        res.send("user registration successfully");
    }

}catch(error){
res.send(error);
  }  
})




app.post("/login",async(req,res)=>{
const{email,password}=req.body;

try{
const findUser= await User.findOne({email:email});
const isMatch= bcrypt.compare(password,findUser.password);

const token= await findUser.generateAuthtoken();
 console.log(token)
 res.cookie("jwt",token,{

  expires:new Date(Date.now()+24*60*60*1000),
  httpOnly:true
 })

if(isMatch){
    res.send("login completed");
}else{
  res.send("invalid password details");
}

}catch(error){
res.send(error)
}
})

app.get("/logout", auth, async(req,res)=>{
  
  try { 
      res.clearCookie("jwt");
    res.send("logout succesfully..")
 
    
  } catch (error) { console.log(error);
    res.status(404).send(error);
  }

})







app.listen(port,()=>{
    console.log(`server listen to the port number ${port}`);
})
