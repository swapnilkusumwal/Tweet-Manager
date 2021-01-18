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

async function addTweet(id,tweet){
  let user=await getUser(id);
  if(user){
    let val=user.hashMap.get(tweet.in_reply_to_status_id_str);
    console.log(val);
    if(val){
      user.tweets[val-1].push(tweet);
      let hash=new Map(user.hashMap);
      hash.set(tweet.in_reply_to_status_id_str,val);
      user.hashMap=hash;
      console.log("??");
      console.log(user);
      user.save();
    }
    else{
      user.tweets.push([tweet]);
      let hash=new Map(user.hashMap);
      hash.set(tweet.id_str,user.tweets.length);
      user.hashMap=hash;
      console.log("?");
      user.save();
    }
  }
  else{
    console.log("NOTHING");
  }
}

router.get('/',async function(req, res, next) {
  // console.log(req.user);
  const {token,tokenSecret}=req.user;
  let T=await createTwit(token,tokenSecret);
  var stream =await T.stream('statuses/filter',{track:'@rockcool08'})
  stream.on('tweet', async (tweet)=> {
    console.log('-----');
    await addTweet(req.user.profile.id,tweet);
  })
  res.redirect(url.format({
    pathname:"http://localhost:3001/loggedin/",
    query: {
      token:req.user.token,
      tokenSecret:req.user.tokenSecret,
      id:req.user.profile.id,
      displayName:req.user.profile.displayName,
      username:req.user.profile.username
    }
  }));
})

router.post('/',(req,res)=>{
  T.post('/statuses/update', {status:req.body.status,in_reply_to_status_id:req.body.replyto} , (error, tweet, response) => {//use str wala id
    if(error) {
      res.sendStatus(500);
      console.log(error);
    }
  })
})

module.exports = router;
