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
  center:{
    display:'flex',
    paddingTop:'1vh',
    justifyContent:'center'
  }
}));

function UserCard({name,photoUrl,username}){
  let classes=useStyles();
  return(
    <Grid style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <Grid style={{display:'flex',justifyContent:'flex-end',paddingRight:'10px'}}>
        <CancelRoundedIcon/>
      </Grid>
      <Grid className={classes.center}>
        <Avatar src={photoUrl} className={classes.large}  />
      </Grid>
      <Grid className={classes.center}>
        <h3>{name}</h3>
      </Grid>
      <Grid className={classes.center} style={{marginTop:'-2vh'}}>
        @{username}
      </Grid>
      <Grid className={classes.center}>
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
      <Grid style={{paddingLeft:'10px',marginBottom:'10px'}}>
        <label><input type="checkbox" />Constant Task 1</label>
      </Grid>

      <Grid style={{paddingLeft:'10px',marginBottom:'10px'}}>
        <label><input type="checkbox" />Constant Task 2</label>
      </Grid>

      <Grid style={{paddingLeft:'10px',marginBottom:'10px'}}>
        <label><input type="checkbox" />Constant Task 3</label>
      </Grid>

      <Grid style={{paddingLeft:'10px',marginBottom:'10px'}}>
        All Tasks
        <Divider style={{width:'68px'}}/>
      </Grid>
      
    </Grid>  
  )
}

function IndividualChat(props){
  let tweet=props.tweet;
  return(
    <Grid style={{display:'flex',flexDirection:'row',paddingBottom:'3vh'}}>
      <Grid sm={10} item style={{display:'flex',flexDirection:'row'}}>
      <Grid>
        <Avatar alt={tweet.user.name} src={tweet.user.profile_image_url_https}/>
      </Grid>
      <Grid style={{marginLeft:'1vw',marginTop:'1vh'}}>
        <Typography>{tweet.text}</Typography>
      </Grid>
      </Grid>
      <Grid item sm={2} style={{marginLeft:'1vw',marginTop:'1vh'}}>
        <Typography>{tweet.created_at.substr(4,12)}</Typography>
      </Grid>
    </Grid>   
  )
}

function LoggedIn(props) {
  function SelectedCard(props){
    console.log("HERE");
    const classes = useStyles();
    return(
      <Card className={classes.root} style={{border:'1px solid grey'}}>
        <Grid item lg={12} sm={12} style={{display:'flex',flexDirection:'row',marginLeft:'20px',marginTop:'10px'}}>
          <Avatar src={props.tweet[0].user.profile_image_url} style={{marginTop:'10px'}}/>
          <h3 style={{marginLeft:'20px'}}>{props.tweet[0].user.name}</h3>
          <Chip
            label="Create a task"
            clickable
            style={{marginLeft:'2vw',marginLeft:'25vw',paddingLeft:'10px',paddingRight:'10px',marginTop:'1.5vh',position:'relative',right:'0'}}
          />
        </Grid>
        <Divider/>
        <Grid style={{paddingLeft:'20px',marginBottom:'10px',marginRight:'20px',height:'63vh',marginTop:'3vh',maxHeight: '63vh', overflow: 'auto'}}>
          {props.tweet.map((tweet)=>{
            return (<IndividualChat key={tweet.id_str} tweet={tweet}/>)
          })}
          <Grid style={{display:'flex',flexDirection:'row',bottom:0,position:'fixed', marginBottom:'5vh'}}>
            <Avatar src={photoUrl}/>
            <TextField
                InputProps={{
                  endAdornment: <InputAdornment position="end"><AttachmentIcon/></InputAdornment>,
                }}
                style={{width:'40vw',marginLeft:'1vw'}}
                size='small'
                variant='outlined'
                type="text"
                placeholder="Reply..."
              />
          </Grid>
        </Grid>
      </Card>
    )
  }

  function ConversationCard(props) {

    const classes = useStyles();
    return (
      <Card onClick={()=>setCurrentCard(props.index)} className={classes.root} style={{border:'1px solid grey'}}>
        <CardHeader
        style={{paddingBottom:0,paddingTop:10,boder:'1px black solid'}}
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
    const query = new URLSearchParams(props.location.search);
    setIsLoading(true);
    let userData={
      id:query.get('id')
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
      setUsername(res.key.username);
      setId(res.key.id);
      setAllTweets(res.key.tweets);
      setIsLoading(false);
    })
    .catch(error=>alert(error.message))
  },[])

  const [isLoading,setIsLoading]=useState(true);
  const [online,setOnline]=useState('Online');
  const [id,setId]=useState('');
  const [username,setUsername]=useState('');
  const [name,setName]=useState('');
  const [allTweets,setAllTweets]=useState([]);
  const [photoUrl,setPhotoUrl]=useState('background.jpg');
  const [currentCard,setCurrentCard]=useState(0);

  const [currentTweet,setCurrentTweet]=useState('');
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
        <Grid style={{flexDirection:'row'}}>
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
            style={{marginLeft:'2vw',paddingLeft:'10px',paddingRight:'10px',marginTop:'1vh'}}
          />
          </Grid>
          <Grid style={{float:'right'}}>
          <TextField onChange={(event)=>setOnline(event.target.value)} style={{marginTop:'1vh',height:'1vh',width:'100px'}} id="select" value={online} select>
            <MenuItem value="Online" style={{display:'flex',flexDirection:'row'}}>
              <Grid style={{marginRight:'10px',marginTop:'3px',display:'block',float:'left',width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'green'}}></Grid>
              Online
            </MenuItem>
            <MenuItem value="Offline" style={{display:'flex',flexDirection:'row'}}>
              <Grid style={{marginRight:'10px',marginTop:'3px',display:'block',float:'left',width:'10px',height:'10px',borderRadius:'50%',backgroundColor:'red'}}></Grid>
              Offline
            </MenuItem>
          </TextField>
          </Grid>
        </Grid>
        <div style={{marginTop:'5vh'}}></div>
        <Grid lg={12} item style={{display:'flex',flexDirection:'column'}}>
          <Grid lg={12} item style={{display:'flex',flexDirection:'row'}}>
            <Grid md={3} item style={{maxHeight: '74vh', overflow: 'auto'}}>
              {allTweets.map((data,index)=>{
                return <ConversationCard key={index} tweet={data} index={index}/>
              })}
            </Grid>
            <Grid md={7} item style={{paddingRight:'10',paddingLeft:'20px'}}>
              {<SelectedCard tweet={allTweets[currentCard]}/>}
            </Grid>
            <Grid md={2} item style={{height:'75.2vh',paddingTop:'10px',border:'1px solid grey'}}>
              <UserCard name={allTweets[currentCard][0].user.name} photoUrl={allTweets[currentCard][0].user.profile_image_url_https} username={allTweets[currentCard][0].user.screen_name}/>
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

export default LoggedIn;