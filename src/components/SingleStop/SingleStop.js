import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
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



class SingleStop extends Component {
 // console.log("single stop props ", props.selectedStop)
  componentDidMount(){
    console.log(this.props)
  }

  render(){
     //let { bestopid, route, direction } = props.selectedStop;
  let { bestopid, route, direction } = this.props.match.params;
  console.log("ok ", bestopid, route, direction)
  if(!bestopid || !route || !direction) return <p></p>
   
  return<Query 
  query={oneStopQuery} 
  variables={{route, direction, bestopid}}>

    {
      ({ loading, error, data }) => {
      if (loading) return <p>loading...</p>;
      if (error) return `Error! ${error}`;
     // console.log("got something .... ", data.stop)
      if(data.stop){
      /*
        TODO - There's duplicates of some buses (because they're were duplicates on the Bus Éireann pdf timetables). This should have been sorted before they went into the db.
      */
 

      //  let filtered_bus_times_week= Array.from(new Set(data.stop.bus_times_week))
       console.log(data.stop.bus_times_week)
     
        return <div style={{background:'orange'}}>
        <p>{data.stop.bestopid}</p>
        <p>{data.stop.name}</p>
        <p>{data.stop.stop_sequence}</p>
        {data.stop.bus_times_week.map(bus=><p key={`${bus.bus}`}>{bus.bus} - {bus.time}</p>)}
        
      </div>
      }else{
        return <p>loadwhat</p>
      }

    }
    }

  </Query>

  }
 
}

export default SingleStop;