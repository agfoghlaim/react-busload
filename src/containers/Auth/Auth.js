import React, { Component } from 'react';
import axios from 'axios';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import Logout from '../../components/Logout/Logout';


class Auth extends Component{
  state={
      showRegisterForm:true,
      email:'',
      password:'',
        idToken:null,
        userId:null,
        error:null
  }

  handleSwitchBetweenLoginRegisterForms  = ()=>{
    this.setState(previousState =>{
      return { showRegisterForm : !previousState.showRegisterForm}
    })
    
  }

  loginSuccess = (loginResp)=>{
    console.log("will handle successful login",loginResp.data)
    // loginResp.data has:
    // displayName,
    // email,
    // expiresIn
    // idToken
    // resultKeyNameFromFieldlocalId
    // refreshToken
    // registered(bool)
    this.setState({
      idToken:loginResp.data.idToken,
      userId:loginResp.data.localId,
      error:false
    })
    console.log("state updated,", this.state)
  }

  handleFormSubmit = (e,registerOrLogin)=>{

    console.log("reging",registerOrLogin)
    e.preventDefault();
    let url   = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;

    if(registerOrLogin === 'login'){
      url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
    }
  
    console.log("use ", this.state.email,this.state.password)
    let newUser = {
      email:this.state.email,
      password:this.state.password,
      returnSecureToken:true
    }
    axios.post(url,newUser)
    .then(r=>{console.log("resp", r); this.loginSuccess(r);})
    .catch(e=>{console.log("bad ", e);this.loginFail(e)})
  }
  handleInputEmailChange = (e) =>{
    console.log("handle change email")
    this.setState({email:e.target.value})
  }
  handleInputPasswordChange = (e) =>{
    console.log("handle change pass")
    this.setState({password:e.target.value})
  }


  render(){
    console.log(this.state)
    return(
      <div>
        <h3>Auth Component</h3>
        {
          (this.state.showRegisterForm) ?
        

        <RegisterForm 
        emailValue = {this.state.email}
        passwordValue = {this.state.password}
        handleEmailChange={this.handleInputEmailChange}
        handlePasswordChange={this.handleInputPasswordChange}
        handleSubmit={this.handleFormSubmit} />
        :
        <LoginForm 
        emailValue = {this.state.email}
        passwordValue = {this.state.password}
        handleEmailChange={this.handleInputEmailChange}
        handlePasswordChange={this.handleInputPasswordChange}
        handleSubmit={this.handleFormSubmit} />
        }
        <Logout />

        <button onClick={this.handleSwitchBetweenLoginRegisterForms}>Show {this.state.showRegisterForm ? 'Login' : 'Register'} instead</button>

      </div>
    )
  }
}

export default Auth;