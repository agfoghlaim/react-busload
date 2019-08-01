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
//use this.props.setSelectedStopId on a go button

  state = {
    searchSelectedStop: '',
    selectedStop:{bestopid:'',route:'',direction:'', name:''},
    showStopList:false
  
  }

  handleShowStopsList(e){
    //console.log("showing",e.target.value.length)
    if(e.target.value.length){
      this.setState({showStopList:true})
    }else{
      this.setState({showStopList:false})
    }

  }
  

  handleSearchStop = (e)=>{
    //console.log(e.target.value)
    this.setState({searchSelectedStop: e.target.value.substring(0,22)})
  }

  handleChooseStop = (e) =>{
    //console.log(e.target)
    this.setState({searchSelectedStop:e.target.textContent,selectedStop:{
      bestopid:e.target.dataset.bestopid,
      route:e.target.dataset.route,
      direction:e.target.dataset.direction,
      stopname:e.target.dataset.stopname
    }})
  
  }

  showUserFeature = ()=>{
    if(this.props.currentUser.userId){
      return    <FaveStop selectedStopDets={this.state}
      userDets={this.props.currentUser}
       /> 
    }else{
      return null
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
            return <div className={styles.searchStopWrap}>
              <h3 className={styles.sectionH3}>Find your stop</h3>
              {
                (this.props.currentUser.userId) ?
                <p className={styles.infoP}><small>Select your stop. Then click 'Save' to add to Quick Stops or 'Go' to view timetables.</small></p>
                : 
                <p className={styles.infoP}><small>Select your stop and click 'Go' to view timetables.</small></p>
              }
              <p className={styles.minHeightP}>
                <small>
                <strong>Selected:</strong>
                {(this.state.selectedStop.stopname) ? ` ${this.state.selectedStop.stopname}` : ' '}
                </small>
                </p>
              <div className={(this.props.currentUser.userId) ? styles.inputButtonDivUser : styles.inputButtonDiv }>
              <input 
                type="text"
                placeholder="Start typing bus stop name..."
                // onFocus={this.handleShowStopsList.bind(this)}
                className={styles.inputBox}
                value={this.state.searchSelectedStop}
                onChange={(e)=>{this.handleShowStopsList(e);this.handleSearchStop(e)}} 
              />
              
              {
                //if this.props.selectedStopId exists it means SearchForStop was rendered by FindStop Component, so show Go button. If !this.props.selectedStopId, was rendered by UserProfile(?) so only show save button
                (this.props.setSelectedStopId) ?
                <Link  
                  to={(this.state.selectedStop.route)?`bus/${this.state.selectedStop.route}/${this.state.selectedStop.direction}/${this.state.selectedStop.bestopid}`:'/'}
                >
                  <button  className={`${styles.buttonMain} ${styles.tooltip}`}>
                    <span className={styles.tooltiptext}>
                      {(this.state.selectedStop.bestopid) ?
                      'View timetable' : 'Select stop first'}</span> Go
                  </button>
                 

                </Link>
                : <p></p>
              }
           
             

                {this.showUserFeature()}
          
              {
                (this.state.showStopList) ?
                  <SearchStopList
                  handleChooseStop={this.handleChooseStop} 
                  filteredStops={filteredStops} />
                : null
              }
            </div>
            </div>
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

