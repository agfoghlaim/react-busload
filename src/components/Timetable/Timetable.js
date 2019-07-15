import React from 'react';
import wet from '../../img/wet_white.svg';
import dry from '../../img/dry_white.svg';
import { isWithinMinutesOf } from '../../helpers';
import styles from './Timetable.module.css';




const timetable = (props) => {

  //maybe this should happen on the server??
  //check the busRoutes.bus_times for corresponding rtpiData results
  //add a busRoutes.bus_times.rtpi field: false for no result, scheduleddeparture datetime if there is a result
//console.log(props.busRoutes)
  props.busRoutes.bus_times.map(bus=>{
    return bus.rtpi = findBus(props.rtpiData.rtpiRequest.results,bus.time)
  })

function findBus(rtpiRes, due){
 // console.log(props)
  let relevantRoute = rtpiRes.filter(route=>{
    return isWithinMinutesOf(due, route.scheduleddeparturedatetime.substr(11,5), 3)
  })

  //relevantRoute should always be length = 1;
  //0 means the bus being queried for is not on the RTPI for that stop
  return (relevantRoute.length === 1) ? relevantRoute[0] : false
}

function getAvgStrings(avg){
 // console.log(avg)
  if(avg ==='x'){
    return 'x';
  }
  else if(!isNaN(avg) && avg > 0){
     return `${avg} mins (late)`
  }else if(!isNaN(avg) && avg < 0){
    return `${avg} mins (early)`
  }else if(avg === 0){
    return 'on time';
  }
}

 

    return(
      <div className={styles.timetableDiv}>
        <div className={styles.divAboveTable}>
          <h5>{props.busRoutes.bestopid}</h5>
          {
            (props.rtpiData.rtpiRequest.results[0].destination)?
            <h5>Route {props.route} Towards {props.rtpiData.rtpiRequest.results[0].destination}</h5>
            :<h5>Route {props.route}</h5>
          }
         
          <h5>{props.busRoutes.name}</h5>
          <h5>{props.busRoutes.stop_sequence}</h5>
          <h5>{props.busRoutes.timetable_name}</h5>
        </div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            {/* <th>bus</th> */}
            <th className={styles.th}>Scheduled</th>
            <th className={styles.th}>RTPI</th>
            <th className={styles.th}>Wet<img src={wet} alt='wet'/></th>
            <th className={styles.th}>Dry<img src={dry} alt='dry'/></th>
            <th className={styles.th}>Average</th>
          </tr>
        </thead>
      {props.busRoutes.bus_times.map((b,i)=>{

            if(b.wet_avg === null) b.wet_avg = 'x'
            if(b.dry_avg === null) b.dry_avg = 'x'
            if(b.total_avg === null) b.total_avg = 'x'
            // (!isNaN(b.wet_avg) && b.wet_avg > 0 )? `${b.wet_avg} (late)` : `${b.wet_avg} (early)`
              b.wet_avg = getAvgStrings(b.wet_avg)
              b.dry_avg = getAvgStrings(b.dry_avg)
              b.total_avg = getAvgStrings(b.total_avg)
          return(
            <tbody key={b.bus}>
            <tr className={styles.tr} >
              
              <td className={styles.td}>{b.time}</td> 
              <td className={styles.td}>{b.rtpi.departuredatetime}</td>
              <td className={styles.td}>{b.wet_avg} <br />({b.num_wet} results)</td> 
              <td className={styles.td}>{b.dry_avg}<br /> ({b.num_dry} results)</td> 
              <td className={styles.td}> {b.total_avg}<br /> ({b.num_total} results)</td> 
              
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