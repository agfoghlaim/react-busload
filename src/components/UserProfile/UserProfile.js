//Delete, not used

import React, { Component } from 'react';
import firebase from '../../config/fbConfig';
import ProfileForm from './ProfileForm/ProfileForm';
import styles from './UserProfile.module.css';
import defaultProfile from '../../img/profile_default.svg';
import SearchForStop from '../SearchForStop/SearchForStop';
import UserSection from '../UserSection/UserSection';
import { checkIfValid } from '../../helpers';



class UserProfile extends Component {

  state = {
    userNameField: {
      rules:{required:true,minLength:3,maxLength:20,charNum:true},
      userid:null,
      userName:'',
      validity:{isValid:true,validMsgs:[]}
    },
    uploadFile:null, 
    remoteProfileUrl:null, 
    remotePic:defaultProfile, 
    fbCurrentUser:null, 
    fbCurrentUserDets:{
    lastSignInTime:null,
    creationTime:null, 
    userNameFail:null
    } 
    // profilePicChangeOngoing:false, userName:this.props.userDets.displayName,

}

  handleUserNameChange =(e)=>{
    e.preventDefault();
    let newState = {...this.state}
   
    //use userNameField rules in state to check validity
    newState.userNameField.userName = e.target.value;
    newState.userNameField.validity = checkIfValid(newState.userNameField.rules, e.target.value)
    this.setState({...newState})
  }
  getProfilePicUrl = ()=>{
    firebase.storage().ref().child(`/images/${this.props.userDets.userId}/${this.props.userDets.profilePicName}`).getDownloadURL()
    .then(url => {
      this.setState({remoteProfileUrl:url})
  
    }).catch(function(error) {
      console.log("error getting profileURL", error)
    });
  }

  checkValidOnSubmit = ()=>{
    if(this.state.userNameField.validity.isValid && this.state.userNameField.userName.length ){
      return true
    }else{return false;}
  }

