const axios = require('axios');
module.exports = {
  isWithinMinutesOf: function(busLoadTime,beTime,numMinutes){
 
    let theirDate = new Date();
    let myDate = new Date();
    
    theirDate.setHours(beTime.substr(0,2))
    theirDate.setMinutes(beTime.substr(3,2))
    
    myDate.setHours(busLoadTime.substr(0,2))
    myDate.setMinutes(busLoadTime.substr(3,2))

    //subtract the largest time from the smallest time
    var diff = Math.max(theirDate.valueOf(), myDate.valueOf()) - Math.min(theirDate.valueOf(), myDate.valueOf()); 

    diff = diff/1000/60

    //is the difference less than numMinutes???
    return (diff <= numMinutes)? true : false;
  },
  getUserInfoFromFirebase: async function(url,idToken){
    axios.post(url,{idToken})
    .then(r=>r)
    .catch(e=>console.log("error getting user info"))
  },
 
  dealWithFirebaseRegister: function(registerUrl,getInfoUrl,setInfoUrl,sendEmailUrl,newUser,newUserDetails){
    return new Promise((resolve,reject)=>{

        //for register
        axios.post(registerUrl,newUser)
        .then(response=>{
          newUserDetails.idToken=response.data.idToken;
          axios.post(setInfoUrl,newUserDetails)
          .then(resp=>{
            //now we have resp from updating the profile upon registerins
            //also need to get all the user details
           // console.log("too here?1",response.data.idToken)
              axios.post(sendEmailUrl,{requestType:'VERIFY_EMAIL',idToken:response.data.idToken})
            axios.post(getInfoUrl,{idToken:response.data.idToken})
            .then(emailResp=>{
              console.log("emailResp", emailResp)  
            })
            .then(userDetsResp=>{
             // console.log("too here?2")
              resolve({response,userDetsResp})
            })
          })
        })
        .catch(e=>reject(e))
    })
  },
  dealWithFirebaseLogin: function(loginUrl,getInfoUrl,newUser){
    return new Promise((resolve,reject)=>{
        axios.post(loginUrl,newUser)
        .then(response=>{
          axios.post(getInfoUrl,{idToken:response.data.idToken})
          .then(userDetsResp=>{
            resolve({response,userDetsResp})
          })
        })
        .catch(e=>reject(e))
      
    })
  }
}