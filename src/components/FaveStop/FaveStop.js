import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import SaveFaveStopForm from './SaveFaveStopForm/SaveFaveStopForm';
import axios from 'axios';
import EditFaveStopForm from './EditFaveStopForm/EditFaveStopForm';
import firebase from '../../config/fbConfig';
import styles from './FaveStop.module.css';
import Transition from 'react-transition-group/Transition';
import plus from '../../img/plus.svg';
import minus from '../../img/minus.svg';





class FaveStop extends Component{

  state = {
    faveStop: {userid:null,userStopName:undefined},
    showFaveForm:false,showEditForm:false, showBtnGrp:false
  }
 
  saveFaveStop = ()=>{
    //console.log(this.props)
    const { route, direction, bestopid, stopname } = this.props.selectedStopDets.selectedStop; 
    if(!route || !direction || !bestopid || !stopname) return;
    this.setState({showFaveForm:true})
  }

  closeModal = ()=>{
    this.setState({showFaveForm:false,showEditForm:false})
  }

  setShowBtnGrp = () =>{
    this.setState((prev,current)=>{
      return {showBtnGrp: !prev.showBtnGrp}
    })
  }
  handleFaveInputChange = (e)=>{
    this.setState({faveStop:{userStopName:e.target.value}})
  }

  handleSubmitFave =(e)=>{
    e.preventDefault(e)
    if(!this.props.userDets || this.props.userDets === undefined){
      return;
    }
    if(!this.state.faveStop.userStopName) return;
    

    //should also check that user hasn't already saved this stop 


    const { route, direction, bestopid, stopname } = this.props.selectedStopDets.selectedStop; 
    const stopToSave ={
      userStopName:this.state.faveStop.userStopName,
      route:route,
      direction,
      bestopid,
      stopname,
      userid:this.props.userDets.userId
    }
    console.log("form submitted saving ", stopToSave)
    axios.post(`https://busload-8ae3c.firebaseio.com/favourites.json`,stopToSave)
    .then(r=>{console.log("stopSaved resp", r)
      this.closeModal();
    })
    .catch(e=>console.log("error saving to fb ", {...e}))
  
  }

  handleEditFaveInputChange=(e)=>{
    //this.setState({faveStop:{userStopName:e.target.value}})
  }

  editFaveStop = (e)=>{
    e.preventDefault();
    if(!this.state.faveStop.userStopName) return;

    const {bestopid,direction,route,fireBaseId,stopname,userid} = this.props.userStop;
  
    let pretend = {
      bestopid,
      direction,
      route,
      stopname,
      userStopName:this.state.faveStop.userStopName,
      userid
    }


    let url = `https://busload-8ae3c.firebaseio.com/favourites/${fireBaseId}.json`
    console.log(url)
    axios.put(url,pretend)
    .then(r=>{
      console.log("r ", r);this.closeModal();
    })
    .catch(e=>console.log({...e}))



//https://busload-8ae3c.firebaseio.com/favourites/-LjI1-_SJJFpVmfkdwKy
  }

  deleteFaveStop = (e)=>{
    e.preventDefault();
    firebase.database().ref(`favourites/${this.props.userStop.fireBaseId}`).remove()
    .then(()=>console.log("removed"))
    .catch(e=>console.log("error removing ", e))

  }

  showEditForm=(e)=>{
    e.preventDefault();
    this.setState({showEditForm:true})
  }


  // showEditBtn=()=>{
  //   //need to know if selected stop is in user faves
  //   const { route, direction, bestopid, stopname } = this.props.selectedStopDets.selectedStop; 
  //   if(route&&direction&&bestopid&&stopname){
  //     return <button>the conditional button</button>
  //   }else{
  //     return null
  //   }
  // }

  render(){
    return(
      <React.Fragment>
        { //ie if bring rendered by UserSection
          ( this.props.userStop )?
          
         
          <div className={styles.buttonGrp}>
            {(!this.state.showBtnGrp) ? 
              // <button className={styles.showMore} onClick={this.setShowBtnGrp}>Edit</button> 
              <button 
          className={styles.expandCollapseBtn}
          onClick={this.setShowBtnGrp}>
            <img src={plus} alt={ "plus"} />
            
          </button>
              : 
              <React.Fragment>
              <button className={`${styles.buttonSmall} ${styles.blueBtn}`} onClick={(e)=>this.showEditForm(e)}>Rename</button>

              <button className={`${styles.buttonSmall} ${styles.redBtn}`} onClick={(e)=>this.deleteFaveStop(e)}>Delete</button>
              
              <button className={`${styles.expandCollapseBtn} ${styles.clearBtn}`} onClick={this.setShowBtnGrp}>
              <img src={minus} alt={ "minus"} />
              </button>
              </React.Fragment>

              
            }
       

          </div>
          :
          //ie if being rendered by SearchForStop
          <button className={styles.buttonMainFave} onClick={this.saveFaveStop}>Save </button>
      
        }
    
  
  
        {(this.state.showFaveForm) ? 
          <Modal 
            clickBg={this.closeModal} 
            show={this.state.showFaveForm}>
            <SaveFaveStopForm 
            handleFaveInputChange={this.handleFaveInputChange}
            handleSubmitFave={this.handleSubmitFave}/>
          </Modal> 
        : null
        }

        {(this.state.showEditForm) ? 
        <Transition
        in={this.state.showEditForm}
        timeout={1000}
        mountOnEnter
        unmountOnExit>
          {
            state=> (
              <Modal 
                clickBg={this.closeModal} 
                show={state}>
                <EditFaveStopForm handleFaveInputChange={this.handleFaveInputChange} editFaveStop={this.editFaveStop} stopName={this.props.userStop.stopname} />
              </Modal>
            )
          }
         
          </Transition> 
        : null
        }
      </React.Fragment>
    )
 
  
  }   
  
}

export default FaveStop;