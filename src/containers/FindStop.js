import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import { Route } from 'react-router-dom';
import SearchForStop from '../components/SearchForStop/SearchForStop';
import BusRoutesList from '../components/BusRoutesList/BusRoutesList';
import BusRouteStopsList from '../components/BusRouteStopsList/BusRouteStopsList';


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

state = {
  selectedStop:{bestopid:'',route:'',direction:''},
  selectedRoute:{route:'',direction:''}
}

setSelectedStopId = (e, selectedStop) =>{
e.preventDefault();
  let {bestopid,route,direction} = selectedStop;
  if(!bestopid || !route || !direction) return

  this.setState({
    selectedStop:{bestopid,route,direction}
  }, ()=>console.log("state now ", this.state.selectedStop))
}

setSelectedRoute = (e,route,direction)=>{
  this.setState({selectedRoute:{route,direction}})
}

  getDataForRefine = () =>{
    let theData = this.props.data
    if(theData.loading)return <p>loading</p>
    if(theData.error)return <p>Could not load routes.</p>
    return <React.Fragment>
      <BusRoutesList setSelectedRoute={this.setSelectedRoute}   busRoutes={theData.busRoutesOverview} />
    </React.Fragment>
   
  }

  render(){
 //console.log(">>>>>>>>>>>>>>>>>>>>>>>",this.props.userDets)
    return(
      <div>
       {/* <Route path='/:route/:direction/'  component={BusRouteStopsList} /> */}

        <SearchForStop setSelectedStopId={this.setSelectedStopId} selectedStop={this.selectedStop}
        currentUser={this.props.userDets} />
      

      
        {this.getDataForRefine()}
 
    
      </div>

    )
  }
}

export default graphql(BUS_ROUTES_QUERY)(FindStop);