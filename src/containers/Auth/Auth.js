import React, { Component } from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import firebase from '../../config/fbConfig';
import { Redirect }from 'react-router-dom';
import { dealWithFirebaseRegister,dealWithFirebaseLogin,checkIfValid } from '../../helpers';
import ResetPassForm from '../../components/ResetPassForm/ResetPassForm';
import styles from './Auth.module.css';
import axios from 'axios';



class Auth extends Component{

  componentDidMount(){
   
  }

  state={
      showRegisterForm:true,
      usernameField:{
        username:'',
        validity:{isValid:true,validMsgs:[]},
        rules:{required:true,minLength:3,maxLength:20,charNum:true}},
      passwordField:{password:'',
        validity:{isValid:true,validMsgs:[]},
        rules:{required:true,minLength:6,maxLength:20}},
      emailField:{email:'',
        validity:{isValid:true,validMsgs:[],maxLength:20},
        rules:{required:true,minLength:5,email:true}},
      idToken:null,
      userId:null,
      error:null,
      loginFail:null,
      registerFail:null,
      resetFail:null,
      resetSent:null,
      emailVerifyRequired:false,
      showReset:false
  }


  componentDidUpdate(){
    if(this.state.registerFail !==null){
      setTimeout(()=>{ 
       this.setState({registerFail:null})
      },  5000)
    }
    if(this.state.loginFail !==null){
      setTimeout(()=>{ 
       this.setState({loginFail:null})
      },  5000)
    }
    if(this.state.resetFail !==null){
      setTimeout(()=>{ 
       this.setState({resetFail:null})
      },  5000)
    }
    if(this.state.resetSent !==null){
      setTimeout(()=>{ 
       this.setState({resetFail:null})
      },  5000)
    }
  }
  handleSwitchBetweenLoginRegisterForms  = ()=>{
    this.setState(previousState =>{
      return { showRegisterForm : !previousState.showRegisterForm,showReset:false}
    })
  }

 

  handleShowResetPassForm  = ()=>{
    this.setState({showReset:true})
  }

  handleResetPass = (e)=>{
    e.preventDefault();
    if(!this.checkValidOnSubmit('reset')){
      console.log("ignoring form")
      this.showFormNotSubmitted('reset')
      return false
    }

    console.log("mail to ", this.state.emailField.email)
    const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
    const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
    let resetUrl = `${domain}getOobConfirmationCode?key=${key}`;

    let options = {
      requestType:'PASSWORD_RESET',email:this.state.emailField.email
    }
    axios.post(resetUrl,options)
    .then(r=>{
      this.setState({resetSent:'Email sent. Please check your mail and follow the link to reset password.'})
    })
    .catch(e=>{
      console.log(e)
      console.log({...e})
      this.setState({resetFail:'Email not sent..'})
    })
  }

  loginSuccess = (userDets)=>{
    
    /*

    Login was originally implemented with Firebase Auth Rest API with user's token saved to local storage. Code has been changed to use SDK methods (because of problems using REST API version with Firebase Storage in UserProfile Component). 

    */
  
   if(!userDets.emailVerified || userDets.emailVerified === 'false'){
    this.setState({loginFail:'Please verify your email'})
    return;
   }

   firebase.auth().currentUser.getIdTokenResult(false)
   .then(r=>{
    //console.log("user dets ", userDets)
    let willExpireAt = r.expirationTime;

     localStorage.setItem('idToken',r.token);
     localStorage.setItem('userId',userDets.uid);
     localStorage.setItem('expiresAt', willExpireAt);
     localStorage.setItem('displayName', userDets.name);
     localStorage.setItem('email', userDets.email);
     localStorage.setItem('emailVerified', userDets.emailVerified);
     
     //need to get photoUrl and  profilePicName from users collection
     firebase.database().ref('/users/' + userDets.uid).once('value').then((snapshot)=>{

        //if no user collection
        if(!snapshot.val()){
          localStorage.setItem('photoURL',null);
          localStorage.setItem('profilePicName', null);

          //App state will === local storage
          this.props.handleLogin(
            r.token,
            userDets.uid,
            willExpireAt,
            userDets.name,
            userDets.email,
            userDets.emailVerified,
            null,
            null
           )
        }else{
              
          localStorage.setItem('photoURL', snapshot.val().photoURL);
          localStorage.setItem('profilePicName', snapshot.val().profilePicName);

          this.props.handleLogin(
            r.token,
            userDets.uid,
            willExpireAt,
            userDets.name,
            userDets.email,
            userDets.emailVerified,
            snapshot.val().photoURL,
            snapshot.val().profilePicName
          )
        }
      })
      .catch(e=>console.log("snap ", e))
     

     
   
 

   })//end getIdTokenResult
   .catch(e=>console.log("ERR ", e))
  

 


   /*
   
   OLD VERSION
   
   */
  //  if(!userDets.data.users[0].emailVerified || userDets.data.users[0].emailVerified === 'false'){
  //   this.setState({loginFail:'Please verify your email'})
  //   return;
  //  }
 
    // let willExpireAt = new Date(new Date().getTime() + parseInt(loginResp.data.expiresIn)*1000)
    // console.log(userDets.data.users[0])
    // localStorage.setItem('idToken',loginResp.data.idToken);
    // localStorage.setItem('userId',loginResp.data.localId);
    // localStorage.setItem('expiresAt', willExpireAt);
    // localStorage.setItem('displayName', loginResp.data.displayName);

    //call handleLogin, so app.js state can be updated

    // this.props.handleLogin(loginResp.data.idToken,loginResp.data.localId,willExpireAt,loginResp.data.displayName,userDets.data.users[0].emailVerified)
  }

