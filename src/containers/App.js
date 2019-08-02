import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import FindStop from './FindStop';
import Auth from './Auth/Auth';
import UserSection from '../components/UserSection/UserSection'
import UserProfile from '../components/UserProfile/UserProfile';
import SingleStopSnap from '../components/SingleStopSnap/SingleStopSnap';
import BusRouteStopsList from '../components/BusRouteStopsList/BusRouteStopsList';
import styles from './App.module.css';




const client = new ApolloClient({
  //uri: 'http://localhost:4000/graphql'
  uri:'https://intense-chamber-79062.herokuapp.com/graphql'
});

class App extends Component {
  
 
  state={ 
    selectedStop:{bestopid:'',route:'',direction:'', stopname:''},
    showStopList:false,
    loadingUser:false,
    currentUser:{
      idToken:null,
       userId:null,
       expiresAt:null,
       isUser:false,
       displayName:null,
       email:null,
       emailVerified:null,
       photoURL:null,
       profilePicName:null
    }
  }
  

  handleLogin =(idToken,userId,expiresAt,displayName,email,emailVerified, photoURL, profilePicName)=>{
  
    this.setState({
      currentUser:{
      idToken:idToken,
      userId:userId,
      expiresAt:expiresAt,
      isUser:true,
      displayName:displayName,
      email:email,
      emailVerified:emailVerified,
      photoURL:photoURL,
      profilePicName:profilePicName
    }}, ()=>{
      // console.log("updated state setting loading false"); this.setState({loadingUser:false})
    })

    
  }


  handleLogOut = () =>{
    this.setState({
      currentUser:{
        idToken:null,
         userId:null,
         expiresAt:null,
         isUser:false,
         displayName:null,
         email:null,
         emailVerified:null,
         photoURL:null,
         profilePicName:null
      }
    })
    localStorage.clear();
  }

  componentDidMount(){

    let idToken = localStorage.getItem('idToken');
    if(idToken){
      //check it not expired
      let expiresAt = localStorage.getItem('expiresAt');
      if(new Date(expiresAt).getTime() > new Date().getTime()){
      
        let userId = localStorage.getItem('userId');
        let displayName = localStorage.getItem('displayName');
        let emailVerified = JSON.parse(localStorage.getItem('emailVerified'));
        let email = localStorage.getItem('email');
        let photoURL = localStorage.getItem('photoURL');
        let profilePicName = localStorage.getItem('profilePicName');

        //ie update state
        this.handleLogin(idToken,userId,expiresAt,displayName,email,emailVerified, photoURL, profilePicName);
      }else{
       // console.log("no user set loading false")
        this.setState({loadingUser:false});
        localStorage.clear()
      }
    }else{
      return;
    }
 
  }

  handleUpdateUserProfile = (name,url,profilePicName)=>{
    //update state and localStorage 
    let stateCopy = {...this.state.currentUser}
    stateCopy.displayName = name;
    stateCopy.photoURL=url;
    stateCopy.profilePicName=profilePicName;
    this.setState({currentUser:stateCopy})

    localStorage.setItem('displayName', name);
    localStorage.setItem('photoURL',url);
    localStorage.setItem('profilePicName', profilePicName);

  }

  handleUserNameUpdated = (name)=>{
    //update state and localStorage 
    let stateCopy = {...this.state.currentUser}
    stateCopy.displayName = name;
    this.setState({currentUser:stateCopy})
  
    localStorage.setItem('displayName', name);
  }

  handleDeleteProfilePic = ()=>{

   let stateCopy = {...this.state.currentUser}
   stateCopy.photoUrl = null;
   stateCopy.profilePicName=null;
   this.setState({currentUser:stateCopy})

    localStorage.setItem('photoURL',null);
    localStorage.setItem('profilePicName', null);
  }


  /*
  AUTHENTICATION - need to check localStorage every time
  if there's a token, check if it hasn't expired and login if not
  if it has expired, delete? logout
  */
  closeStopList = ()=>{
    this.setState({showStopList:false})
  }

  setSelectedStopId = (e, selectedStop) =>{
    e.preventDefault();
    //this.setSelectedStopId();
    let {bestopid,route,direction} = selectedStop;
      
      if(!bestopid || !route || !direction) return
     
      this.setState({
        selectedStop:{bestopid,route,direction}
      }, ()=>console.log("state now ", this.state.selectedStop))
    }

    handleChooseStop = (e) =>{
      
      this.setState({searchSelectedStop:e.target.textContent,selectedStop:{
        bestopid:e.target.dataset.bestopid,
        route:e.target.dataset.route,
        direction:e.target.dataset.direction,
        stopname:e.target.dataset.stopname
      }})
    
    }

    handleShowStopsList= (e)=>{
   
      if(e.target.value.length){
        this.setState({showStopList:true})
      }else{
        this.setState({showStopList:false})
      }
  
    }
    



  render() {

    return (
      <BrowserRouter>
        <ApolloProvider client={client} >
          <Layout userDets ={this.state.currentUser} handleLogOut={this.handleLogOut}>
        <div className={styles.App}>
  
        <Switch>
          <Route path='/auth' render={(props) => <Auth {...props} handleLogin={this.handleLogin} handleLogOut={this.handleLogOut} idToken={this.state.currentUser.idToken} userDets ={this.state.currentUser} />}
          />
         
        {
         
           (this.state.currentUser.userId) ?
              <Route path='/' exact render={(props) => <div>
                <UserSection {...props} userDets ={this.state.currentUser} />
                <FindStop {...props} userDets ={this.state.currentUser} setSelectedStopId = {this.setSelectedStopId} selectedStop={this.state.selectedStop} handleChooseStop={this.handleChooseStop} handleShowStopsList={this.handleShowStopsList} handleSearchStop={this.handleSearchStop} showStopList={this.state.showStopList} closeStopList={this.closeStopList}  />
                </div>
                }
              />
          : null
         
          
   
        }


          <Route 
            path='/' 
            exact render={(props) => <FindStop {...props} userDets ={this.state.currentUser} setSelectedStopId={this.setSelectedStopId} 
            selectedStop={this.state.selectedStop} handleChooseStop={this.handleChooseStop} handleShowStopsList={this.handleShowStopsList} handleSearchStop={this.handleSearchStop} showStopList={this.state.showStopList} closeStopList={this.closeStopList}  />}
          />
  
          <Route  path='/bus/:route/:direction/:bestopid/' component={SingleStopSnap} />
         
          <Route path='/bus/:route/:direction/' exact component={BusRouteStopsList} />

          {
           (this.state.currentUser.idToken) ?
          
                  <Route 
                  path='/user/:uid' exact render={(props) => <UserProfile {...props} 
                  loading={false}
                  handleUpdateUserProfile={this.handleUpdateUserProfile}  
                  userDets={this.state.currentUser} handleDeleteProfilePic={this.handleDeleteProfilePic} handleUserNameUpdated={this.handleUserNameUpdated} setSelectedStopId = {this.setSelectedStopId} selectedStop={this.state.selectedStop} handleChooseStop={this.handleChooseStop} handleShowStopsList={this.handleShowStopsList} handleSearchStop={this.handleSearchStop} showStopList={this.state.showStopList} closeStopList={this.closeStopList}  />}
                  />
            : <Redirect to="/"/>

        }

          <Route render={()=><p>Not Found</p>}></Route>
          </Switch> 
        </div>
        </Layout>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
