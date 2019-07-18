import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import styles from './UserSection.module.css';
import FaveStop from '../FaveStop/FaveStop';
import firebase from '../../config/fbConfig';
import axios from 'axios';
import { Route } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfile';

class UserSection extends Component {
  _isMounted = false;
  state = {stopName:'', faveStops:[], emailResent:false, userInfo:{}}
 


  componentDidMount(){
    this._isMounted = true;
    console.log(this.props.userDets)
    //get currently logged in users faveourite stops
    if(!this.props.userDets.userId) return
    const ref = firebase.database().ref(`favourites`);
    ref.orderByChild("userid").equalTo(`${this.props.userDets.userId}`).on("value", (snapshot) =>{
 
      let stuff = snapshot.val()
      let newFaveStops = []
      for(let i in stuff){
          stuff[i].fireBaseId = i;

          newFaveStops.push(stuff[i])  
      }
        if(this._isMounted){
          this.setState({faveStops:newFaveStops})
        }
        
      });




      const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
      const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
      let getInfoUrl = `${domain}getAccountInfo?key=${key}`; 
      axios.post(getInfoUrl,{idToken:this.props.userDets.idToken})
      .then(r=>{
     
        this.setState({userInfo:r.data.users[0]})
      })
      .catch(e=>{
        console.log(e)
        console.log({...e})
      })
     
  }//end compDidMount

  componentWillUnmount(){
    this._isMounted = false;
  }

  resendEmailVerification=()=>{
    const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
    const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
    let resendUrl=`${domain}getOobConfirmationCode?key=${key}`
    axios.post(resendUrl,{requestType:'VERIFY_EMAIL',idToken:this.props.userDets.idToken})
    .then(w=>{
      //console.log("email sent ", w)
      this.setState({emailResent:true})
    })
    .catch(e=>{
      console.log({...e})
    })
  }

  



  render(){
    return (
      <div className={styles.faveListWrap} >
        <h3>Quick Stops</h3>
        {
          (this.props.emailResent)?
          <p>Email Sent. Please logout and check your emails.</p>
          : null
        }
        {
          (!this.props.userDets.emailVerified) ?
          <div className={styles.warningDiv}>
            <p className={styles.warningText}>Email Not Verified. Please logout and check your emails to continue.</p>
             <button onClick={this.resendEmailVerification}className={styles.buttonSmall}>Resend verification Email Now</button>
          </div>
          :
          null
          // <p>(verified) </p>
        }

        <div className={styles.routewrap} >
        
          {
            (this.state.faveStops.length) 

            ?
            
            this.state.faveStops.map(stop=>{
              return  <div className={styles.routebox} key={stop.bestopid}>
                <Link 
                className={styles.plainLink} 
                to={{
                  pathname:`/${stop.route}/${stop.direction}/${stop.bestopid}`
                }}>
                <p className={styles.routeno}>{stop.userStopName}</p>
                <p className={styles.routename}>{stop.stopname}</p>
                <p className={styles.routename}>{stop.bestopid}</p>
                </Link>
                <FaveStop userStop={stop}/>
              </div>
              
              }
            )

            :
            
            <p>Put your favourite bus stops here for quick access. </p>
            
          }
        </div>

        <Route path='/user/:uid' render={(props) => <UserProfile {...props} userInfo ={this.state.userInfo} />}
         />
      </div>
    )
  }

}

export default UserSection;

