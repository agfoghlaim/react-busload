import React from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';


  const oneStopQuery = gql`
  query oneStopQuery($route: String!, $direction:String!,$bestopid:String!){
    stop(route:$route, direction:$direction,bestopid:$bestopid){
      name
      bestopid
      stop_sequence
      bus_times_week{
        bus
        time
      }
    }
  }
`;



const singleStop = (props) => {
  console.log("single stop props ", props.selectedStop)
  let { bestopid, route, direction } = props.selectedStop;
  
  if(!bestopid || !route || !direction) return <p>nothing selected</p>

    return<Query 
    query={oneStopQuery} 
    variables={{route, direction, bestopid}}>

      {
        ({ loading, error, data }) => {
        if (loading) return <p>loading...</p>;
        if (error) return `Error! ${error}`;
        console.log("got something .... ", data.stop)
        if(data.stop){
          return <div>
          <p>{data.stop.bestopid}</p>
          <p>{data.stop.name}</p>
          <p>{data.stop.stop_sequence}</p>
        
          {data.stop.bus_times_week.map(bus=><p>{bus.bus} - {bus.time}</p>)}
          
        </div>
        }else{
          return <p>loadwhat</p>
        }
 
      }
      }

    </Query>
}

export default singleStop;