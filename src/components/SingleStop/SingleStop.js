import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
// import { Link } from 'react-router-dom';
// import { throwServerError } from 'apollo-link-http-common';








class SingleStop extends Component {

  state = {
    dayNumber:new Date().getDay(),
    dayString:function(){
      //console.log("HERE>>>>>>>> ", this.dayNumber,parseInt(this.dayNumber) === 0)
      let dayNumber = parseInt(this.dayNumber)
      if(dayNumber > 0 && dayNumber < 6){
        //console.log("sending week", dayNumber)
        return 'week';
      }else if(dayNumber === 0 ){
        //console.log("sending sun")
        return 'sun';
      }else if(dayNumber === 6 ){
        //console.log("sending sat")
        return 'sat'
      }else{
        //console.log("sending default (is a problem)")
        return 'week'
      }
    }
  }

  // handleTimetableDay(dayno){

  //   if(dayno !== this.state.dayNumber){
  //     this.setState((prev)=>{
  //       return {dayNumber:dayno}
  //     })
  //   }
  // }

  componentDidMount(){
 console.log("in mount")
    // if(this.props.match.params.dayno !== this.state.dayNumber){
 
    //   this.setState((prev)=>{
    //     return {dayNumber:this.props.match.params.dayno}
    //   })
    // }
  }


  getAppropiateTimetableName = ()=> {
    if(this.state.dayNumber > 0 && this.state.dayNumber < 6){
      //console.log("sending week", this.state.dayNumber)
      return 'week';
    }else if(this.state.dayNumber === 0 ){
      //console.log("sending sun")
      return 'sun';
    }else if(this.state.dayNumber === 6 ){
      //console.log("sending sat")
      return 'sat'
    }else{
      //console.log("sending default (is a problem)")
      return 'week'
    }
  }

  changeBusTimes_X = (day)=>{
   // if(day !== this.state.dayNumber){
      this.props.history.replace(`/${this.props.match.params.route}/${this.props.match.params.direction}/${this.props.match.params.bestopid}/${day}`)
      this.setState({dayNumber:day})
   // }

  }
  



  render(){
//console.log("on render ", this.state)

    
//  const ONE_STOP_QUERY = gql`
//  query oneStopQuery($route: String!, $direction:String!,$bestopid:String!){
//    stop(route:$route, direction:$direction,bestopid:$bestopid){
//      name
//      bestopid
//      stop_sequence
//      bus_times_${this.state.dayString()}{
//        bus
//        time
//      }
//    }
//  }
//  `;
const ONE_STOP_QUERY = gql`
query oneStopQuerySnaps($route: String!, $direction:String!,$bestopid:String!){
  stop2(route:$route, direction:$direction,bestopid:$bestopid){
    name
    bestopid
    stop_sequence
    bus_times_${this.state.dayString()}{
      bus
      time
    }
  }
}
`;

  let { bestopid, route, direction, dayno } = this.props.match.params;

  if(!bestopid || !route || !direction) return <p>Something's not right</p>

  
  return<Query 

  query={ONE_STOP_QUERY} 
  variables={{route, direction, bestopid}}>
  
    {
      ({ loading, error, data }) => {
  
      if (loading) return <p>loading...</p>;
      if (error) return `Error! ${error}`;
     // console.log("got something .... ", data.stop)
      if(data.stop2){
       console.log("got it back")
        //there is a problem with duplicate bus listings that goes right back to how the timetables were taken from Bus éireann pdfs...
        //filter duplicate buses here to avoid console errors. 
        let filteredTimes =data.stop2[`bus_times_${this.state.dayString()}`].filter((item,i,arr)=>{
          return arr.map((one)=>{
            return one['bus'];}).indexOf(item['bus'])===i;
          })
        return <div style={{background:'orange'}}>
   
          <h3>Sent {this.state.dayString()}</h3>
      
          <button onClick={()=>this.changeBusTimes_X(2)}>Week</button>
          <button onClick={()=>this.changeBusTimes_X(6)}>Sat</button>
          <button onClick={()=>this.changeBusTimes_X(0)}>Sun</button>

          <p>{data.stop2.bestopid}</p>
          <p>{data.stop2.name}</p>
          <p>{data.stop2.stop_sequence}</p>
          
          {filteredTimes.map(bus=><p key={`${bus.bus}`}>{bus.bus} - {bus.time}</p>)}
        
        </div>
      }else{
        return <p>Oops, there was a problem loading the timetables!</p>
      }

    }
    }

  </Query>

  }
 
}

export default SingleStop;