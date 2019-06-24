import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styles from './SearchForStop.module.css'
import SearchStopList from './SearchStopList';
import { Link } from 'react-router-dom';


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
    selectedStop:{bestopid:'',route:'',direction:''},
    showStopList:false
  
  }

  handleShowStopsList(){
    this.setState({showStopList:true})
  }
  

  handleSearchStop = (e)=>{
    console.log(e.target.value)
    this.setState({searchSelectedStop: e.target.value.substring(0,22)})
  }

  handleChooseStop = (e) =>{
    //console.log(e.target)
    this.setState({searchSelectedStop:e.target.textContent,selectedStop:{
      bestopid:e.target.dataset.bestopid,
      route:e.target.dataset.route,
      direction:e.target.dataset.direction
    }})
  
  }
 
  render(){


    return<Query query={allStopsQuery}>
            {
              ( {loading, error, data} ) =>{
                  if(loading) return <p>Loading...</p>
                  if(error) console.log(error);
                 // console.log("SFS got data ", data)
                  let filteredStops = data.allstops.filter(stop=>{
                    return stop.name.toLowerCase().indexOf(this.state.searchSelectedStop.toLowerCase()) !== -1 || stop.bestopid.indexOf(this.state.searchSelectedStop) !== -1;
                  })
                  return <div className={styles.containerDiv}>
                    <input 
                      type="text"
                      onFocus={this.handleShowStopsList.bind(this)}
                      className={styles.inputBox}
                      value={this.state.searchSelectedStop}
                      onChange={this.handleSearchStop.bind(this)} 
                    />
                    

                    <Link to={`${this.state.selectedStop.route}/${this.state.selectedStop.direction}/${this.state.selectedStop.bestopid}`}><button >Go</button></Link>

                    {
                      (this.state.showStopList) ?
                        <SearchStopList
                        handleChooseStop={this.handleChooseStop} 
                        filteredStops={filteredStops} />
                      : null
                    }
            


                
                  </div>
              }
            }
          </Query>

  }

}

export default SearchForStop;

