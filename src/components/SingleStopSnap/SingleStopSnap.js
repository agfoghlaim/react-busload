
import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import Timetable from '../Timetable/Timetable';




class SingleStopSnap extends Component{

  state = {
  dayNumber:new Date().getDay(),
  dayString:function(){
    let dayNumber = parseInt(this.dayNumber)

    if(dayNumber === 1){
      console.log("sending week", dayNumber)
      return 'Mon';
    }
    else if(dayNumber === 2){
      return 'Tue';
    }
    else if(dayNumber === 3){
      return 'Wed';
    }
    else if(dayNumber === 4){
      return 'Thu';
    }
    else if(dayNumber === 5){
      return 'Fri';
    }
    else if(dayNumber === 0 ){
      console.log("sending sun")
      return 'Sun';
    }else if(dayNumber === 6 ){
      console.log("sending sat")
      return 'Sat'
    }else{
      console.log("sending default (is a problem)")
      return 'Week'
    }
  }
}

// componentDidMount(){
//   const { route, bestopid } = this.props.match.params;
//   const rtpiUrl = `https://rtpiapp.rtpi.openskydata.com/RTPIPublicService_v2/service.svc/realtimebusinformation?stopid=${bestopid}&routeid=${route}&format=json`
  
//   axios.get(rtpiUrl)
//   .then(r=>{
//     console.log("resp ", r.data)
//   }).catch(e=>console.log("err ", e))
// }

changeBusTimes_X = (day)=>{
    if(day === ""){
      day = new Date().getDay()
    }
    this.props.history.replace(`/${this.props.match.params.route}/${this.props.match.params.direction}/${this.props.match.params.bestopid}/${day}`)
      
      this.setState({dayNumber:day})
  }

  render(){
//only run if today!!
    const RTPI_INFO = gql`
    query rtpiRequest($route:String!, $bestopid:String!){
      rtpiRequest(route:$route, bestopid:$bestopid){
        errorcode,
        results{
          departuredatetime
          scheduleddeparturedatetime
          duetime
        }
   }
  }
  `
  
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
  //let requestedTimetable = 'Tue'
  console.log("req timetable is ", requestedTimetable)
 // console.log(this.date.dayString())
  
    if(!bestopid || !route || !direction) return <p>Something's not right</p>
    
    return<Query 
            query={SINGLE_STOP_SNAPS} 
            variables={{route,direction,bestopid,requestedTimetable}}>
              {({ loading:loadingOne,data:one}) => (
                <Query 
                  query={RTPI_INFO} 
                  variables={{route,bestopid}}>
                  {
                    ({ loading:loadingTwo,data:two }) => {
                      if(loadingOne || loadingTwo)return<p>loading</p>
                     // console.log("l1 ", loadingOne, one, two)

                      //filter out duplicate buses, this is happening because of how the timetables were copied and pasted from the Bus Éireann pdfs.
                      one.bus_times_x_snaps_2.bus_times = one.bus_times_x_snaps_2.bus_times.filter((item,i,arr)=>{
                        return arr.map((one)=>{
                          return one['bus']
                        }).indexOf(item['bus'])===i;})

                      return <React.Fragment>
                        <button onClick={()=>this.changeBusTimes_X(2)}>Week</button>
                        <button onClick={()=>this.changeBusTimes_X(6)}>Sat</button>
                        <button onClick={()=>this.changeBusTimes_X(0)}>Sun</button>
                        <button onClick={()=>this.changeBusTimes_X("")}>Today</button>
                        <Timetable busRoutes={one.bus_times_x_snaps_2} rtpiData={two} />
                      </React.Fragment>
                    }
                  }
                  </Query>
              )}
          </Query>
  




  }
}
export default SingleStopSnap