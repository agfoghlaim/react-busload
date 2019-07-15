import React, { Component } from 'react';
import axios from 'axios';

class UserProfile extends Component {
        state={userInfo:{}}

  componentDidMount(){

    // let w = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=[API_KEY]`
//     if(!this.props.userDets.idToken) return
// console.log("id token??? ", this.props)
//     const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
//     const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
//     let getInfoUrl = `${domain}getAccountInfo?key=${key}`; 
//     axios.post(getInfoUrl,{idToken:this.props.idToken})
//     .then(r=>console.log(r))
//     .catch(e=>{
//       console.log(e)
//       console.log({...e})
//     })

  }


  sendReset = ()=>{
    const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
    const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
    let resetUrl = `${domain}getOobConfirmationCode?key=${key}`;

    let options = {
      requestType:'PASSWORD_RESET',email:this.props.userInfo.email
    }
    axios.post(resetUrl,options)
    .then(r=>{
      console.log("sent ", r)
    })
    .catch(e=>{
      console.log(e)
      console.log({...e})
    })

  }


  render(){
    return<div>

  <p>displayName: {this.props.userInfo.displayName}</p>
  <p>emailVerified: {this.props.userInfo.emailVerified}</p>
  <p>email: {this.props.userInfo.email}</p>
  <button onClick={this.sendReset}>Reset Password</button>
</div>
  }
}

export default UserProfile;