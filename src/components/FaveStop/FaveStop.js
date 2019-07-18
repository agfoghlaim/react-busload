import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import SaveFaveStopForm from './SaveFaveStopForm/SaveFaveStopForm';
import axios from 'axios';
import EditFaveStopForm from './EditFaveStopForm/EditFaveStopForm';
import firebase from '../../config/fbConfig';
import styles from './FaveStop.module.css';



class FaveStop extends Component{

  state = {
    faveStop: {userid:null,userStopName:undefined},
    showFaveForm:false,showEditForm:false
  }
 
  saveFaveStop = ()=>{
    //console.log(this.props)
    const { route, direction, bestopid, stopname } = this.props.selectedStopDets.selectedStop; 
    if(!route || !direction || !bestopid || !stopname) return;
    this.setState({showFaveForm:true})
    console.log("will save stop", stopname)
  }


  closeModal = ()=>{
    this.setState({showFaveForm:false,showEditForm:false})
  }

  handleFaveInputChange = (e)=>{
    //console.log(e.target.value)
    this.setState({faveStop:{userStopName:e.target.value}})
    //console.log("state?", this.state.faveStop)
  }

  handleSubmitFave =(e)=>{
    e.preventDefault(e)
    if(!this.props.userDets || this.props.userDets === undefined){
      return;
    }
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
    //console.log(this.props)
    const {bestopid,direction,route,fireBaseId,stopname,userid} = this.props.userStop;
    console.log(this.props.userStop)
    //console.log("will test", this.state)
    let pretend = {
      bestopid,
      direction,
      route,
      stopname,
      userStopName:this.state.faveStop.userStopName,
      userid
    }
 
    console.log("will save ", pretend)
    // let url = `https://busload-8ae3c.firebaseio.com/favourites/-LjI1-_SJJFpVmfkdwKy.json`



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


  showEditBtn=()=>{
    //need to know if selected stop is in user faves
    const { route, direction, bestopid, stopname } = this.props.selectedStopDets.selectedStop; 
    if(route&&direction&&bestopid&&stopname){
      return <button>the conditional button</button>
    }else{
      return null
    }
  }

  render(){
    return(
      <div>
        { //ie if bring rendered by UserSection
          ( this.props.userStop )?
          <div className={styles.buttonGrp}>
          <button className={styles.buttonSmall} onClick={(e)=>this.showEditForm(e)}>Rename</button>
          <button className={`${styles.buttonSmall} ${styles.redBtn}`} onClick={(e)=>this.deleteFaveStop(e)}>Delete</button>
          </div>
          :
          //ie if being rendered by SearchForStop
          <button onClick={this.saveFaveStop}>Favourite</button>
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
          <Modal 
            clickBg={this.closeModal} 
            show={this.state.showEditForm}>
            <EditFaveStopForm handleFaveInputChange={this.handleFaveInputChange} editFaveStop={this.editFaveStop} />
          </Modal> 
        : null
        }
      </div>
    )
 
  
  }   
  
}

export default FaveStop;