import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';


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
    searchSelectedStop: '',
  }

  handleSearchStop = (e)=>{
    console.log(e.target.value)
    this.setState({searchSelectedStop: e.target.value.substring(0,22)})
  }
 
  render(){
    return<Query query={allStopsQuery}>
            {
              ( {loading, error, data} ) =>{
                  if(loading) return <p>Loading...</p>
                  if(error) console.log(error);
                  console.log("SFS got data ", data)
                  let filteredStops = data.allstops.filter(stop=>{
                    return stop.name.toLowerCase().indexOf(this.state.searchSelectedStop.toLowerCase()) !== -1 || stop.bestopid.indexOf(this.state.searchSelectedStop) !== -1;
                  })
                  return <div>
                    <input 
                      type="text"
                      value={this.state.searchSelectedStop}
                      onChange={this.handleSearchStop.bind(this)} 
                    />
   
                    <ul>
                      {
                        filteredStops.map(stop=><li key={`${stop.bestopid}-${stop.route}-${stop.direction}`}>{stop.name} - {stop.bestopid} -{stop.route} </li>)
                      }

                      
                      
                    {/* {
                      data.allstops.map(stop=><li key={`${stop.bestopid}-${stop.route}-${stop.direction}`}>{stop.name} - {stop.bestopid} -{stop.route} </li>)
                      } */}
                  </ul>
                
                  </div>
              }
            }
          </Query>

  }

}

export default SearchForStop;

