
import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import Timetable from '../Timetable/Timetable';
import styles from './SingleStopSnap.module.css';






class SingleStopSnap extends Component{

  state = {
    bus_times_x:[
      {active:true,dayNum:'',label:'Today'},
      {active:false,dayNum:2,label:'Weekday'},
      {active:false,dayNum:6,label:'Saturday'},
      {active:false,dayNum:0,label:'Sunday'}  
    ],

  
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


changeBusTimes_X = (day)=>{
  let isTodayStr = false;
    if(day === ""){
      isTodayStr = true;
      day = new Date().getDay()
    }
  //  this.props.history.push({pathname:`/${day}`})
    this.props.history.replace(`/${this.props.match.params.route}/${this.props.match.params.direction}/${this.props.match.params.bestopid}/${day}`)

    //make all active false first
    let stateCopy = this.state.bus_times_x
    stateCopy.map(t=>t.active=false)

    

    if(isTodayStr){
      //let stateCopy = this.state.bus_times_x;
      //stateCopy.active=true
      stateCopy[0].active=true;
    }else if([1,2,3,4,5].includes(day)){
      stateCopy[1].active=true;
    }else if(day === 6 ){
      stateCopy[2].active=true;
    }else if(day === 0){
      stateCopy[3].active=true;
    }


   
      this.setState({dayNumber:day,bus_times_x:stateCopy})
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
  console.log(bestopid, route,direction)
  let requestedTimetable = this.state.dayString()
 
  //console.log("req timetable is ", requestedTimetable)

  
    if(!bestopid || !route || !direction){
      return<p>Something's not right</p>
    } else{
    
          return<Query 
            query={SINGLE_STOP_SNAPS} 
            variables={{route,direction,bestopid,requestedTimetable}}>
              {({ loading:loadingOne,data:one}) => (
                <Query 
                //  skip={(this.state.bus_times_x[0].active) ? true : false }
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
                         <div className={styles.timetableBtnGrpDiv}>
                        {
                         
                          this.state.bus_times_x.map(bus=><button key={bus.label} className={(bus.active)? styles.buttonInfoActive : styles.buttonInfo} onClick={()=>this.changeBusTimes_X(bus.dayNum)}>{bus.label}</button>
                          
                          )
                        }
                        </div>

                      <Timetable busRoutes={one.bus_times_x_snaps_2} rtpiData={two} route={route} direction={direction} isToday={this.state.bus_times_x[0].active}/>
                      </React.Fragment>
                    }
                  }
                  </Query>
              )}
          </Query>
    }//end else




  }
}
export default SingleStopSnap