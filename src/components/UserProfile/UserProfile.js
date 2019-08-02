//Delete, not used

import React, { Component } from 'react';
import firebase from '../../config/fbConfig';
import ProfileForm from './ProfileForm/ProfileForm';
import styles from './UserProfile.module.css';
import defaultProfile from '../../img/profile_default.svg';
import SearchForStop from '../SearchForStop/SearchForStop';
import UserSection from '../UserSection/UserSection';
import { checkIfValid } from '../../helpers';
//import plus from '../../img/plus.svg';


class UserProfile extends Component {
  _isMounted = false;
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
    },
    userSections:{
      form:false,
      edit:false,
      add:true
    }
    

}
// componentWillMount(){
//   console.log(this.props.userDets)
//   if(!this.props.userDets.isUser){
//     console.log("would have redirected")
//   }else{
//     console.log("it s ok")
//   }
// }
componentDidMount(){
  
  //if(this.props.loading)return;
  this._isMounted = true;

  this.props.closeStopList();
  if(this.props.userDets.photoURL ==='null'|| this.props.userDets.photoURL === null || !this.props.userDets.photoURL  ){
    return;
  }else{
    
    this.getProfilePicUrl()
    
  }

  if(this._isMounted){
   this.getCurrentUserByBruteForce();
  }
 
}

componentWillUnmount(){
  this._isMounted = false;
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
      if(this._isMounted){
        this.setState({remoteProfileUrl:url})
      }

      //this.setState({remoteProfileUrl:url})
  
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
    
      //update firebase user profile too???
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.state.userNameField.userName
      }).then(r=> {
      
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
      
      const what= ()=>{
        w = firebase.auth().currentUser;
        setTimeout(()=>{   //use timeout to imporve chances
          if(w !==null  ){
            resolve(w);
          }
          else if(w===null && count >10 ){
            reject("sorry marie")
          }
          else if(w===null ){
            count+=1;
            what();
          }
        }, 150);
      }
      what();
    });
  }

  getCurrentUserByBruteForce = async()=>{
   
    try {
      let user = await this.tryThis();
      if (user && user.email) {
         // console.log("wow", user, user.metadata.lastSignInTime, user.metadata.creationTime)
         if(this._isMounted){
          this.setState({
            fbCurrentUser: true,
            fbCurrentUserDets:{
              lastSignInTime:user.metadata.lastSignInTime,
              creationTime:user.metadata.creationTime
            }
          });
         }

      }
    } catch(err) {
      //console.log("no joy")
    }
  }

  componentDidUpdate(){
   
    if(this.state.userNameFail !==null && this._isMounted){
      setTimeout(()=>{ 
        if(this._isMounted){
          this.setState({userNameFail:null})
        }
       
      },  5000)
    }
  }

  handleFileChange =(e) =>{
    e.preventDefault();
   
    this.setState({uploadFile:e.target.files[0]})
  }

  handleUploadFile =(e)=>{
   
    e.preventDefault();
    if(!this.state.uploadFile) return;
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
          this.props.handleUpdateUserProfile(
            this.props.userDets.displayName,
          downloadURL,
          this.state.uploadFile.name);

          this.setState({remoteProfileUrl:downloadURL})
        })
       });
     });
  }

  handleChangeProfilePic = (e)=>{

    e.preventDefault();
 
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
            //console.log("pic deleted")
      
            this.setState({remoteProfileUrl:null})
            this.props.handleDeleteProfilePic();
          })
    })
    .catch((error)=>{
      console.log("error deleting pic", error)
    });
  }

  showSection = (e,section)=>{
    e.preventDefault();
   
    let userSections = {
      form:false,
      edit:false,
      add:false
    }
    userSections[section] = true
 
    this.setState({userSections:userSections})
  }

  render(){
    
    //console.log("profile rendered ", this.props.userDets.isUser)
    // if(this.props.loading){
    //   console.log("loading", this.props.loading)
    //   return <p>Loading</p>
    // }
      
    
   
 
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

    // {
    //   (this.props.loading) ? <p>wait</p> : <div></div>
    // }
    
    
    return(
    <div className={styles.mainProfileWrap}>
    
        <div className={styles.profilePicWrap}>

          <div style={picStyle}></div>
          <p className={styles.profileUserName}>    {this.props.userDets.displayName}</p>
          {
            (this.state.fbCurrentUser) ?
            <p >
            <small> Member since:  {this.state.fbCurrentUserDets.creationTime}</small>
          </p>
          : null
          }
          
        
        </div>
        <div className={styles.tabWrap}>
          <ul className={styles.tabUl}>
            <li className={this.state.userSections.add ? styles.activeTab :''}>
              <button onClick={(e)=>this.showSection(e,'add')}>Add Quick Stop</button>
            </li>
            <li className={this.state.userSections.edit ? styles.activeTab :''}>
              <button onClick={(e)=>this.showSection(e,'edit')}>Edit Quick Stops</button>
            </li>
            <li className={this.state.userSections.form ? styles.activeTab :''}>
              <button onClick={(e)=>this.showSection(e,'form')}>Manage Profile Pic/name</button>
            </li>
          </ul>
        </div>
      	<div className={styles.allSectionWrap}>
          { 
            (this.state.userSections.form)
            ?
            <div className={styles.userSectionWrap}>
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
            </div>
            :
            null
        
          }  

          
          {  
            (this.state.userSections.add)
            ?
            <div className={styles.userSectionWrap}>
              <div className={styles.addWrap}>
                <h3 className={styles.sectionH3}>Add Quick Stops</h3>

                  <SearchForStop 
                  setSelectedStopId={this.props.setSelectedStopId} 
                  selectedStop={this.props.selectedStop}
                  handleChooseStop={this.props.handleChooseStop}
                  currentUser={this.props.userDets}
                  handleShowStopsList={this.props.handleShowStopsList}
                  handleSearchStop={this.props.handleSearchStop}
                  showStopList={this.props.showStopList}
                  showGoBtn={false} />
            </div>
            </div>
            :
            null
          }

          {
            (this.state.userSections.edit)
            ?
              <div className={styles.userSectionWrap}>
                <UserSection userDets={this.props.userDets} />
              </div>
            :
            null
          }  
        </div>
      
  	</div>
    )

    }
  
}

export default UserProfile;


