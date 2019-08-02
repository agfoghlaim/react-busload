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
import { checkIfValid } from '../../helpers';






class FaveStop extends Component{
  _isMounted = false;
  state = {
    faveStop: {
      userid:null,
      userStopName:undefined,
      validity:{isValid:true,validMsgs:[]},
      rules:{required:true,minLength:3,maxLength:20}
    },
    showFaveForm:false,showEditForm:false, showBtnGrp:false,saveStopFail:null, saveFeedbackMsg:'',
    faveStops:null

   
  }
  componentDidMount(){

   //if dont have this.props.userStops this means component rendered by SearchForStop. Will have to get the stops here. 
   this._isMounted = true;
  
  if(this.props.faveStops && this._isMounted){
    this.setState({faveStops:this.props.faveStops})
    return;
  }else{

    //get currently logged in user's faveourite stops
 
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
  }

      //remove form submit errors if they exist
      if(this.state.saveStopFail !==null){
        setTimeout(()=>{ 
         this.setState({saveStopFail:null})
        },  5000)
      }

      //remove form submit errors if they exist
      if(this.state.saveFeedbackMsg !==''){
        setTimeout(()=>{ 
          this.setState({saveFeedbackMsg:''})
        },  5000)
      }

  }
  componentWillUnmount(){
    this._isMounted = false;
  }
 
  saveFaveStop = ()=>{
    const { route, direction, bestopid, stopname } = this.props.selectedStopDets; 
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
    e.preventDefault();
    let newState = {...this.state}

    //use rules in state to check validity
    newState.faveStop.userStopName = e.target.value
    newState.faveStop.validity = checkIfValid(newState.faveStop.rules, e.target.value)
    this.setState({...newState})
  }

  checkValidOnSubmit = ()=>{
    if(this.state.faveStop.validity.isValid && this.state.faveStop.userStopName.length ){
      return true
    }else{return false;}
  }

  handleSubmitFave = (e)=>{
    e.preventDefault(e)
    console.log("fave submitted", this.state)
    //if no user
    if(!this.props.userDets || this.props.userDets === undefined){
      return;
    }

    //if no user stop name
    if(!this.state.faveStop.userStopName){
      this.setState({saveStopFail:'Please enter a name for this stop.'});
      return false;
    }

  
    //validate
    if(!this.checkValidOnSubmit()){
     // console.log("ignoring form")
      this.setState({saveStopFail:'Form not submitted.'})
      return false;
    }
    
    //should also check that user hasn't already saved this stop 
    
    //check stop isn't already saved

    let chosenStopId;
    if(this.state.faveStops){
      if(this.props.selectedStopDets){
        //was rendered by SearchForStop
        chosenStopId = this.props.selectedStopDets.bestopid;
      }else if(this.props.userStop){
        //was rendered by UserSection
        chosenStopId = this.props.userStop.bestopid;
      }
    
      
      let checkNotSaved = this.state.faveStops.filter(stop=>{

        return parseInt(stop.bestopid) === parseInt(chosenStopId)
      })
      if(checkNotSaved.length){
        console.log("stop already saved", checkNotSaved);
        this.setState({saveStopFail:'Bus stop is already saved.'})
    
        return;
      }
    }


    const { route, direction, bestopid, stopname } = this.props.selectedStopDets; 
    const stopToSave ={
      userStopName:this.state.faveStop.userStopName,
      route:route,
      direction,
      bestopid,
      stopname,
      userid:this.props.userDets.userId
    }
    
    axios.post(`https://busload-8ae3c.firebaseio.com/favourites.json`,stopToSave)
    .then(r=>{
    
      //need to delay closing modal so there's time to show a confirmation message...
      this.setState({saveFeedbackMsg:'Saved to Quickstops'})
      setTimeout(()=>{ 
        //RESET STATE
        this.setState({faveStop: {
          userid:null,
          userStopName:undefined,
          validity:{isValid:true,validMsgs:[]},
          rules:{required:true,minLength:3,maxLength:20}
        }})
        this.closeModal();
      },1000)
    
    })
    .catch(e=>{
      console.log("error saving to fb ", {...e})
      this.setState({saveStopFail:'Oh no your stop was not saved.'})
      setTimeout(()=>{  this.closeModal();},1000)
    })
  
  }

  // handleEditFaveInputChange=(e)=>{
  //   //this.setState({faveStop:{userStopName:e.target.value}})
  // }

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
 
    axios.put(url,pretend)
    .then(r=>this.closeModal())
    .catch(e=>console.log({...e}))
  }

  deleteFaveStop = (e)=>{
    e.preventDefault();
    firebase.database().ref(`favourites/${this.props.userStop.fireBaseId}`).remove()
  
    .catch(e=>console.log("error removing ", e))
  }

  showEditForm=(e)=>{
    e.preventDefault();
    this.setState({showEditForm:true})
  }


  render(){
 
    return(
      <React.Fragment>
        { //ie if bring rendered by UserSection
          ( this.props.userStop )
          
          ?

          <div className={styles.buttonGrp}>
            {
              (!this.state.showBtnGrp) 
              
              ? 
              
              <button 
              className={styles.expandCollapseBtn}
              onClick={this.setShowBtnGrp}>
                <img src={plus} alt={ "plus"} />
              </button>

              : 

              <React.Fragment>
                  <button className={`${styles.expandCollapseBtn} ${styles.clearBtn}`} onClick={this.setShowBtnGrp}>
                    <img src={minus} alt={ "minus"} />
                  </button>
              
                  <button className={`${styles.buttonSmall} ${styles.blueBtn}`} onClick={(e)=>this.showEditForm(e)}>Rename</button>

                  <button className={`${styles.buttonSmall} ${styles.redBtn}`} onClick={(e)=>this.deleteFaveStop(e)}>Delete</button>
              
            
              </React.Fragment>

              
            }
       

          </div>
          
          : 
      
         (this.props.selectedStopDets)

         ?
          //ie if being rendered by SearchForStop 
            <button className={`${styles.buttonMainFave} ${styles.tooltip}`} onClick={this.saveFaveStop}>Save <span className={styles.tooltiptext}>
            {(this.props.selectedStopDets.bestopid) ?
                      'Save to Quick Stops' : 'Select stop first'}
              </span></button>
          :'no idea'

        }
    
  
  
        {(this.state.showFaveForm) ? 
          <Modal 
            clickBg={this.closeModal} 
            show={this.state.showFaveForm}>
            <SaveFaveStopForm 
            handleFaveInputChange={this.handleFaveInputChange}
            handleSubmitFave={this.handleSubmitFave}
            faveStopValidity={this.state.faveStop.validity}
            faveStop={this.state.faveStop.userStopName}
            saveStopFail={this.state.saveStopFail}
            saveFeedbackMsg={this.state.saveFeedbackMsg}
            />
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