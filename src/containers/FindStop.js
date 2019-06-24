import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import SearchForStop from '../components/SearchForStop/SearchForStop';
import RefineForStop from '../components/RefineForStop/RefineForStop';
import SingleStop from '../components/SingleStop/SingleStop';

const BUS_ROUTES_QUERY = gql`
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

state = {selectedStop:{bestopid:'',route:'',direction:''}}

setSelectedStopId = (selectedStop) =>{

  let {bestopid,route,direction} = selectedStop;
  if(!bestopid || !route || !direction) return

  this.setState({
    selectedStop:{bestopid,route,direction}
  }, ()=>console.log("state now ", this.state.selectedStop))
}

  getDataForRefine = () =>{
    let theData = this.props.data
    if(theData.loading)return <p>loading</p>
    return <React.Fragment>
      <RefineForStop busRoutes={theData.busRoutes} />
    </React.Fragment>
   
  }

  render(){
 //console.log(this.props.data)
    return(
      <div>
        <h4>FindStop Component</h4>
        {this.getDataForRefine()}
        <SearchForStop setSelectedStopId={this.setSelectedStopId} selectedStop={this.selectedStop} />
        <SingleStop selectedStop={this.state.selectedStop} />
         
    
      </div>

    )
  }
}

export default graphql(BUS_ROUTES_QUERY)(FindStop);