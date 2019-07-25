//Delete, not used

import React, { Component } from 'react';
import firebase from '../../config/fbConfig';


class UserProfile extends Component {
       
  state = {uploadFile:null}

  handleFileChange =(e) =>{
    console.log(e.target.files[0])
    this.setState({uploadFile:e.target.files[0]})
  }

  handleUploadFile =()=>{
   // console.log(this.props)


    // Create a root reference
    var storageRef = firebase.storage().ref();

    // Create a reference to 'mountains.jpg'
    //var theFileRef = storageRef.child(`${this.state.uploadFile.name}`);

    // Create a reference to 'images/mountains.jpg'
    //var thePathRef = storageRef.child(`images/${this.props.userDets.displayName}/${this.state.uploadFile.name}`);
     const uploadTask = storageRef.child(`images/${this.props.userDets.userId}/${this.state.uploadFile.name}`).put(this.state.uploadFile);

   

     // Register three observers:
     // 1. 'state_changed' observer, called any time the state changes
     // 2. Error observer, called on failure
     // 3. Completion observer, called on successful completion
     uploadTask.on('state_changed', function(snapshot){
       // Observe state change events such as progress, pause, and resume
       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       console.log('Upload is ' + progress + '% done');
       switch (snapshot.state) {
         case firebase.storage.TaskState.PAUSED: // or 'paused'
           console.log('Upload is paused');
           break;
         case firebase.storage.TaskState.RUNNING: // or 'running'
           console.log('Upload is running');
           break;
       }
     }, function(error) {
       // Handle unsuccessful uploads
     }, function() {
       // Handle successful uploads on complete
       // For instance, get the download URL: https://firebasestorage.googleapis.com/...
       uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
         console.log('File available at', downloadURL);
       });
     });
     


  }

  render(){
    return(
      <div>
       
        <input 
          type="file"
          onChange={(e)=>this.handleFileChange(e)}
          />
        <button onClick={this.handleUploadFile}>Upload</button>
  	  </div>
    )

    }
  
}

export default UserProfile;

