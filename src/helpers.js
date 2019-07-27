
import firebase from './config/fbConfig';
import axios from 'axios';

  export const isWithinMinutesOf=(busLoadTime,beTime,numMinutes)=>{
 
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
  }
 export const getUserInfoFromFirebase = async (url,idToken)=>{
    axios.post(url,{idToken})
    .then(r=>r)
    .catch(e=>console.log("error getting user info"))
  }


  export const dealWithFirebaseRegister= (registerUrl,getInfoUrl,setInfoUrl,sendEmailUrl,newUser,newUserDetails)=>{
    return new Promise((resolve,reject)=>{

        //for register
        axios.post(registerUrl,newUser)
        .then(response=>{

          newUserDetails.idToken=response.data.idToken;
          axios.post(setInfoUrl,newUserDetails)
          .then(resp=>{
            //now we have resp from updating the profile upon registerins
              axios.post(sendEmailUrl,{requestType:'VERIFY_EMAIL',idToken:response.data.idToken})
              .then(w=>console.log("email sent ", w))
              .then(()=>{
                axios.post(getInfoUrl,{idToken:response.data.idToken})
                .then(userDetails=>{
                  //console.log("infoResp", emailResp)  
                })
                .then(userDetsResp=>{
                  console.log("this is userdetsresp ", newUserDetails)
                  console.log("and original resp", response)
                  //now save to Busload 'Users' collection
                  firebase.database().ref(`/users/${response.data.localId}`).set({
                    displayName: newUserDetails.displayName,
                    photoURL: newUserDetails.photoUrl,
                    email:newUser.email
                  })
                  .then(r=>{
                    console.log("successful  profile update", r)
                    resolve({response,newUserDetails})
                  })
                  .catch(e=>console.log("error updating profile",e))
                //   , function(error) {
                //     if (error) {
                //       // The write failed...
                //     } else {
                //       // Data saved successfully!
                //     }
                //   });
                // }
              
                })
              })
           
          })
        })
        .catch(e=>reject(e))
    })
  }
  // export const dealWithFirebaseLogin=(loginUrl,getInfoUrl,newUser)=>{
  //   return new Promise((resolve,reject)=>{
  //       axios.post(loginUrl,newUser)
  //       .then(response=>{
  //         console.log("at this poing check if email is verified??? ", response )
  //         axios.post(getInfoUrl,{idToken:response.data.idToken})
  //         .then(userDetsResp=>{
  //           console.log("resolving with resp: ", response)
  //           console.log("resolving with userDetsResp: ", userDetsResp)
  //           resolve({response,userDetsResp})
  //         })
  //       })
  //       .catch(e=>reject(e))
      
  //   })
  // }

  export const dealWithFirebaseLogin=(loginUrl,getInfoUrl,newUser)=>{
    //console.log(newUser);
    const { email, password } = newUser;
    return new Promise((resolve,reject)=>{
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(r=>{
     //   console.log("result from login ", r.user.uid)

        const user = firebase.auth().currentUser;
        if(user !==null){
          let theUser = {
            name:user.displayName,
            email:user.email,
            photoUrl:user.photoURL,
            emailVerified:user.emailVerified,
            uid:user.uid
          }
       
          resolve({userDetsResp:theUser})
        }

        
      })
      .catch(error=>reject(error));
      
    })
  }

