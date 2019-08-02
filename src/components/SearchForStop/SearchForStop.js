import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styles from './SearchForStop.module.css'
import SearchStopList from './SearchStopList';
import { Link } from 'react-router-dom';
import FaveStop from '../FaveStop/FaveStop';
import Spinner from '../UI/Spinner/Spinner';


const allStopsQuery = gql`
  query allStopsQuery{
    allstops{
      name
      bestopid
      stop_sequence
      route
      direction
   
    }
  }
`;

class SearchForStop extends Component {


  state = {
    searchSelectedStop: ''
  }



 //update the input box value when a stop is selected
  newHandleChooseStop = (e)=>{
    this.setState({searchSelectedStop:e.target.textContent});
    this.props.handleChooseStop(e);
  }

  handleSearchStop = (e)=>{
    this.setState({searchSelectedStop: e.target.value.substring(0,22)})
  }

  //the save button
  showSaveButtonOrNot= ()=>{
    if(this.props.currentUser.userId){
      return    <FaveStop selectedStopDets={this.props.selectedStop}
      userDets={this.props.currentUser}
       /> 
    }else{
      return null
    }
  }

  //the go button
  showGoButtonOrNot = ()  =>{
    if(this.props.showGoBtn) { 
    return <Link  
      to={(this.props.selectedStop.route)?`bus/${this.props.selectedStop.route}/${this.props.selectedStop.direction}/${this.props.selectedStop.bestopid}`:'/'}
    >
      <button  className={`${styles.buttonMain} ${styles.tooltip}`}>
        <span className={styles.tooltiptext}>
          {(this.props.selectedStop.bestopid) ?
          'View timetable' : 'Select stop first'}</span> Go
      </button>
     

     </Link>
     }else{
      return <p></p>
     } 
  }
 
  render(){
 
   
    return<Query query={allStopsQuery}>
      {
        ( {loading, error, data} ) =>{
          if(loading) return <div className={styles.searchStopWrap}>
            <Spinner />
          </div>
          if(error){
            console.log(error);
            return <p>Could not load stops.</p>
          }
          if(data.allstops){
            let filteredStops = data.allstops.filter(stop=>{
              return stop.name.toLowerCase().indexOf(this.state.searchSelectedStop.toLowerCase()) !== -1 || stop.bestopid.indexOf(this.state.searchSelectedStop) !== -1;
            })
            return (
            <div>
            
              <p className={styles.minHeightP}>
                <small>
                <strong>Selected:</strong>
                {(this.props.selectedStop.stopname) ? ` ${this.props.selectedStop.stopname}` : ' '}
                </small>
              </p>
                
  
              <div className={(this.props.currentUser.userId) ? styles.inputButtonDivUser : styles.inputButtonDiv }>
                <input 
                  type="text"
                  placeholder="Start typing bus stop name..."
                  className={styles.inputBox}
                  value={this.state.searchSelectedStop}
                  onChange={(e)=>{this.props.handleShowStopsList(e);this.handleSearchStop(e)}} 
                />
              
                { this.showGoButtonOrNot() }
                
                { this.showSaveButtonOrNot() }
                  
              
                {
                  (this.props.showStopList) ?
                    <SearchStopList
                    newHandleChooseStop={this.newHandleChooseStop}
                    handleChooseStop={this.props.handleChooseStop} 
                    filteredStops={filteredStops} />
                  : null
                }
           
              </div>
            </div>)
          }
          else{
            return <p>Data error.</p>
          }
        }
      }
    </Query>

  }

}

export default SearchForStop;

