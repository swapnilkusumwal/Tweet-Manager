import React, { Component, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../config.js';
import response from './response';
import './style.css';

const Item=({tweet,index})=>{
  console.log(index);
  return(
    <div className="solid col-12" style={{margin:5,alignItems:'flex-start',justifyContent:'flex-start'}}>
      <p>Tweet id: {tweet.id}</p>
      <p>Tweeted by: @{tweet.user.screen_name}</p>
      <p>Tweet: {tweet.text}</p>
    </div>
  )
}

function MainComponent(){
  const[username,setuserName]=useState('amazon');
  const[isLoading,setLoading]=useState(0);
  const[tweets,setTweets]=useState([]);
  const handleSubmit=async()=>{
    fetch('http://localhost:3000/',{
      headers:{
        'Content-Type': 'application/json',
      },
      credentials:'same-origin'
    }).then(response => response.json())
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
  }
  if(isLoading)
  return (
    <div> textInComponent </div>
  );
  else
  return(
    <div style={{justifyContent:'center',alignItems:'center'}}>
      <input placeholder="Enter username" onChange={event=>setuserName(event.target.value)}/>
      <button style={{margin:5}} className="btn btn-primary" onClick={()=>handleSubmit()}>Submit</button>
      <ul style={{marginRight:15}}>
        {tweets.map((tweet,index)=><li key={index}><Item tweet={tweet}/></li>)}
      </ul>
    </div>
  )
}
export default MainComponent;