import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import SearchForStop from '../components/SearchForStop/SearchForStop';
import BusRoutesList from '../components/BusRoutesList/BusRoutesList';
import Spinner from '../components/UI/Spinner/Spinner';
import styles from './FindStop.module.css';

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
  selectedRoute:{route:'',direction:''}, section:null
}



componentDidUpdate(){
  this.doScroll();
}

componentDidMount(){
  this.doScroll();
  this.props.closeStopList()
}

doScroll =() =>{
    if(this.props.location.hash === '#routes'){
      this.busroutes.scrollIntoView({ behavior: "smooth" });
  }  
}

pretend = ()=>{
  return <p>pretend</p>
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
      <div className={styles.FindStopWrap}>
        <div  id="stops">
          <div className={styles.searchStopWrap}>
          <h2 className={styles.sectionH3}>Find your stop</h2>
              {
                (this.props.userDets.userId) ?
                <p className={styles.infoP}><small>Select your stop. Then click 'Save' to add to Quick Stops or 'Go' to view timetables.</small></p>
                : 
                <p className={styles.infoP}><small>Select your stop and click 'Go' to view timetables.</small></p>
              }


            <SearchForStop 
              setSelectedStopId={this.props.setSelectedStopId} 
              selectedStop={this.props.selectedStop}
              handleChooseStop={this.props.handleChooseStop}
              currentUser={this.props.userDets}
              handleShowStopsList={this.props.handleShowStopsList}
              handleSearchStop={this.props.handleSearchStop}
              showStopList={this.props.showStopList}
              showGoBtn={true} />

        
          </div>
        </div>
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.busroutes = el; }}>
        </div>
        {this.getDataForRefine()}

      </div>
    )
  }
}

export default graphql(BUS_ROUTES_QUERY)(FindStop);