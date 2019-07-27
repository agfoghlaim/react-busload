import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import styles from './UserSection.module.css';
import FaveStop from '../FaveStop/FaveStop';
import firebase from '../../config/fbConfig';
import axios from 'axios';
// import { Route } from 'react-router-dom';
// import UserProfile from '../UserProfile/UserProfile';
import plus from '../../img/plus.svg';
import minus from '../../img/minus.svg';
//import rightArrow from '../../img/right_arrow.svg';




class UserSection extends Component {
  _isMounted = false;
  state = {stopName:'', faveStops:[], emailResent:false, userInfo:{}, expandFaves:false}
 


  componentDidMount(){
   // console.log(this.props)
    this._isMounted = true;
   // console.log(this.props, this.state)
  
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


// addMoreLink =()=> <div className={styles.routeboxCollapsedInvert}>
//   <Link 
//   className={styles.plainLinkCollapsedInvert}
//   to={{pathname:`/`,hash:'#stops'}}>
//   <p className={styles.routenoCollapsedInvert}>
//     + Add Stops
//   </p>
//   </Link></div>

handleSetExpandFaves = ()=>{
  this.setState((prev,curr)=>{
    return {expandFaves:!prev.expandFaves}
  })
}
showCollapsedFaves = ()=>{
  return <React.Fragment>{

    

    this.state.faveStops.map(stop=>{
      return <div className={styles.routeboxCollapsedInvert} key={stop.bestopid}>
        <Link 
        className={styles.plainLinkCollapsedInvert} 
        to={{
          pathname:`/bus/${stop.route}/${stop.direction}/${stop.bestopid}`
        }}>
        <p className={styles.routenoCollapsedInvert}>{stop.userStopName} >
        {/* <span classname={styles.goArrow}>
          <img src={rightArrow} alt="right arrow" />
          </span> */}
          </p>
        </Link>
      </div>
    })
  }
   {/* {this.addMoreLink()} */}
  </React.Fragment>
}

showExpandedFaves = ()=>{
  return             this.state.faveStops.map(stop=>{
    return  <div className={styles.routebox} key={stop.bestopid}>
      <Link 
      className={styles.plainLink} 
      to={{
        pathname:`/bus/${stop.route}/${stop.direction}/${stop.bestopid}`
      }}>
      <p className={styles.routeno}>{stop.userStopName}</p>
      <p className={styles.routename}>{stop.stopname}</p>
      <p className={styles.routename}>{stop.bestopid}</p>
      </Link>
      
      <FaveStop userStop={stop}/>
    </div>
    
    })
}
  // resendEmailVerification=()=>{
  //   const domain = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/`;
  //   const key = `AIzaSyAoXxf2QSQwHDJOenPiziOTGzxijrZynLs`;
  //   let resendUrl=`${domain}getOobConfirmationCode?key=${key}`
  //   axios.post(resendUrl,{requestType:'VERIFY_EMAIL',idToken:this.props.userDets.idToken})
  //   .then(w=>{
  //     //console.log("email sent ", w)
  //     this.setState({emailResent:true})
  //   })
  //   .catch(e=>{
  //     console.log({...e})
  //   })
  // }

  



  render(){
    return (
      <div className={styles.faveListWrap} >
        <div className={styles.h3AndExpandCollapse}>
          
          <button 
          className={styles.expandCollapseBtn}
          onClick={this.handleSetExpandFaves}>
            <img src={this.state.expandFaves ? minus : plus} alt={this.state.expandFaves ? "minus" : "plus"} />
            
          </button>
          {/* <Link className={styles.breadLink}
    // to={{pathname:`/`,hash:'#stops'}}
    >add </Link>   */}
          <h3 className={styles.sectionH3}>Quick Stops</h3>
        </div>

        <div className={styles.routewrap} >
        
          {
            (this.state.faveStops.length && !this.state.expandFaves) 

            ?
            this.showCollapsedFaves()
     
            :

            (this.state.faveStops.length && this.state.expandFaves) 
            ?
            this.showExpandedFaves()
            :
            <p>Put your favourite bus stops here for quick access. </p>
            
          }
        </div>

          {/* <Link to={`user/${this.props.userDets.userId}`}>go</Link>
        <Route path='user/:uid' render={(props) => <UserProfile {...props} userInfo ={this.state.userInfo} />}
         /> */}
      </div>
    )
  }

}

export default UserSection;

