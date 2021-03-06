
import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import Timetable from '../Timetable/Timetable';
import Spinner from '../UI/Spinner/Spinner';
import BreadCrumbs from '../Breadcrumbs/Breadcrumbs';







class SingleStopSnap extends Component{

  state = {
    // bus_times_x:[
    //   {active:true,dayNum:'',label:'Today'},
    //   {active:false,dayNum:2,label:'Weekday'},
    //   {active:false,dayNum:6,label:'Saturday'},
    //   {active:false,dayNum:0,label:'Sunday'}  
    // ],
    bus_times_x:[
      {active:true,dayNum:'',label:'Today'},
      {active:false,dayNum:1,label:'Mon'},
      {active:false,dayNum:2,label:'Tues'},
      {active:false,dayNum:3,label:'Wed'},
      {active:false,dayNum:4,label:'Thurs'},
      {active:false,dayNum:5,label:'Fri'},
      {active:false,dayNum:6,label:'Sat'},
      {active:false,dayNum:0,label:'Sun'}  
    ],

  
  dayNumber:new Date().getDay(),
  dayString:function(){
    let dayNumber = parseInt(this.dayNumber)

    if(dayNumber === 1){
     // console.log("sending week", dayNumber)
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
  let isTodayStr = false;
    if(day === ""){
      isTodayStr = true;
      day = new Date().getDay()
    }
  //  this.props.history.push({pathname:`/${day}`})
    this.props.history.replace(`/bus/${this.props.match.params.route}/${this.props.match.params.direction}/${this.props.match.params.bestopid}/${day}`)

    //make all active false first
    let stateCopy = this.state.bus_times_x
    stateCopy.map(t=>t.active=false)

    
    if(isTodayStr){
      stateCopy[0].active=true;
    }else if(day === 1){
      stateCopy[1].active=true;
    }else if(day === 2){
      stateCopy[2].active=true;
    }
    else if(day === 3){
      stateCopy[3].active=true;
    }
    else if(day === 4){
      stateCopy[4].active=true;
    }
    else if(day === 5){
      stateCopy[5].active=true;
    }
    else if(day === 6 ){
      stateCopy[6].active=true;
    }else if(day === 0){
      stateCopy[7].active=true;
    }


   
      this.setState({dayNumber:day,bus_times_x:stateCopy})
  }

  filterResponse = (resp) =>{
       //filter out duplicate buses, this is happening because of how the timetables were copied and pasted from the Bus Éireann pdfs.
       return resp.filter((item,i,arr)=>{
        return arr.map((one)=>{
          return one['bus']
        }).indexOf(item['bus'])===i;})
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
          origin
          destination
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
        wet_avg
        dry_avg
        total_avg
        num_dry
        num_wet
        num_total
        wet_snaps {
          _id
          queryScheduledTime
          dayOfWeek
          queryDateTime
          forBusDue
          timetabled
          actual
          earlyOrLate
          minutesOff
        }
        dry_snaps {
          _id
          queryScheduledTime
          dayOfWeek
          queryDateTime
          forBusDue
          timetabled
          actual
          earlyOrLate
          minutesOff
        }
      }
    }
    }`
  let { bestopid, route, direction } = this.props.match.params;
  //console.log(bestopid, route,direction)
  let requestedTimetable = this.state.dayString()
 
  //console.log("req timetable is ", requestedTimetable)

  
    if(!bestopid || !route || !direction){
      return<p>Something's not right</p>
    } else{
    
      return<React.Fragment>
        <BreadCrumbs />
{/* 
            <ChooseTimetable timetables={this.state.bus_times_x} changeBusTimes_X={this.changeBusTimes_X} /> */}
        
        <Query 
            query={SINGLE_STOP_SNAPS} 
            variables={{route,direction,bestopid,requestedTimetable}}>
              {({ loading:loadingOne,data:one}) => (
                <Query 
                  query={RTPI_INFO} 
                  variables={{route,bestopid}}>
                  {
                    ({ loading:loadingTwo,data:two }) => {
                      if(loadingOne || loadingTwo) return <Spinner />
            
                      if(!one || !two)return <p>Oops! BusLoad is confused. Please go to the Home Page and start again. </p>

                      if(!one.bus_times_x_snaps_2 )return <p>Oops! BusLoad has a problem. Please try again. </p>
                      //console.log(one)
                      one.bus_times_x_snaps_2.bus_times = this.filterResponse(one.bus_times_x_snaps_2.bus_times)

                      return (
                        <React.Fragment>
                          
            
                          <Timetable 
                          timetables={this.state.bus_times_x} 
                  
                          changeBusTimes_X={this.changeBusTimes_X}
                          busRoutes={one.bus_times_x_snaps_2} 
                          rtpiData={two} 
                          route={route} 
                          direction={direction} 
                          isToday={this.state.bus_times_x[0].active}/>
                        </React.Fragment>
                      )
                    }
                  }
                  </Query>
              )}
      </Query>
      </React.Fragment>
    }//end else




  }
}
export default SingleStopSnap