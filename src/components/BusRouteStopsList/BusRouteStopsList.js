import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import Maps from '../../containers/Maps/Maps';
import styles from './BusRouteStopsList.module.css';


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

  render(){
      //let { route, direction } = this.props.match.params;
      let { route, direction } = this.state.selectedRoute;
      return(
        <Query 
          query={STOPS_LIST_QUERY} 
          variables={{route, direction}}>
            {
              ({ loading, error, data }) => {
                  //console.log(data)
                if (loading) return <p>loading...</p>;
                if (error) return `Error! ${error}`;
                if(data.busRouteOverviewLocal){
                  console.log(data.busRouteOverviewLocal)
                    return <div>
                      {
                        this.showMap(data.busRouteOverviewLocal.stops)}
                      <div className={styles.linksWrapDiv}>{ this.showLinks(data.busRouteOverviewLocal.stops)
                      }</div>
                    </div>

                }

              }
            }
          </Query>
      )
  }
}

export default BusRouteStopsList;