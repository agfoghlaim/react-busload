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

state = {
  selectedStop:{bestopid:'',route:'',direction:''},
  selectedRoute:{route:'',direction:''}
}

setSelectedStopId = (e, selectedStop) =>{
e.preventDefault();
//console.log(bestopid,route,bestopid)
  let {bestopid,route,direction} = selectedStop;
  console.log(bestopid,route,bestopid)
  if(!bestopid || !route || !direction) return
  console.log(bestopid,route,bestopid)
  this.setState({
    selectedStop:{bestopid,route,direction}
  }, ()=>console.log("state now ", this.state.selectedStop))
}

// setSelectedRoute = (e,route,direction)=>{
//   this.setState({selectedRoute:{route,direction}})
// }

  getDataForRefine = () =>{
    let theData = this.props.data
    if(theData.loading)return <p>loading</p>
    if(theData.error)return <p>Could not load routes.</p>
    return <React.Fragment>
      <BusRoutesList   busRoutes={theData.busRoutesOverview} />
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