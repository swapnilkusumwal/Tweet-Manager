import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import ForumIcon from '@material-ui/icons/Forum';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import StorefrontIcon from '@material-ui/icons/Storefront';
import { Grid, List, ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DonutLargeRoundedIcon from '@material-ui/icons/DonutLargeRounded';
import Avatar from '@material-ui/core/Avatar';
import icon from './icon.png';
let sideIcons=[<QueryBuilderIcon/>,<HomeIcon/>,<PeopleIcon/>,<ForumIcon/>,<CreditCardIcon/>,<StorefrontIcon/>];


const useStyles = makeStyles((theme) => ({
  sidebar:{
    height:'100vh',
    width:'60px',
    backgroundColor:'#F5F5F5'
  }
}));

export default function SideBar(props) {
  const classes = useStyles();

  return (
      <Grid className={classes.sidebar} style={{position:'relative'}} item>
        <ListItem button key={11} style={{marginTop:'2vh',marginBottom:'5vh'}}>
          <img src={icon} alt="icon" style={{width:'30px',paddingTop:'10px'}}/>
        </ListItem>
        <List>
          {sideIcons.map((item, index) => (
            <ListItem button key={index} style={{marginTop:'2vh'}}>
              <ListItemIcon>{item}</ListItemIcon>
            </ListItem>
          ))}
        </List>
        <ListItem button key={9} style={{bottom:'12vh',position:'absolute',width:'60px'}}>
          <DonutLargeRoundedIcon/>
        </ListItem>
        <ListItem button key={10} style={{bottom:'5vh',position:'absolute',width:'60px',padding:'10px'}}>
          <Avatar alt="dp" src={props.photoUrl} />
        </ListItem>
        
      </Grid>
  );
}
