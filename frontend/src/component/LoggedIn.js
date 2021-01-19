import { Divider, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import React,{useEffect,useState} from 'react';
import SideBar from './SideBar';
import SearchIcon from '@material-ui/icons/Search';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import { Chip,Card, CardHeader, InputAdornment, } from '@material-ui/core';
import Loading from './LoadingComponent';
import AttachmentIcon from '@material-ui/icons/Attachment';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SendIcon from '@material-ui/icons/Send';
import io from 'socket.io-client';
var socket;
let baseUrl="http://localhost:3000/"
const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom:15
  },
  avatar: {
    backgroundColor: red[500],
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  horitonzalCenter:{
    display:'flex',
    paddingTop:'1vh',
    justifyContent:'center'
  }
}));

function UserCard({name,photoUrl,username}){

  let classes=useStyles();
  return(
    <Grid style={styles.center}>
      <Grid style={styles.userCardHeader}>
        <CancelRoundedIcon/>
      </Grid>
      <Grid className={classes.horitonzalCenter}>
        <Avatar src={photoUrl} className={classes.large}  />
      </Grid>
      <Grid className={classes.horitonzalCenter}>
        <h3>{name}</h3>
      </Grid>
      <Grid className={classes.horitonzalCenter} style={{marginTop:'-2vh'}}>
        @{username}
      </Grid>
      <Grid className={classes.horitonzalCenter}>
        <Chip
            icon={<CallIcon/>}
            label="Call"
            clickable
            style={{paddingLeft:'2px',paddingRight:'2px',marginRight:'5px'}}
          />
        <Chip
            icon={<EmailIcon/>}
            label="Email"
            clickable
          />
      </Grid>
      <Grid style={{marginTop:'25vh'}}>
        <Divider/>
      </Grid>
      <Grid style={{paddingLeft:'10px',display:'block',paddingTop:'20px'}}>
        Tasks
        <span style={{float:'right'}}><KeyboardArrowDownIcon/></span>
      </Grid>
      <Grid style={styles.checkbox}>
        <label><input type="checkbox" />Constant Task 1</label>
      </Grid>

      <Grid style={styles.checkbox}>
        <label><input type="checkbox" />Constant Task 2</label>
      </Grid>

      <Grid style={styles.checkbox}>
        <label><input type="checkbox" />Constant Task 3</label>
      </Grid>

      <Grid style={styles.checkbox}>
        All Tasks
        <Divider style={{width:'68px'}}/>
      </Grid>
      
    </Grid>  
  )
}

function IndividualChat(props){
  let tweet=props.tweet;
  return(
    <Grid style={styles.sameRow}>
      <Grid sm={10} item style={{...styles.sameRow,marginBottom:'3vh'}}>
      <Grid>
        <Avatar alt={tweet.user.name} src={tweet.user.profile_image_url_https}/>
      </Grid>
      <Grid style={styles.spaceLeftTop}>
        <Typography>{tweet.text}</Typography>
      </Grid>
      </Grid>
      <Grid item sm={2} style={styles.spaceLeftTop}>
        <Typography>{(new Date(tweet.created_at)).toString().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}).toString().substr(16,5)+'\n'+
        (new Date(tweet.created_at)).toString().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}).toString().substr(4,6)}</Typography>
      </Grid>
    </Grid>   
  )
}

