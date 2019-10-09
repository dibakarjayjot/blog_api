const _ =require("lodash");
const bcrypt=require("bcryptjs");
const auth=require("../middleware/auth");
const {User, validate} = require("../models/user");

const Joi = require("joi");
const express = require("express");
const router = express.Router();
const admin = require('../middleware/admin');
const paginate = require('express-paginate');

router.post("/signup", async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send({
   success:false,
   message:"User Already Registered." 
  });


  user=new User(_.pick(req.body, ["name", "email", "password"]));
  const salt=await bcrypt.genSalt(10);
  user.password =await bcrypt.hash(user.password, salt);

  await user.save();
  const token=user.generateAuthToken()
  res.header("x-auth-token", token).send({name:user.name,email:user.email,success:true});
});



router.post("/signin", async (req, res) => {
  const {error} = validatesignin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send({
  success:false,
  message:"Invalid Email"
});

  const validpassword=await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send({
    success:false,
    message:"Invalid Password"
  });
  
  const token=user.generateAuthToken();
  res.send({token: token, message: "login Success",success:true,user:user});
});

function validatesignin(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(user, schema);
}

router.get('/get/:user_id', auth ,async(req,res)=>{
    
  User.findOne({_id:req.params.user_id},{password:0}).then((result)=>{
      res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
    })
    .catch((error)=>{
    res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
    })
    
  
   
  })
  
  router.get('/getall',admin, auth ,async(req,res)=>{
    
    User.find({},{password:0}).then((result)=>{
        res.status(HttpCodes.OK).send({success:true,Response:result,message:"save successfull"})
      })
      .catch((error)=>{
      res.status(HttpCodes.BAD_REQUEST).send({success:false,Error:error,message:"save failed"})
      })
      
    
     
    })



module.exports=router;
