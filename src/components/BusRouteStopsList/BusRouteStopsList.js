import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import Maps from '../../containers/Maps/Maps';
import styles from './BusRouteStopsList.module.css';
import BreadCrumbs from '../Breadcrumbs/Breadcrumbs';


/*

TODO - this should be a functional component. I changed during troubleshooting and can't be bothered to change back. 

*/
const STOPS_LIST_QUERY = gql`
query stopsListQuery($route: String!, $direction: String!){
  busRouteOverviewLocal(route:$route, direction:$direction){
    route,
    direction,
    stops{
      name,
      bestopid,
      stop_sequence,
      latitude,
      longitude
    }
  }
}
`;

 

class BusRouteStopsList extends Component {

  state={
    selectedRoute:{route:this.props.match.params.route,direction:this.props.match.params.direction}
  }

 
  //console.log(props)
  showLinks = (stops)=>{
    
    return stops.map(stop=>{
      return <div key={stop.bestopid} className={styles.stopLinkDiv}>
       
          <Link to={`${this.props.location.pathname}/${stop.bestopid}`} key={stop.bestopid} className={styles.Link}>
        <div key={stop.bestopid}>
          {/* <h4>{stop.name} <small>{stop.bestopid}</small></h4>
          <p>{stop.stop_sequence}</p> */}
          
          <h4>{stop.stop_sequence} {stop.name} </h4>
          <p><small>{stop.bestopid}</small></p>
        </div>
      </Link>
        
        </div>
    })

  }

  showMap = (stops) =>{
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> ",props.)
    return <Maps stops={stops} currentPath={this.props.location.pathname} />
  }

  checkValidRouteDirection =(r,d)=>{
    const routes = [401,402,404,405,409];
    const directions = ['w','e'];
    if(!routes.includes(parseInt(r)) || ! directions.includes(d.toLowerCase())){
      return false;
    }else{
      return true
    }
  }
  render(){
      //let { route, direction } = this.props.match.params;
      let { route, direction } = this.state.selectedRoute;
      console.log(route,direction)
      if(route==='user' || route === 'auth') return '';
      if(!this.checkValidRouteDirection(route,direction)) return <p>Oops! BusLoad is confused. Please go to the Home Page and start again. </p>
      return(
        <React.Fragment>
          <BreadCrumbs />
       
        <Query 
          query={STOPS_LIST_QUERY} 
          variables={{route, direction}}>
            {
              ({ loading, error, data }) => {
                  //console.log(data)
                if (loading) return <p>loading...</p>;
                if (error) return <p>Oops! BusLoad is having trouble communicating with the server. Please try again in a while.</p>;
                if(data.busRouteOverviewLocal){
                  console.log(data.busRouteOverviewLocal)
                    return <div>
                      {
                        this.showMap(data.busRouteOverviewLocal.stops)}
                      <div className={styles.linksWrapDiv}>
                      <h3 className={styles.sectionH3}>Choose your Stop</h3>
                      { this.showLinks(data.busRouteOverviewLocal.stops)
                      }
                      </div>
                    </div>

                }

              }
            }
        </Query>
        </React.Fragment>
       
      )
  }
}

export default BusRouteStopsList;