function LoggedIn(props) {

  const [isLoading,setIsLoading]=useState(true);
  const [online,setOnline]=useState('Online');
  const [token,setToken]=useState('');
  const [tokenSecret,setTokenSecret]=useState('');
  const [name,setName]=useState('');
  const [id,setId]=useState('');
  const [allTweets,setAllTweets]=useState('');
  const [photoUrl,setPhotoUrl]=useState('background.jpg');
  const [currentCard,setCurrentCard]=useState(0);

  function handlePostTweet(){

    setIsLoading(true);

    let tweet=allTweets[currentCard];

    let data={
      status:document.getElementById("current").value,
      replyto:tweet[tweet.length-1].id_str,
      token:token,
      tokenSecret:tokenSecret,
      id:id,
      index:parseInt(currentCard)+1
    };
    
    fetch(baseUrl+'tweet',{
      method:'POST',
      body:JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json',
      },
      credentials:'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
    .then(response => response.json())
    .then(res=>{
      setAllTweets(res.key);
      setIsLoading(false);
    })
    .catch(error=>{alert(error.message);})
  }

  function SelectedCard(props){

    const classes = useStyles();

    return(
      <Card className={classes.root} style={styles.boxBorder}>
        <Grid item lg={12} sm={12} style={{...styles.sameRow,marginLeft:'20px',marginTop:'10px'}}>
          <Avatar src={props.tweet[0].user.profile_image_url} style={{marginTop:'10px'}}/>
          <h3 style={{marginLeft:'20px'}}>{props.tweet[0].user.name}</h3>
          <Chip
            label="Create a task"
            style={{marginLeft:'2vw',marginLeft:'30vw',paddingLeft:'10px',paddingRight:'10px',marginTop:'1.5vh',justifyContent:'flex-end'}}
          />
        </Grid>
        <Divider/>
        <Grid style={styles.selectedCard}>
          {props.tweet.map((tweet,index)=>{
            return (<IndividualChat key={index} tweet={tweet}/>)
          })}
          <Grid style={styles.bottom}>
            <Avatar src={photoUrl}/>
            <TextField
                id="current"
                key="yoyo"
                InputProps={{
                  endAdornment: <InputAdornment position="end"><AttachmentIcon/></InputAdornment>
                }}
                style={{width:'40vw',marginLeft:'1vw'}}
                size='small'
                variant='outlined'
                type="text"
                placeholder="Reply..."
              />
            <SendIcon style={{marginTop:'1vh',marginLeft:'1vw'}} onClick={()=>handlePostTweet()}/> 
          </Grid>
        </Grid>
      </Card>
    )
  }

  function ConversationCard(props) {

    const classes = useStyles();
    
    return (
      <Card onClick={()=>setCurrentCard(props.index)} className={classes.root} style={styles.boxBorder}>
        <CardHeader
        style={{paddingBottom:0,paddingTop:10}}
          avatar={
            <Avatar src={props.tweet[0].user.profile_image_url}/>
          }
          title={props.tweet[0].user.name}
        />
        <Grid style={{paddingLeft:'72px',marginBottom:'10px',marginRight:'20px'}}>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.tweet[props.tweet.length-1].text.length<=56?props.tweet[props.tweet.length-1].text:props.tweet[props.tweet.length-1].text.substr(0,56)+".."}
          </Typography>
        </Grid>
      </Card>
    );
  }

  useEffect(() => {

    setIsLoading(true);
    socket=io('/');

    socket.on('update',async (data)=>{
      console.log(data);
      setAllTweets(data.key);
    })

    socket.on('tweet',async (data)=>{
      
      console.log("data");
      let {key,index}=data;
      let tempAllTweets=allTweets;

      if(index>=allTweets.length){
        tempAllTweets.push([key]);
      }
      else{
        tempAllTweets[index].push(key);
      }

      setAllTweets(tempAllTweets);
    })//socket for streaming data

    const query = new URLSearchParams(props.location.search);

    setIsLoading(true);

    let userData={
      id:query.get('id'),
      token:query.get('token'),
      tokenSecret:query.get('tokenSecret'),
      username:query.get('username'),
    };
    
    fetch(baseUrl+'userdetails/',{
      method:'POST',
      body:JSON.stringify(userData),
      headers:{
        'Content-Type': 'application/json',
      },
      credentials:'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response;
      } else {

        console.log("IDHAR2");
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
    .then(response => response.json())
    .then(res=>{
      setName(res.key.name);
      setPhotoUrl(res.key.photoUrl);
      setAllTweets(res.key.tweets);
      setToken(query.get('token'));
      setTokenSecret(query.get('tokenSecret'));
      setId(query.get('id'))
      setIsLoading(false);
    })
    .catch(error=>alert(error.message))
    return ()=>{
      setIsLoading(false);
    }
  },[])
  
  if(!isLoading)
  return (
    <Grid container>
      <SideBar photoUrl={photoUrl}/>
      <Grid style={{width:'90vw',marginTop:10,paddingLeft:'5vw',display:'flex',flexDirection:'column'}} item>
        <Grid>
          <Grid style={{float:'left'}}>
            Updates
            <Divider/>
          </Grid>
          <Grid style={{float:'right',paddingLeft:'5vw'}}>
            User: {name}
          </Grid>
          <Grid style={{float:'right'}}>
            Session: 34 minutes
          </Grid>
        </Grid>
        <div style={{marginTop:'10vh'}}></div>
        <Grid>
          <Grid style={{display:'flex',float:'left'}}>
          <Typography variant='h4'>Conversation</Typography>
          <TextField
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
            }}
            onChange={(event, value) => console.log(event.target.value)}
            id="combo-box-demo"
            style={{marginLeft:'2vw',width:'200px'}}
            size='small'
            variant='outlined'
            type="text"
            placeholder="Quick Search"
          />
          <Chip
            icon={<SwapHorizIcon/>}
            label="Filter"
            clickable
            style={{marginLeft:'2vw',paddingLeft:'10px',paddingRight:'10px',marginTop:'0.5vh'}}
          />
          </Grid>
          <Grid style={{float:'right'}}>
          <TextField onChange={(event)=>setOnline(event.target.value)} style={{marginTop:'1vh',height:'1vh',width:'100px'}} id="select" value={online} select>
            <MenuItem value="Online" style={styles.sameRow}>
              <Grid style={{marginRight:'10px',marginTop:'3px',display:'block',float:'left',width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'green'}}></Grid>
              Online
            </MenuItem>
            <MenuItem value="Offline" style={styles.sameRow}>
              <Grid style={{marginRight:'10px',marginTop:'3px',display:'block',float:'left',width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'red'}}></Grid>
              Offline
            </MenuItem>
          </TextField>
          </Grid>
        </Grid>
        <div style={{marginTop:'5vh'}}></div>
        <Grid lg={12} item style={styles.sameColumn}>
          <Grid lg={12} item style={styles.sameRow}>
            <Grid md={3} item style={{maxHeight: '74vh', overflow: 'auto'}}>
              {allTweets!==''?allTweets.map((data,index)=>{
                return data?<ConversationCard key={index} tweet={data} index={index}/>:<div></div>
              }):<div></div>}
            </Grid>
            <Grid md={7} item style={{paddingRight:'10',paddingLeft:'20px'}}>
              {currentCard!==''?<SelectedCard tweet={allTweets[currentCard]}/>:<div></div>}
            </Grid>
            <Grid md={2} item style={{height:'70vh',paddingTop:'10px',...styles.boxBorder}}>
              {allTweets!==''?<UserCard name={allTweets[currentCard][0].user.name} photoUrl={allTweets[currentCard][0].user.profile_image_url_https} username={allTweets[currentCard][0].user.screen_name}/>:<div></div>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
  else
  return(
    <Loading/>
  )
}

const styles={
  center:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'
  },
  userCardHeader:{
    display:'flex',
    justifyContent:'flex-end',
    paddingRight:'10px'
  },
  checkbox:{
    paddingLeft:'10px',
    marginBottom:'10px'
  },
  spaceLeftTop:{
    marginLeft:'1vw',
    marginTop:'1vh'
  },
  boxBorder:{
    border:'1px solid grey'
  },
  selectedCard:{
    paddingLeft:'20px',
    marginBottom:'10px',
    marginRight:'20px',
    height:'60vh',
    maxHeight:'60vh',
    paddingTop:'3vh',
    overflow: 'auto'
  },
  bottom:{
    display:'flex',
    flexDirection:'row',
    bottom:'45px',
    position:'fixed',
    marginBottom:'5vh'
  },
  sameRow:{
    display:'flex',
    flexDirection:'row'
  },
  sameColumn:{
    display:'flex',
    flexDirection:'column'
  }
}

export default LoggedIn;