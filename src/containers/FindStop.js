import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';


import SearchForStop from '../components/SearchForStop/SearchForStop';
import RefineForStop from '../components/RefineForStop/RefineForStop';

const FIND_STOP_QUERY = gql`
  query busRoutesQuery{
    busRoutes {
      route
      routename
      direction
      stops{
        name
        bestopid
      }
    }
  }
`;


class FindStop extends Component{


  getDataForRefine = ()=>{
    let theData = this.props.data
    if(theData.loading)return <p>loading</p>
    return <React.Fragment>
      <RefineForStop busRoutes={theData.busRoutes} />
    </React.Fragment>
   
  }

  // getDataForSearch = ()=>{
  //   let theData = this.props.data
  //   if(theData.loading)return <p>loading</p>
  //   return <React.Fragment>
  //     <SearchForStop busRoutes={theData.busRoutes} searchStop={this.handleSearchStop} />
  //   </React.Fragment>
   
  // }


  render(){
 console.log(this.props.data)
    return(
      <div style={{background:'lightgreen'}}>
        <h4>FindStop Component</h4>
        {this.getDataForRefine()}
        <SearchForStop />
         
    
      </div>

    )
  }
}

export default graphql(FIND_STOP_QUERY)(FindStop);