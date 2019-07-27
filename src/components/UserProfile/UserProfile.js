//Delete, not used

import React, { Component } from 'react';
import firebase from '../../config/fbConfig';
import ProfileForm from './ProfileForm/ProfileForm';
import styles from './UserProfile.module.css';
import defaultProfile from '../../img/profile_default.svg';


class UserProfile extends Component {
       
  state = {uploadFile:null, remoteProfileUrl:null, remotePic:defaultProfile}


  getProfilePicUrl = ()=>{
    firebase.storage().ref().child(`/images/${this.props.userDets.userId}/${this.props.userDets.profilePicName}`).getDownloadURL()
    .then(url => {
      this.setState({remoteProfileUrl:url})
  
    }).catch(function(error) {
      console.log("error getting profileURL", error)
    });
  }

  componentDidMount(){
     //console.log(this.props.userDets.photoURL)
    if(this.props.userDets.photoURL ==='null'|| this.props.userDets.photoURL === null || !this.props.userDets.photoURL  ){
      return;
    }else{this.getProfilePicUrl()}
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
    border: '4px solid #f0f0f0',
    }

    return(
      <div>
        <div className={styles.profilePicWrap}>
        {/* <div className={styles.profilePicDiv}> */}
        <div style={picStyle}>
          {/* {
            (this.state.remoteProfileUrl)?
            <img src={this.state.remoteProfileUrl} alt="profile pic" /> :
            <img src={defaultProfile} alt="default profile" />
          } */}
        </div>
        <p>{this.props.userDets.displayName}</p>
        </div>
        
        <ProfileForm handleFileChange={this.handleFileChange}
          handleUploadFile={this.handleUploadFile}
          deleteProfilePic={this.deleteProfilePic}/>
  
  	  </div>
    )

    }
  
}

export default UserProfile;

