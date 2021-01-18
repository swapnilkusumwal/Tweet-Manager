
var express = require('express');
var router = express.Router();
var passport=require('passport');
var Agents=require('../models/agents');

function findUser(email){
  return Agents.findOne({email:email});
}

function createUser(email,password){
  return Agents.create({
    email:email,
    password:password
  })
}

router.post('/',async (req,res,next)=>{
  console.log("ASDAS");
  let {email,password}=req.body;
  let user=await findUser(email);
  console.log(user);
  if(user){
    res.setHeader('Content-Type','application/json');
    res.statusCode=401;
    res.statusMessage="Email id already present";
    res.send({user:email});
  }
  else{
    await createUser(email,password);
    res.statusCode=200;
    res.send({key:"Successfully registered! Please login."});
  }
})

module.exports=router;