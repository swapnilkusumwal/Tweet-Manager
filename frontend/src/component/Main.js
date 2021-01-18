import React from 'react';
import {Switch , Route, Redirect , withRouter} from 'react-router-dom';
import './style.css';
import Login from './Login';
import LoggedIn from './LoggedIn';
import TwitterData from './TwitterData';
function Main(props){
  return(
    <Switch location={props.location}>
      <Route path='/loginpage' component={Login} />
      <Route path='/loggedin' component={LoggedIn}/>
      <Route path='/twitterdata' component={TwitterData}/>
      {/* <Route exact path='/contactus' component={()=><Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback}/>} /> */}
      <Redirect to="/loginpage" />
    </Switch>
  )
}
export default withRouter((Main));;