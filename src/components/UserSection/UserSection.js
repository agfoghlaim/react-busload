import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import styles from './UserSection.module.css';
import FaveStop from '../FaveStop/FaveStop';

class UserSection extends Component {

  state = {stopName:'', faveStops:[]}
 
  componentDidMount(){
    //get currently logged in users faveourite stops
    if(!this.props.userDets.userId) return

    const queryParams = `?auth=${this.props.userDets.idToken}&orderBy="userid"&equalTo="${this.props.userDets.userId}"`
   
    axios.get(`https://busload-8ae3c.firebaseio.com/favourites.json${queryParams}`)
    .then(r=>{
      //console.log(r)
    let faveStops = []
    for(let i in r.data){
      r.data[i].fireBaseId = i;
      faveStops.push(r.data[i])

    }
    console.log(faveStops)
      this.setState({faveStops:faveStops})
      this.closeModal();
    })
    //TODO
     .catch(e=>console.log(e))

   

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

