
import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
//import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import Timetable from '../Timetable/Timetable';

// const ONE_STOP_QUERY = gql`
// query oneStopQuerySnaps($route: String!, $direction:String!,$bestopid:String!){
//   stop2(route:$route, direction:$direction,bestopid:$bestopid){
//     name
//     bestopid
//     stop_sequence
//     bus_times_${this.state.dayString()}{
//       bus
//       time
//     }
//   }
// }
// `;




class SingleStopSnap extends Component{

 

  render(){

    const SINGLE_STOP_SNAPS = gql`
  query bus_times_x_snaps_2($route:String!, $direction:String!,$bestopid:String!,$requestedTimetable:String!){
    bus_times_x_snaps_2(route:$route, direction:$direction,bestopid:$bestopid,requestedTimetable:$requestedTimetable){
   bestopid,
   stop_sequence
   name
   timetable_name
   bus_times {
     bus
     time
     wet_avg,
     dry_avg,
     total_avg
   }
 }
}
`
    let { bestopid, route, direction } = this.props.match.params;
  let requestedTimetable = 'Mon'
    if(!bestopid || !route || !direction) return <p>Something's not right</p>
  
    
    return<Query 
  
    query={SINGLE_STOP_SNAPS} 
    variables={{route, direction, bestopid,requestedTimetable}}>
    
      {
        ({ loading, error, data }) => {
    
        if (loading) return <p>loading...</p>;
        if (error) return `Error! ${error}`;
        if(data.bus_times_x_snaps_2){
         console.log("got it back",data.bus_times_x_snaps_2)
         return <React.Fragment>
         <Timetable busRoutes={data.bus_times_x_snaps_2} />
       </React.Fragment>
        }else{
          return <p>Oops, there was a problem loading the timetables!</p>
        }
  
      }
      }
  
    </Query>
  }
}
export default SingleStopSnap