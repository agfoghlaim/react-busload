import React, { Component } from 'react';
//import ReactDOM from "react-dom";
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import SearchForStop from '../components/SearchForStop/SearchForStop';
import BusRoutesList from '../components/BusRoutesList/BusRoutesList';
import Spinner from '../components/UI/Spinner/Spinner';


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
  selectedRoute:{route:'',direction:''}, section:null
}



componentDidUpdate(){
  this.doScroll();
}

componentDidMount(){
  this.doScroll();
}

doScroll =() =>{
  //console.log("scroll", this.props.location.hash)
  //const node = ReactDOM.findDOMNode(this)
    if(this.props.location.hash === '#routes'){
      this.busroutes.scrollIntoView({ behavior: "smooth" });
  }  
}

pretend = ()=>{
  return <p>pretend</p>
}


setSelectedStopId = (e, selectedStop) =>{
e.preventDefault();

  let {bestopid,route,direction} = selectedStop;
  
  if(!bestopid || !route || !direction) return
 
  this.setState({
    selectedStop:{bestopid,route,direction}
  }, ()=>console.log("state now ", this.state.selectedStop))
}


  getDataForRefine = () =>{
    let theData = this.props.data
    if(theData.loading)return <Spinner />
    if(theData.error)return <p>Could not load routes.</p>

    return <div id="routes">
      <BusRoutesList busRoutes={theData.busRoutesOverview} />
    </div>
   
  }

  render(){
    
    return(
      <React.Fragment>
        <div  id="stops">
          <SearchForStop 
            setSelectedStopId={this.setSelectedStopId} 
            selectedStop={this.selectedStop}
            currentUser={this.props.userDets} />
        </div>
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.busroutes = el; }}>
        </div>
        {this.getDataForRefine()}

      </React.Fragment>
    )
  }
}

export default graphql(BUS_ROUTES_QUERY)(FindStop);