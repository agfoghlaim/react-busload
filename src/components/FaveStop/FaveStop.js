import React, { Component } from 'react';
import Modal from '../Modal/Modal';
import FaveStopForm from './FaveStopForm/FaveStopForm';
import axios from 'axios';


class FaveStop extends Component{

  state = {
    faveStop: {userid:null,userStopName:undefined},
    showFaveForm:false
  }
 
  saveFaveStop = ()=>{
    console.log(this.props)
    const { route, direction, bestopid, stopname } = this.props.selectedStopDets.selectedStop; 
    if(!route || !direction || !bestopid || !stopname) return;
    this.setState({showFaveForm:true})
    console.log("will save stop", stopname)
  }

  closeModal = ()=>{
    this.setState({showFaveForm:false})
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

  render(){
    return(
      <div>
    <button onClick={this.saveFaveStop}>Favourite</button>
      {(this.state.showFaveForm) ? 
        <Modal 
          clickBg={this.closeModal} 
          show={this.state.showFaveForm}>
            
          <FaveStopForm 
          handleFaveInputChange={this.handleFaveInputChange}
          handleSubmitFave={this.handleSubmitFave}/>
        </Modal> 
      
      : null
    
      }
      </div>
    )
 
  
  }   
  
}

export default FaveStop;