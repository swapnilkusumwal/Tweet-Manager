var express = require('express');
var router = express.Router();
var passport=require('passport');
var Agents=require('../models/agents');
const querystring = require('querystring'); 
const url = require('url');   
function findUserForLogin(email,password){
  return Agents.findOne({email:email,password:password});
}

router.get('/failed',(req,res)=>{
  res.redirect(url.format({
    pathname:"http://localhost:3001/login"
  }));
})

router.get('/',passport.authenticate('twitter'))

router.post('/',async (req,res,next)=>{

  let {email,password}=req.body;

  let user=await findUserForLogin(email,password);
  if(user){
    res.setHeader('Content-Type','application/json');
    res.statusCode=200;
    res.send({key:user});
  }
  else{
    res.setHeader('Content-Type','application/json');
    res.statusCode=401;
    res.statusMessage="Invalid login details";
    res.send({user:email});
  }

})

module.exports = router;
