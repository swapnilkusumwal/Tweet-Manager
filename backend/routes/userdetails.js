
var express = require('express');
var router = express.Router();
var passport=require('passport');
var Users=require('../models/users');

function getUser(id){
  return Users.findOne({twitterId:id});
}

router.post('/',async (req,res)=>{
  // console.log(req.body);
  let user=await getUser(req.body.id);
  res.send({key:user});
})

module.exports = router;
