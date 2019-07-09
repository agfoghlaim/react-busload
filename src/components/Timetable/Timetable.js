import React from 'react';
import wet from '../../img/wet.svg';
import dry from '../../img/dry.svg';
import { isWithinMinutesOf } from '../../helpers';



const timetable = (props) => {

  //maybe this should happen on the server??
  //check the busRoutes.bus_times for corresponding rtpiData results
  //add a busRoutes.bus_times.rtpi field: false for no result, scheduleddeparture datetime if there is a result
console.log(props.busRoutes)
  props.busRoutes.bus_times.map(bus=>{
    return bus.rtpi = findBus(props.rtpiData.rtpiRequest.results,bus.time)
  })

function findBus(rtpiRes, due){
  let relevantRoute = rtpiRes.filter(route=>{
    return isWithinMinutesOf(due, route.scheduleddeparturedatetime.substr(11,5), 3)
  })

  //relevantRoute should always be length = 1;
  //0 means the bus being queried for is not on the RTPI for that stop
  return (relevantRoute.length === 1) ? relevantRoute[0] : false
}


 

    return(
      <div>
      <h5>{props.busRoutes.bestopid}</h5>
      <h5>{props.busRoutes.name}</h5>
      <h5>{props.busRoutes.stop_sequence}</h5>
      <h5>{props.busRoutes.timetable_name}</h5>
      <table>
        <thead>
          <tr>
            {/* <th>bus</th> */}
            <th>Scheduled</th><th>RTPI</th>
            <th>Wet<img src={wet} alt='wet'/></th>
            <th>Dry<img src={dry} alt='dry'/></th>
            <th>Average</th>
          </tr>
        </thead>
{props.busRoutes.bus_times.map((b,i)=>{

  if(b.wet_avg === null) b.wet_avg = 'x'
  if(b.dry_avg === null) b.dry_avg = 'x'
  if(b.total_avg === null) b.total_avg = 'x'
      
          return(
            <tbody key={b.bus}>
            <tr >
        
              {/* <td>{b.bus}</td> */}
              <td>{b.time}</td> 
              <td>{b.rtpi.departuredatetime}</td>
              <td>{b.wet_avg} mins</td> 
              <td>{b.dry_avg} mins </td> 
              <td> {b.total_avg}mins   </td> 
              
            </tr>
            </tbody>
          )
        
      })
  }



      </table>
      </div>
    )
      
  

}

export default timetable;