  registerSuccess=()=>{
    //show login form
    //email sent message
    //then change login to refuse if email not verified
    this.setState({emailVerifyRequired:true});
    this.handleSwitchBetweenLoginRegisterForms();
    console.log("register success, should show login form")

    

  }

  resetFail = (errormsg)=>{
 
    this.setState({resetFail:'Email not sent'})
  }
  loginFail = (errorMsg) =>{
    console.log(errorMsg)
    if(errorMsg === 'EMAIL_NOT_FOUND' || 'INVALID_EMAIL'){
      this.setState({loginFail:'There is no user record corresponding to this email.'})
    }
    if(errorMsg === 'INVALID_PASSWORD'){
      this.setState({loginFail:'The password is invalid.'})
    }
    if(errorMsg === 'USER_DISABLED'){
      this.setState({loginFail:'The user account has been disabled by an administrator.'})
    }
    if(!errorMsg){
      this.setState({loginFail:'Login form not submitted.'})
    }
  }

  registerFail = (errorMsg)=>{
    //console.log(errorMsg)
    if(errorMsg ==='EMAIL_EXISTS'){
      this.setState({registerFail:'The email address is already in use by another account.'})
    }
    if(errorMsg ==='OPERATION_NOT_ALLOWED'){
      this.setState({registerFail:'Password sign-in is disabled for this project.'})
    }
    if(errorMsg ==='TOO_MANY_ATTEMPTS_TRY_LATER'){
      this.setState({registerFail:'We have blocked all requests from this device due to unusual activity. Try again later.'})
    }
    if(!errorMsg){
      this.setState({registerFail:'Register form not submitted.'})
    }
  }


  handleLogOut = () =>{
    this.props.handleLogOut();
    firebase.auth().signOut()
    .then(()=>{})
    .catch(e=>console.log("error signing out of fb"))
    
  }

  checkValidOnSubmit=(registerOrLogin) =>{
    console.log("val")
    if(registerOrLogin === 'login'){
      if(this.state.emailField.validity.isValid && this.state.passwordField.validity.isValid && this.state.emailField.email.length && this.state.passwordField.password.length){
        return true
      }else{return false;}
    }
    if(registerOrLogin === 'register'){
      if(this.state.emailField.validity.isValid && this.state.passwordField.validity.isValid && this.state.usernameField.validity.isValid && this.state.emailField.email.length && this.state.passwordField.password.length && this.state.usernameField.username.length){
        return true
      }else{return false;}
    }
    if(registerOrLogin === 'reset'){
      if(this.state.emailField.validity.isValid && this.state.emailField.email.length ){
        return true
      }else{return false;}
    }
  }

  showFormNotSubmitted = (registerOrLogin)=>{
    if(registerOrLogin === 'register'){
      this.registerFail();
    }
    if(registerOrLogin === 'login'){
      this.loginFail();
    }
    if(registerOrLogin === 'reset'){
      this.resetFail();
    }
  }

  handleFormSubmit = (e,registerOrLogin)=>{
    e.preventDefault();
    if(!this.checkValidOnSubmit(registerOrLogin)){
      console.log("ignoring form")
      this.showFormNotSubmitted(registerOrLogin)
      return false
    }

    const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
    const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
    let registerUrl = `${domain}signupNewUser?key=${key}`;
    let loginUrl = `${domain}verifyPassword?key=${key}`; 
    let getInfoUrl = `${domain}getAccountInfo?key=${key}`; 
    let setInfoUrl = `${domain}setAccountInfo?key=${key}`;
    let sendEmailUrl = `${domain}getOobConfirmationCode?key=${key}`

    let newUser = {
      email:this.state.emailField.email,
      password:this.state.passwordField.password,
      returnSecureToken:true
    }

    let newUserDetails = {
      idToken:undefined,
      displayName:this.state.usernameField.username,
      photoUrl:'',
      returnSecureToken:true
    }

    if(registerOrLogin === 'login'){
      let resp = dealWithFirebaseLogin(loginUrl,getInfoUrl,newUser)
      resp.then(r=>{
          this.loginSuccess(r.userDetsResp)
      })
      //.catch(e=>this.loginFail(e.response.data.error.message))
      .catch(e=>this.loginFail("Error Logging in"))
    }else{
      let resp = dealWithFirebaseRegister(registerUrl,getInfoUrl,setInfoUrl,sendEmailUrl,newUser,newUserDetails)
      resp.then(r=>this.registerSuccess(r.response,r.userDetsResp))
      .catch(e=>this.registerFail(e.response.data.error.message))
    }

  }//end handle form submit


