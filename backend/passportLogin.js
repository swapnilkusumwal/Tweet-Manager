var passport=require('passport');
var config=require('./config');
var Users=require('./models/users');
var Strategy=require('passport-twitter').Strategy;
var Twit=require('twit');

const createTwit=(token,tokenSecret)=>{
  return new Twit({
    consumer_key:config.key,
    consumer_secret:config.secret,
    access_token:token,
    access_token_secret:tokenSecret
  })
}

function getAllTweets(token,tokenSecret){
  
  let T=createTwit(token,tokenSecret);
  return new Promise((resolve,reject)=>{
    T.get('statuses/mentions_timeline',{exclude_replies:false},(err,mentionedTweets)=>{
      if(err)
      reject(err);
      T.get('statuses/user_timeline',(err,tweets)=>{//use id
        if(err)
        reject(err);
        let currentTweets=tweets.filter(tweet=>{
          return tweet.in_reply_to_status_id !== null;
        })
        var allTweets=mentionedTweets.concat(currentTweets);
        resolve(allTweets);
      })
    })
  })
}

function sortTweets(allTweets){
  return allTweets.sort((a,b)=>{
    let aa=new Date(a.created_at).getTime();
    let bb=new Date(b.created_at).getTime();
    return aa-bb;
  })
}

async function arrangeTweets(allTweets){
  let arrangedTweets=[];
  let firstMention=new Map();
  allTweets=await sortTweets(allTweets);
  for(let i=0;i<allTweets.length;i++){
    if(allTweets[i].in_reply_to_status_id_str==null){
      arrangedTweets.push([allTweets[i]]);
      firstMention.set(allTweets[i].id_str,arrangedTweets.length);
    }
  }

  let tempMention=new Map(firstMention);
  for(let i=0;i<allTweets.length;i++){
    let currentTweetReplyId=(allTweets[i].in_reply_to_status_id_str);
    if(!currentTweetReplyId)
      continue;
    else if(firstMention.get(currentTweetReplyId)==undefined){
      // console.log("here2");
      firstMention.set(allTweets[i].id_str,arrangedTweets.length);
      tempMention.set(allTweets[i].id_str,arrangedTweets.length);
    }
    else{
      firstMention.set(allTweets[i].id_str,firstMention.get(currentTweetReplyId));
    }
  }
  for(let i=0;i<allTweets.length;i++){
    let currentId=tempMention.get(allTweets[i].id_str);
    // console.log(currentId);
    if(currentId!==undefined)
      continue;
    else{
      // console.log("here3");
      let index=firstMention.get(allTweets[i].id_str);
      if(index!==undefined || index !==null || index===0){
        firstMention.set(allTweets[i].id_str,index);
        arrangedTweets[index-1].push(allTweets[i]);
      }
      else{
        firstMention.set(allTweets[i].id_str,arrangeTweets.length);
        arrangedTweets.push([allTweets[i]]);
      }
    }
  }
  return {arrangedTweets,firstMention};
}

function getUser(id){
  return Users.findOne({twitterId:id});
}

function createUser(profile,arrangedTweets){
  return Users.create({
    twitterId:profile.id,
    name:profile.displayName,
    username:profile.username,
    photoUrl:profile.photos[0].value,
    hashMap:arrangedTweets.firstMention,
    tweets:arrangedTweets.arrangedTweets
  })
  .then(data=>console.log("created"))
}

let passportStrategy=new Strategy({
  
  consumerKey: config.key,
  consumerSecret: config.secret,
  callbackURL: 'http://localhost:3000/login/redirect'

  },async function(token, tokenSecret, profile, callback) {

    let currentUser=await getUser(profile.id);

    if(!currentUser){

      let allTweets=await getAllTweets(token,tokenSecret);
      let arrangedTweets=await arrangeTweets(allTweets);
      await createUser(profile,arrangedTweets);
      
    }
    return callback(null, {token, tokenSecret, profile});
})

passport.use(passportStrategy);

passport.serializeUser(function(user, callback) {
  callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
  // console.log(obj);
  callback(null, obj);
})
