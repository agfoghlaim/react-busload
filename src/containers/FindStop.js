import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import { Route } from 'react-router-dom';
import SearchForStop from '../components/SearchForStop/SearchForStop';
import BusRoutesList from '../components/BusRoutesList/BusRoutesList';
import SingleStop from '../components/SingleStop/SingleStop';


const BUS_ROUTES_QUERY = gql`
  query busRoutesQuery{
    busRoutes {
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
    return <React.Fragment>
      <BusRoutesList busRoutes={theData.busRoutes} />
    </React.Fragment>
   
  }

  render(){
 //console.log(this.props.data)
    return(
      <div>
        <h4>FindStop Component</h4>
        <SearchForStop setSelectedStopId={this.setSelectedStopId} selectedStop={this.selectedStop} />

        {/* <SingleStop selectedStop={this.state.selectedStop} /> */}
        {this.getDataForRefine()}
        {/* <Route path='/:busroute/:direction/:bestopid' exact component={SingleStop} /> */}
    
      </div>

    )
  }
}

export default graphql(BUS_ROUTES_QUERY)(FindStop);