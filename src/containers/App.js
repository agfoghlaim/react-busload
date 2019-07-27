import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
//import * as firebase from 'firebase';
import Layout from '../components/Layout/Layout';
//import firebase from '../config/fbConfig';
import FindStop from './FindStop';
import Auth from './Auth/Auth';

//import Header from '../components/Header/Header';
import UserSection from '../components/UserSection/UserSection'
import UserProfile from '../components/UserProfile/UserProfile';
import SingleStopSnap from '../components/SingleStopSnap/SingleStopSnap';
import BusRouteStopsList from '../components/BusRouteStopsList/BusRouteStopsList';
//import Weather from '../components/Weather/Weather';
//import Pagination from '../components/Pagination/Pagination';
import styles from './App.module.css';




const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  // state={ 
  //   idToken:null, 
  //   userId:null,
  //   expiresAt:null,
  //   isUser:false,
  //   displayName:null,
  //   email:null,
  //   emailVerified:null,
  //   photoURL:null,
  //   profilePicName:null,
  //   currentUser:{idToken:null, userId:null,expiresAt:null,isUser:false,displayName:null,emailVerified:null,photoURL:null}
  // }
  state={ 
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
 

  handleLogin =(idToken,userId,expiresAt,displayName,email,emailVerified, photoURL, profilePicName)=>{

    this.setState({
      idToken:idToken,
      userId:userId,
      expiresAt:expiresAt,
      isUser:true,
      displayName:displayName,
      email:email,
      emailVerified:emailVerified,
      photoURL:photoURL,
      profilePicName:profilePicName
    })

    
  }

  handleLogOut = () =>{
    this.setState({idToken:null, userId:null,expiresAt:null,isUser:false,displayName:null, currentUser:{idToken:null, userId:null,expiresAt:null,isUser:false,displayName:null,emailVerified:null,photoURL:null}})
    localStorage.clear();  
  }

  handleUpdateUserProfile = (name,url,profilePicName)=>{
    console.log("app updating profile",name,url,profilePicName)

    this.setState(()=>{ 
      return {
        displayName:name,
        photoURL:url,
        profilePicName:profilePicName
      }
    }, );
        localStorage.setItem('displayName', name);
        localStorage.setItem('photoURL',url);
        localStorage.setItem('profilePicName', profilePicName);

  }

  handleDeleteProfilePic = ()=>{
    this.setState(()=>{ 
      return {
        photoURL:null,
        profilePicName:null
      }
    }, );
        localStorage.setItem('photoURL',null);
        localStorage.setItem('profilePicName', null);
  }


  /*
  AUTHENTICATION - need to check localStorage every time
  if there's a token, check if it hasn't expired and login if not
  if it has expired, delete? logout

  UPDATE TODO: should check firebase currentUser not localStorage
  */


  componentDidMount(){

    let idToken = localStorage.getItem('idToken');
    if(idToken){
      //check it not expired
      let expiresAt = localStorage.getItem('expiresAt');
      if(new Date(expiresAt).getTime() > new Date().getTime()){
      
        let userId = localStorage.getItem('userId')
        let displayName = localStorage.getItem('displayName')
        let emailVerified = JSON.parse(localStorage.getItem('emailVerified'))
        let email = localStorage.getItem('email');
        let photoURL = localStorage.getItem('photoURL');
        let profilePicName = localStorage.getItem('profilePicName')

        this.handleLogin(idToken,userId,expiresAt,displayName,email,emailVerified, photoURL, profilePicName)
        // this.handleLogin(idToken,userId,expiresAt,displayName,emailVerified)
      }else{
        localStorage.clear()
      }
    }else{
      return;
    }
 
  }

/*




*/



  render() {
 //console.log("APP, ", this.state)
    return (
      <BrowserRouter>
        <ApolloProvider client={client} >
          <Layout userDets ={this.state} handleLogOut={this.handleLogOut}>
        <div className={styles.App}>
  
          {/* <Route path='/' render={(props) => <Header {...props} userDets ={this.state} handleLogOut={this.handleLogOut} />}
          /> */}
        <Switch>
          <Route path='/auth' render={(props) => <Auth {...props} handleLogin={this.handleLogin} handleLogOut={this.handleLogOut} idToken={this.state.idToken} userDets ={this.state} />}
          />
         
        {
          (this.state.isUser) ?
              <Route path='/' exact render={(props) => <div>
                <UserSection {...props} userDets ={this.state} />
                <FindStop {...props} userDets ={this.state} />
                </div>
                }
              />
          : null
   
        }
          {
          (this.state.isUser) ?
                  <Route 
                  path='/user/:uid' render={(props) => <UserProfile {...props} handleUpdateUserProfile={this.handleUpdateUserProfile}  userDets={this.state} handleDeleteProfilePic={this.handleDeleteProfilePic}  />}
                  />
          : null
   
        }
  

          <Route 
            path='/' 
            exact render={(props) => <FindStop {...props} userDets ={this.state} />}
          />

          {/* <Route path='/:route/:direction/' component={Pagination} /> */}
          
        
          <Route  path='/bus/:route/:direction/:bestopid/' component={SingleStopSnap} />
         
          <Route path='/bus/:route/:direction/' exact component={BusRouteStopsList} />

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
