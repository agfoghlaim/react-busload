//Delete, not used

import React, { Component } from 'react';


class UserProfile extends Component {
        


  // sendReset = ()=>{
  //   const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
  //   const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
  //   let resetUrl = `${domain}getOobConfirmationCode?key=${key}`;

  //   let options = {
  //     requestType:'PASSWORD_RESET',email:this.props.userInfo.email
  //   }
  //   axios.post(resetUrl,options)
  //   .then(r=>{
  //     console.log("sent ", r)
  //   })
  //   .catch(e=>{
  //     console.log(e)
  //     console.log({...e})
  //   })

  // }


  render(){
    return<div>

  <p>User Name: {this.props.userInfo.displayName}</p>

  <p>Email: {this.props.userInfo.email}  {(this.props.userInfo.emailVerified) ? ' (verified)' : ' (not verified)'}</p>
  {/* <button onClick={this.sendReset}>Reset Password</button> */}
</div>
  }
}

export default UserProfile;