
var express = require('express');
var router = express.Router();
var passport=require('passport');
var Users=require('../models/users');
var server = null;
var socketio=require('socket.io');
var Twit=require('twit');
var config=require('../config');
var io = null;

const createTwit=(token,tokenSecret)=>{
  return new Twit({
    consumer_key:config.key,
    consumer_secret:config.secret,
    access_token:token,
    access_token_secret:tokenSecret
  })
}

function setServer(serverValue){
  server=serverValue;
}

function getUser(id){
  return Users.findOne({twitterId:id});
}

async function addTweet(id,tweet){
  let user=await getUser(id);
  let val=null;
  if(user){
    let index=null;
    val=user.hashMap.get(tweet.in_reply_to_status_id_str);
    let tempHashMap=user.hashMap;
    let tempTweets=user.tweets;
    if(!val){
      index=val-1;
      tempTweets.push([tweet]);
      val=tempTweets.length;
      tempHashMap.set(tweet.id_str,tempTweets.length);
      console.log("?");
    }
    else{
      index=val-1;
      tempTweets[val-1].push(tweet);
      tempHashMap.set(tweet.id_str,val);
      console.log("??");
    }
    io.emit('update',{key:tempTweets});
    await Users.updateOne({twitterId:id},{hashMap:tempHashMap,tweets:tempTweets})
    return index;
  }
  else{
    console.log("NOTHING");
  }
}

function getUser(id){
  return Users.findOne({twitterId:id});
}

router.post('/',async (req,res)=>{
  // console.log(req.body);
  if(server != null)
    io=socketio(server);
  else
    console.error("Server not found");

  const {token,tokenSecret,username,id}=req.body;

  io.on('connection',(socket)=>{
  
    // setInterval(async()=>{
      // let getTweets=await Users.findOne({twitterId:id});
      // io.emit('update',{key:getTweets.tweets});
    // },10000);

    console.log("CONNECTED TO SOCKET"); 

    let T=createTwit(token,tokenSecret);
    console.log('@'+username);

    var stream =T.stream('statuses/filter',{track:'@'+username})
    stream.on('tweet', async (tweet)=> {
      console.log('-----');
      let index=await addTweet(id,tweet);
      // socket.emit('tweet',{key:tweet,index:index});
      // socket.emit('data',{key:"quick"});
    })
  })
  let user=await getUser(req.body.id);
  res.send({key:user});

})

module.exports = {
  router:router,
  setServer: setServer
};