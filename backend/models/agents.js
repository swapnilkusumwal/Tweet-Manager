var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var agentSchema=new Schema({
  email:{
    type:String,
    unique:true
  },
  password:String
,},{timestamps:true});

module.exports=mongoose.model("agents", agentSchema);