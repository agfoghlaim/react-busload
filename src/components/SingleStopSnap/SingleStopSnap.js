
import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
//import { graphql } from 'react-apollo';
import { Query } from 'react-apollo';
import Timetable from '../Timetable/Timetable';



class SingleStopSnap extends Component{

  state = {
  dayNumber:new Date().getDay(),
  //dayString:new Date().toString().substring(0,3)
  dayString:function(){
    let dayNumber = parseInt(this.dayNumber)

    if(dayNumber > 0 && dayNumber < 6){
      //console.log("sending week", dayNumber)
      return 'Mon';
    }else if(dayNumber === 0 ){
      //console.log("sending sun")
      return 'Sun';
    }else if(dayNumber === 6 ){
      //console.log("sending sat")
      return 'Sat'
    }else{
      //console.log("sending default (is a problem)")
      return 'Week'
    }
  }
}

changeBusTimes_X = (day)=>{
    if(day === ""){
      day = new Date().getDay()
    }
    this.props.history.replace(`/${this.props.match.params.route}/${this.props.match.params.direction}/${this.props.match.params.bestopid}/${day}`)
      
      this.setState({dayNumber:day})
  }

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
  let requestedTimetable = this.state.dayString()
  
    if(!bestopid || !route || !direction) return <p>Something's not right</p>
    
    return<Query 
  
    query={SINGLE_STOP_SNAPS} 
    variables={{route, direction, bestopid,requestedTimetable}}>
    
      {
        ({ loading, error, data }) => {
          
        if (loading) return <p>loading...</p>;
        if (error) return `Error! ${error}`;
        if(data.bus_times_x_snaps_2){

        //there is a problem with duplicate bus listings that goes right back to how the timetables were taken from Bus éireann pdfs...
        //filter duplicate buses here to avoid 'duplicates' console errors. 
          data.bus_times_x_snaps_2.bus_times = data.bus_times_x_snaps_2.bus_times.filter((item,i,arr)=>{
            return arr.map((one)=>{
              return one['bus']
            }).indexOf(item['bus'])===i;
          })
          

         return <React.Fragment>
          <button onClick={()=>this.changeBusTimes_X(2)}>Week</button>
          <button onClick={()=>this.changeBusTimes_X(6)}>Sat</button>
          <button onClick={()=>this.changeBusTimes_X(0)}>Sun</button>
          <button onClick={()=>this.changeBusTimes_X("")}>Today</button>
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