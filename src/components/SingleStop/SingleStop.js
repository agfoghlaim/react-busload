import React, { Component } from 'react';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';








class SingleStop extends Component {
  state = {
    dayNumber:new Date().getDay(),
    dayString:function(){
      console.log("HERE>>>>>>>> ", this.dayNumber,parseInt(this.dayNumber) === 0)
      let dayNumber = parseInt(this.dayNumber)
      if(dayNumber > 0 && dayNumber < 6){
        console.log("sending week", dayNumber)
        return 'week';
      }else if(dayNumber === 0 ){
        console.log("sending sun")
        return 'sun';
      }else if(dayNumber === 6 ){
        console.log("sending sat")
        return 'sat'
      }else{
        console.log("sending default (is a problem)")
        return 'week'
      }
    }
  }




  handleTimetableDay(dayno){
    console.log("updating")
    if(dayno !== this.state.dayNumber){
      this.setState((prev)=>{
        return {dayNumber:dayno}
      })
    }
  }

  
  componentDidMount(){
   // console.log(this.props.match.params)
    if(this.props.match.params.dayno !== this.state.dayNumber){
      console.log(this.props.match.params.dayno,this.state.dayNumber)
      this.setState((prev)=>{
        return {dayNumber:this.props.match.params.dayno}
      })
    }
  }
  getAppropiateTimetableName = ()=> {
    if(this.state.dayNumber > 0 && this.state.dayNumber < 6){
      console.log("sending week", this.state.dayNumber)
      return 'week';
    }else if(this.state.dayNumber === 0 ){
      console.log("sending sun")
      return 'sun';
    }else if(this.state.dayNumber === 6 ){
      console.log("sending sat")
      return 'sat'
    }else{
      console.log("sending default (is a problem)")
      return 'week'
    }
  }
  



  render(){
console.log("on render ", this.state)
  /*
  
  Check params for a day(default to no day, state defaults to today)... if it exists change the state so the right timetable will show

  */
    
 const ONE_STOP_QUERY = gql`
 query oneStopQuery($route: String!, $direction:String!,$bestopid:String!){
   stop(route:$route, direction:$direction,bestopid:$bestopid){
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
console.log(typeof dayno)

  // if(typeof dayno === 'string'){
  //   this.handleTimetableDay(dayno)
  // }
 
  
  return<Query 

  query={ONE_STOP_QUERY} 
  variables={{route, direction, bestopid}}>
  
    {
      ({ loading, error, data }) => {
        console.log("state ", this.state.dayString())
        console.log("query ", ONE_STOP_QUERY.definitions[0].selectionSet.selections[0].selectionSet.selections)
      if (loading) return <p>loading...</p>;
      if (error) return `Error! ${error}`;
     // console.log("got something .... ", data.stop)
      if(data.stop){

        //there is a problem with duplicate bus listings that goes right back to how the timetables were taken from Bus éireann pdfs...
        //filter duplicate buses here to avoid console errors. 
        let filteredTimes =data.stop[`bus_times_${this.state.dayString()}`].filter((item,i,arr)=>{
          return arr.map(function(one){
            return one['bus'];}).indexOf(item['bus'])===i;
          })
        return <div style={{background:'orange'}}>
        <h2>Always gets times for weekdays, sort this!!
        </h2>
        <h3>Sent {this.state.dayString()}</h3>
        {console.log(this.props.match)}
        <Link to={`/${this.props.match.params.route}/${this.props.match.params.direction}/${this.props.match.params.bestopid}/0`}>Sunday8</Link>
        <Link to={this.props.match.url + '/0'}>Sunday</Link>
        <Link to={this.props.match.url + '/6'}>Sat</Link>
        <p>{data.stop.bestopid}</p>
        <p>{data.stop.name}</p>
        <p>{data.stop.stop_sequence}</p>
        
        {filteredTimes.map(bus=><p key={`${bus.bus}`}>{bus.bus} - {bus.time}</p>)}
        
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