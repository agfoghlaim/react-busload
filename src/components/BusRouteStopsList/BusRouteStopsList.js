import React from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

const STOPS_LIST_QUERY = gql`
query stopsListQuery($route: String!, $direction: String!){
  busRoute(route:$route, direction:$direction){
    stops{
      name,
      bestopid
    }
   
  }
}
`;

const busRouteStopsList = (props) => {
  let { route, direction } = props.match.params;
  console.log(props)
  return(
    <Query 
      query={STOPS_LIST_QUERY} 
      variables={{route, direction}}>

        {
          ({ loading, error, data }) => {
          if (loading) return <p>loading...</p>;
          if (error) return `Error! ${error}`;
        
        
          if(data.busRoute){
            return data.busRoute.stops.map(stop=>{
              return <Link to={`${props.location.pathname}/${stop.bestopid}`} key={stop.bestopid}>
                <div key={stop.bestopid}>
                  <h4>{stop.name}</h4>
                  <p>{stop.bestopid}</p>
                </div>
              </Link>
            })
          }else{
            return <p>Nothing to Show</p>
          }

          }
        }
      </Query>
  )
}

export default busRouteStopsList;