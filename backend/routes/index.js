var express = require('express');
var router = express.Router();
var passport=require('passport');

router.get('/',(req,res)=>{
  res.redirect('index.html')
})

module.exports = router;
