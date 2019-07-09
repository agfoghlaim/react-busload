import React, { Component } from 'react';
import axios from 'axios';
import https from 'https';
import { Link } from 'react-router-dom'
import styles from './UserSection.module.css';
import FaveStop from '../FaveStop/FaveStop';
import firebase from '../../config/fbConfig';

class UserSection extends Component {

  state = {stopName:'', faveStops:[]}
 
  componentDidMount(){
    //get currently logged in users faveourite stops
    if(!this.props.userDets.userId) return
   


    const ref = firebase.database().ref(`favourites`);
    ref.orderByChild("userid").equalTo(`${this.props.userDets.userId}`).on("value", (snapshot) =>{
    // console.log(snapshot.val());
      //let stuff = Array.from(snapshot.val().key)
      let stuff = snapshot.val()
      let newFaveStops = []
      for(let i in stuff){
          stuff[i].fireBaseId = i;

          newFaveStops.push(stuff[i])  
      }

        this.setState({faveStops:newFaveStops})
      });
     
  }//end compDidMount

  



  render(){
    return (
      <div className={styles.faveListWrap} >
        <h3>{this.props.userDets.displayName}'s Quick Stops</h3>
        <div className={styles.routewrap} >
        
          {
            (this.state.faveStops.length) 

            ?
            
            this.state.faveStops.map(stop=>{
              return  <div className={styles.routebox} key={stop.bestopid}>
                <Link to={`${stop.route}/${stop.direction}/${stop.bestopid}`}>
                <p className={styles.routeno}>{stop.userStopName}</p>
                <p className={styles.routename}>{stop.stopname}</p>
                </Link>
                <FaveStop userStop={stop}/>
              </div>
              
              }
            )

            :

            null
          }
        </div>
      </div>
    )
  }

}

export default UserSection;

