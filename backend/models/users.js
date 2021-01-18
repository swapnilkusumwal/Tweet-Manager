var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema=new Schema({
  username:{
    type:String,
    unique:true
  },
  twitterId:String,
  photoUrl:String,
  name:String,
  tweets:{
    type:Array,
    default:[]
  },
  hashMap:{
    type:Map,
    default:new Map()
  }
,},{timestamps:true});

module.exports=mongoose.model("users", userSchema);