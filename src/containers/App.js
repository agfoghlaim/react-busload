import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';


import FindStop from './FindStop';
import Auth from './Auth/Auth';

import Header from '../components/Header/Header';

import SingleStopSnap from '../components/SingleStopSnap/SingleStopSnap';
import BusRouteStopsList from '../components/BusRouteStopsList/BusRouteStopsList';
import styles from './App.module.css';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  state={ idToken:null, userId:null,expiresAt:null,isUser:false }


  handleLogin =(idToken,userId,expiresAt)=>{
    console.log("updating app.js state userId ", userId)
    this.setState({idToken:idToken,userId:userId,expiresAt:expiresAt,isUser:true})
  }

  handleLogOut = () =>{
    this.setState({idToken:null, userId:null,expiresAt:null,isUser:false})
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
      console.log("have id token ")
   
      //check it not expired
      let expiresAt = localStorage.getItem('expiresAt');
      if(new Date(expiresAt).getTime() > new Date().getTime()){
        console.log("it's in date, expires at", expiresAt)
        let userId = localStorage.getItem('userId')
        console.log("user id ", userId)
        this.handleLogin(idToken,userId,expiresAt)
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
        <div className={styles.App}>
          {/* <Route path='/' component={Header} /> */}
          <Route path='/' render={(props) => <Header {...props} userDets ={this.state} />}
          />
          {/* <Route path='/auth' component={Auth} /> */}
          <Route path='/' render={(props) => <Auth {...props} handleLogin={this.handleLogin} handleLogOut={this.handleLogOut} />}
          />
          {/* <Route path='/' exact component={FindStop} /> */}
          <Route path='/' exact render={(props) => <FindStop {...props} userDets ={this.state} />}
          />
          <Route path='/:route/:direction/:bestopid' component={SingleStopSnap} />
          <Route path='/:route/:direction/' exact component={BusRouteStopsList} />
        </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
