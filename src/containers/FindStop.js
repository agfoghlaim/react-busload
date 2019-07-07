import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import SearchForStop from '../components/SearchForStop/SearchForStop';
import BusRoutesList from '../components/BusRoutesList/BusRoutesList';


const BUS_ROUTES_QUERY = gql`
  query busRoutesQuery{
    busRoutesOverview {
      route
      routename
      direction
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
    if(theData.error)return <p>Could not load routes.</p>
    return <React.Fragment>
      <BusRoutesList busRoutes={theData.busRoutesOverview} />
    </React.Fragment>
   
  }

  render(){
 //console.log(">>>>>>>>>>>>>>>>>>>>>>>",this.props.userDets)
    return(
      <div>
       
        <SearchForStop setSelectedStopId={this.setSelectedStopId} selectedStop={this.selectedStop} />

      
        {this.getDataForRefine()}
 
    
      </div>

    )
  }
}

export default graphql(BUS_ROUTES_QUERY)(FindStop);