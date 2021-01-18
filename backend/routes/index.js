var express = require('express');
var router = express.Router();
var passport=require('passport');

router.get('/',(req,res)=>{
  res.render('index',{title:"Express1"})
})

module.exports = router;