  // checkIfValid = (rules,toCheck)=>{
  //   //will change isValid value in appropiate toCheck
  //   //let isValid = true;
  //   let validity = {isValid:true,validMsgs:[]}
  //  // console.log("is valid? ", toCheck)
  //   if(rules.required){
  //     validity.isValid = toCheck.trim() !== '' && validity.isValid;
  //     if(!validity.isValid) validity.validMsgs.push('Required Field')
  //   }
  //   if(rules.minLength){
  //     validity.isValid = toCheck.length >= rules.minLength && validity.isValid
  //     if(!validity.isValid) validity.validMsgs.push(`Should be ${rules.minLength}+ characters`)
  //   }
  //   if(rules.maxLength){
  //     validity.isValid = toCheck.length <= rules.maxLength && validity.isValid
  //     if(!validity.isValid) validity.validMsgs.push(`Should ${rules.maxLength} characters or less`)
  //   }
  //   if(rules.email){
  //     const re = /\S+@\S+\.\S+/;
  //     validity.isValid = re.test(toCheck) && validity.isValid
  //     if(!validity.isValid) validity.validMsgs.push(`Please enter a valid email`)
  //   }
  //   if(rules.charNum){
  //     const re = /[^A-Za-z0-9-]/
  //     validity.isValid = !re.test(toCheck) && validity.isValid
  //     if(!validity.isValid) validity.validMsgs.push(`Please enter letters or numbers only`)
  //   }
  //   console.log("isvalid is ", validity.isValid)
  //   return validity;
 
  // }


//for login and reg forms
  handleAnyInputChange = (e) =>{


    //if there is a submission error clear
    //[now handled with timeouts in did mount]
    // if(this.state.loginFail || this.state.registerFail){
    //   let oldState = {...this.state}
    //   oldState.registerFail = null;
    //   oldState.loginFail = null;
    //   this.setState({...oldState})

    // }else{
    //   //console.log("not updating")
    // }


    let newState = {...this.state}

    //find field that has changed, check it's validity
    let findStr = `${e.target.id}Field`
    //console.log(`${e.target.id}Field`,findStr)
    newState[`${findStr}`][`${e.target.id}`] = e.target.value
    newState[`${findStr}`][`validity`] = checkIfValid(newState[`${findStr}`].rules, e.target.value)
   // console.log("setting state to ", newState)
    this.setState({...newState})
  // console.log(this.state[`${findStr}`][`${e.target.id}`])
  }


  render(){
    //console.log("props has no idtoken? ", this.props)
    return(
      <div className={styles.authComp}>
    

        {
          (this.props.idToken) ? 
          
          <Redirect to='/'/>

          : null
        }

        {
          (this.state.showRegisterForm && !this.state.showReset) ?
        
    
        <RegisterForm 
        registerFail = {this.state.registerFail}
        emailValue = {this.state.emailField.email}
        emailValidity = {this.state.emailField.validity}
        passwordValue = {this.state.passwordField.password}
        passwordValidity = {this.state.passwordField.validity}
        usernameValue = {this.state.usernameField.username}
        usernameValidity = {this.state.usernameField.validity}
        handleSubmit={this.handleFormSubmit}
        handleAnyInputChange={this.handleAnyInputChange} />
     
        :
        (!this.state.showRegisterForm && !this.state.showReset) ?
        <LoginForm 
        emailVerifyRequired={this.state.emailVerifyRequired}
       loginFail = {this.state.loginFail} 
        emailValue = {this.state.emailField.email}
        emailValidity = {this.state.emailField.validity}
        passwordValue = {this.state.passwordField.password}
        passwordValidity = {this.state.passwordField.validity}
        handleSubmit={this.handleFormSubmit}
        handleAnyInputChange={this.handleAnyInputChange}
         />

         :
         
         <ResetPassForm
         handleResetPass={this.handleResetPass}
         handleAnyInputChange={this.handleAnyInputChange}
         emailValidity={this.state.emailField.validity}
         resetFail = {this.state.resetFail}
         resetSent = {this.state.resetSent}
         styles={styles}
         
         >

         </ResetPassForm>
        }
        {/* <button className={styles.buttonMain} onClick={this.handleLogOut}>Logout</button> */}
        <div className={styles.buttonGroup}>
          <button className={styles.buttonLikeLink} onClick={this.handleSwitchBetweenLoginRegisterForms}>{this.state.showRegisterForm ? 'Login' : 'Register'}</button>

          <button className={styles.buttonLikeLink} onClick={this.handleShowResetPassForm}>Forgot password?</button>
        </div>
      </div>
    )
  }
}

export default Auth;