  handleUpdateName = (e)=>{
    e.preventDefault();
    //check validity
    if(!this.props.userDets || this.props.userDets === undefined)return;
    
    if(!this.state.userNameField.userName) return;

  
    if(!this.checkValidOnSubmit()){
      console.log("ignoring form")
      this.setState({userNameFail:'Form not submitted. Please check for errors.'})
      return false;
    }
    firebase.database().ref(`/users/${this.props.userDets.userId}`).update({
      displayName: this.state.userNameField.userName
    })
    .then(r=>{
      console.log("user updated ", r);
      //update firebase user profile too???
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.state.userNameField.userName
      }).then(r=> {
        console.log("fb profile updated will tell app", r)
        this.props.handleUserNameUpdated(this.state.userNameField.userName);
          //and tell App.js (localStorage & state)
      })
    })
    .catch(e=>console.log("error with user update ", e))



  


  }

  tryThis = ()=>{
    return new Promise((resolve, reject) => {
      let count = 0;
      let w;
      what();
      function what(){
        w = firebase.auth().currentUser;
        setTimeout(()=>{   //use timeout to imporve chances
          if(w !==null ){
            resolve(w);
          }
          else if(w===null && count >10){
            reject("sorry marie")
          }
          else if(w===null){
            count+=1;
            what();
          }
        }, 150);
      }
    });
  }

  getCurrentUserByBruteForce = async()=>{
    try {
      let user = await this.tryThis();
      if (user && user.email) {
          console.log("wow", user, user.metadata.lastSignInTime, user.metadata.creationTime)
          this.setState({
            fbCurrentUser: true,
            fbCurrentUserDets:{
              lastSignInTime:user.metadata.lastSignInTime,
              creationTime:user.metadata.creationTime
            }
          });
      }
    } catch(err) {
      //console.log("no joy")
    }
  }

  componentDidUpdate(){
    if(this.state.userNameFail !==null){
      setTimeout(()=>{ 
       this.setState({userNameFail:null})
      },  5000)
    }
  }

  componentDidMount(){
    //console.log(this.props)
     //console.log(this.props.userDets.photoURL)

    //this.setState({userNameField:{userName:this.props.userDets.displayName}})
    if(this.props.userDets.photoURL ==='null'|| this.props.userDets.photoURL === null || !this.props.userDets.photoURL  ){
      return;
    }else{this.getProfilePicUrl()}

    this.getCurrentUserByBruteForce();
    
  }


  handleFileChange =(e) =>{
    e.preventDefault();
    console.log(e.target.files[0])
    this.setState({uploadFile:e.target.files[0]})
  }

  handleUploadFile =(e)=>{
    e.preventDefault();
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`images/${this.props.userDets.userId}/${this.state.uploadFile.name}`).put(this.state.uploadFile);

     //a cloud function will intercept and resize
   
     uploadTask.on('state_changed', function(snapshot){

       switch (snapshot.state) {
         case firebase.storage.TaskState.PAUSED: // or 'paused'
          // console.log('Upload is paused');
           break;
         case firebase.storage.TaskState.RUNNING: // or 'running'
           //console.log('Upload is running');
           break;
           default:console.log("def")
       }
     }, e=> {
      // console.log("error uploading profile pic",e)
     },()=> {
       uploadTask.snapshot.ref.getDownloadURL()
       .then(downloadURL=> {
          let currentUser = firebase.auth().currentUser;
          currentUser.updateProfile({
            photoURL: downloadURL
        }).catch(e=> {
          console.log("photo url error", e)
        });


        firebase.database().ref(`/users/${this.props.userDets.userId}`).set({
          displayName:this.props.userDets.displayName,
          photoURL:downloadURL,
          email:currentUser.email,
          profilePicName:this.state.uploadFile.name
        })
        .then(r=>{
          this.props.handleUpdateUserProfile( this.props.userDets.displayName,
          downloadURL,
          this.state.uploadFile.name);

          this.setState({remoteProfileUrl:downloadURL})
        })
       });
     });
  }

  handleChangeProfilePic = (e)=>{
    e.preventDefault();
    console.log("changing pic...", this.state.profilePicChangeOngoing);
    this.setState((prev,current)=>{
      return{profilePicChangeOngoing:!prev.profilePicChangeOngoing}
    })
    //hide current
    //show upload file
    //run delete and upload when we have new file
  }


  deleteProfilePic = (e)=>{
    e.preventDefault();

    const profileRef = firebase.storage().ref().child(`images/${this.props.userDets.userId}/${this.props.userDets.profilePicName}`);

    profileRef.delete()
    .then(() =>{
          firebase.database().ref(`/users/${this.props.userDets.userId}`).set({
            photoURL:null,
            profilePicName:null
          })
          .then(r=>{
            console.log("pic deleted")
            this.setState({remoteProfileUrl:null})
            this.props.handleDeleteProfilePic();
          })
    })
    .catch((error)=>{
      console.log("error deleting pic", error)
    });
  }

  render(){

    const picStyle = {
      backgroundImage:`url(${ (this.state.remoteProfileUrl)? this.state.remoteProfileUrl : defaultProfile})`,
    height: '100px',
    width: '100px',
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    backgroundSize: ' auto 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: '2px solid #dbdee3',
    }

    return(
      <div className={styles.mainProfileWrap}>
    
        <div className={styles.profilePicWrap}>
          <div style={picStyle}></div>
          <p className={styles.profileUserName}>{this.props.userDets.displayName}</p>
          {
            (this.state.fbCurrentUser) ?
            <p >
            <small> Member since:  {this.state.fbCurrentUserDets.creationTime}</small>
          </p>
          : null
          }
          
        
        </div>
        {
         
          <div className={styles.profileFormWrap}>
          <ProfileForm handleFileChange={this.handleFileChange}
          handleUploadFile={this.handleUploadFile}
          deleteProfilePic={this.deleteProfilePic}
          remoteProfileUrl={this.state.remoteProfileUrl}
          handleChangeProfilePic={this.handleChangeProfilePic}
          profilePicChangeOngoing={this.state.profilePicChangeOngoing}
          handleShowProfileForm={this.handleShowProfileForm}
          userName={this.state.userNameField.userName}
          handleUserNameChange={this.handleUserNameChange}
          handleUpdateName={this.handleUpdateName}
          userNameValidity = {this.state.userNameField.validity}
          userNameFail={this.state.userNameFail}
           />
          </div>
     
        }

        {/* <FindStop userDets={this.props.userDets}></FindStop> */}
        <div className={styles.linksAndSearch}>
          <div className={styles.SearchForStop}>
            <div className={styles.toAllign}>
              <SearchForStop currentUser={this.props.userDets} />
            </div>
          </div>

          <div className={styles.UserSection}>
            <div className={styles.toAllign}>
              <UserSection userDets={this.props.userDets} />
            </div>
          </div>
        </div>
        
        
  
  	  </div>
    )

    }
  
}

export default UserProfile;


