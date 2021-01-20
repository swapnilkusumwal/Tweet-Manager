var express = require('express');
var router = express.Router();
var config=require('../config');
var Twit=require('twit');
var Users=require('../models/users');
var url=require('url');

const createTwit=(token,tokenSecret)=>{
  return new Twit({
    consumer_key:config.key,
    consumer_secret:config.secret,
    access_token:token,
    access_token_secret:tokenSecret
  })
}

function getUser(id){
  return Users.findOne({twitterId:id});
}

async function insertTweet(id,tweet,index){
  let user=await getUser(id);
  console.log(index);
  let tempHashMap=user.hashMap;
  await tempHashMap.set(tweet.id_str,index);
  let tempTweets=user.tweets;
  await tempTweets[index-1].push(tweet);
  await Users.updateOne({twitterId:id},{hashMap:tempHashMap,tweets:tempTweets})
  return await Users.findOne({twitterId:id});
}

router.get('/',async function(req, res, next) {

  res.redirect(url.format({
    pathname:"http://45.79.127.113:4000/loggedin/",
    query: {
      token:req.user.token,
      tokenSecret:req.user.tokenSecret,
      id:req.user.profile.id,
      displayName:req.user.profile.displayName,
      username:req.user.profile.username
    }
  }));

})

router.post('/',async (req,res)=>{
  
  let T=await createTwit(req.body.token,req.body.tokenSecret);

  T.post('/statuses/update', {status:req.body.status,in_reply_to_status_id:req.body.replyto} , async(error, tweet) => {//use str wala id
    
    if(error) {
      console.log(error);
      res.statusCode=403;
      res.statusMessage=allErrors[0].message;
      console.log(error);
    }

    else{
      let user=await insertTweet(req.body.id,tweet,req.body.index);
      res.json({key:user.tweets});
    }
  })

})

module.exports = router;

