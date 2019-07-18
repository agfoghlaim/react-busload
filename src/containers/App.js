import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';
//import * as firebase from 'firebase';
import Layout from '../components/Layout/Layout';

import FindStop from './FindStop';
import Auth from './Auth/Auth';

//import Header from '../components/Header/Header';
import UserSection from '../components/UserSection/UserSection'

import SingleStopSnap from '../components/SingleStopSnap/SingleStopSnap';
import BusRouteStopsList from '../components/BusRouteStopsList/BusRouteStopsList';
//import Weather from '../components/Weather/Weather';
//import Pagination from '../components/Pagination/Pagination';
import styles from './App.module.css';

// const firebaseConfig = {
//   apiKey: "AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs",
//   authDomain: "busload-8ae3c.firebaseapp.com",
//   databaseURL: "https://busload-8ae3c.firebaseio.com",
//   projectId: "busload-8ae3c",
//   storageBucket: "",
//   messagingSenderId: "403334506746",
//   appId: "1:403334506746:web:bc8e738bf317ce2e"
// };

// firebase.initializeApp(firebaseConfig);
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  state={ idToken:null, userId:null,expiresAt:null,isUser:false,displayName:null,emailVerified:null }


  handleLogin =(idToken,userId,expiresAt,displayName,emailVerified)=>{
    //console.log("handle login disloayname?", displayName)
   // console.log("updating app.js state userId ", userId)
    this.setState({idToken:idToken,userId:userId,expiresAt:expiresAt,isUser:true,displayName:displayName,emailVerified:emailVerified})

    //redirect to home page (with visible user section)
   
    
  }

  handleLogOut = () =>{
    this.setState({idToken:null, userId:null,expiresAt:null,isUser:false,displayName:null})
    localStorage.clear();
  }

  /*
  AUTHENTICATION - need to check localStorage every time
  if there's a token, check if it hasn't expired and login if not
  if it has expired, delete? logout
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
        this.handleLogin(idToken,userId,expiresAt,displayName,emailVerified)
      }else{
        localStorage.clear()
      }
    }else{
      return;
    }
 
  }





  render() {
 //console.log("APP, ", this.state)
    return (
      <BrowserRouter>
        <ApolloProvider client={client} >
          <Layout userDets ={this.state} handleLogOut={this.handleLogOut}>
        <div className={styles.App}>
  
          {/* <Route path='/' render={(props) => <Header {...props} userDets ={this.state} handleLogOut={this.handleLogOut} />}
          /> */}
      
          <Route path='/auth' render={(props) => <Auth {...props} handleLogin={this.handleLogin} handleLogOut={this.handleLogOut} idToken={this.state.idToken} userDets ={this.state} />}
          />
         
        {
          (this.state.isUser) ?
                  <Route path='/' render={(props) => <UserSection {...props} userDets ={this.state} />}
                  />
          : null
   
        }
  

          <Route path='/' exact render={(props) => <FindStop {...props} userDets ={this.state} />}
          />

          {/* <Route path='/:route/:direction/' component={Pagination} /> */}
          
          
          <Route  path='/:route/:direction/:bestopid/' component={SingleStopSnap} />
         
          <Route path='/:route/:direction/' exact component={BusRouteStopsList} />
          
        </div>
        </Layout>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
