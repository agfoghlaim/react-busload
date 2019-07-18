import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styles from './SearchForStop.module.css'
import SearchStopList from './SearchStopList';
import { Link } from 'react-router-dom';
import FaveStop from '../FaveStop/FaveStop';


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
          if(loading) return <p>Loading...</p>
          if(error){
            console.log(error);
            return <p>Could not load stops.</p>
          }
          if(data.allstops){
            let filteredStops = data.allstops.filter(stop=>{
              return stop.name.toLowerCase().indexOf(this.state.searchSelectedStop.toLowerCase()) !== -1 || stop.bestopid.indexOf(this.state.searchSelectedStop) !== -1;
            })
            return <div className={styles.searchStopWrap}>
              <h3>Find your stop</h3>
              <p><small>{this.state.selectedStop.stopname}</small></p>
              <div className={(this.props.currentUser.userId) ? styles.inputButtonDivUser : styles.inputButtonDiv }>
              <input 
                type="text"
                placeholder="Start typing bus stop name..."
                // onFocus={this.handleShowStopsList.bind(this)}
                className={styles.inputBox}
                value={this.state.searchSelectedStop}
                onChange={(e)=>{this.handleShowStopsList(e);this.handleSearchStop(e)}} 
              />
              

              <Link to={`${this.state.selectedStop.route}/${this.state.selectedStop.direction}/${this.state.selectedStop.bestopid}`}
              ><button  onClick={(e)=>this.props.setSelectedStopId(e,this.state.selectedStop)}className={styles.buttonMain}  >Go</button></Link>

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

