import React from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import Maps from '../../containers/Maps/Maps';

const STOPS_LIST_QUERY = gql`
query stopsListQuery($route: String!, $direction: String!){
  busRouteOverviewLocal(route:$route, direction:$direction){
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

 

const busRouteStopsList = (props) => {
  console.log(props)
  let { route, direction } = props.match.params;
  //console.log(props)
  const showLinks = (stops)=>{
    return stops.map(stop=>{
      return <div key={stop.bestopid}>
          <Link to={`${props.location.pathname}/${stop.bestopid}`} key={stop.bestopid}>
        <div key={stop.bestopid}>
          <h4>{stop.name} <small>{stop.bestopid}</small></h4>
          <p>{stop.stop_sequence}</p>
          <p>{stop.latitude}</p>
          <p>{stop.longitude}</p>
        </div>
      </Link>
        
        </div>
    })

  }

  const showMap = (stops) =>{
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> ",props.)
    return <Maps stops={stops} currentPath={props.location.pathname} />
  }
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
              
                return <div>
                  {
                    showMap(data.busRouteOverviewLocal.stops)}
                   { showLinks(data.busRouteOverviewLocal.stops)
                  }
                </div>
                  

               

              

            }else{
              return <p>Nothing to Show</p>
            }

          }
        }
      </Query>
  )
}

export default busRouteStopsList;