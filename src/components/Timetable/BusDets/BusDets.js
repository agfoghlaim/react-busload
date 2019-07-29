import React from 'react';
import wetIcon from '../../../img/wet.svg';
import dryIcon from '../../../img/dry.svg';
import styles from './BusDets.module.css';

const busDets = (props) => {
  //console.log(props)
  let arrName = 'dry_snaps';
  let avgName = 'dry_avg';

  if(props.wetOrDry === 'wet') {
    arrName = 'wet_snaps'
    avgName = 'wet_avg'
  }


  const tableTop = ()=>{
    return <div className={styles.tableTop}>
      <img src={(props.wetOrDry === 'dry') ? dryIcon : wetIcon} alt={(props.wetOrDry === 'dry') ? 'dryIcon' : 'wetIcon'} />
      <p>{
      (!isNaN(props.busDets[`${avgName}`]) && props.busDets[`${avgName}`] > 0) ? 
      `Probably about ${props.busDets[`${avgName}`]} min(s) late*`
      : (!isNaN(props.busDets[`${avgName}`]) && props.busDets[`${avgName}`] < 0) ?
      `Probably about ${props.busDets[`${avgName}`]} min(s) early*`
      :  (!isNaN(props.busDets[`${avgName}`]) && props.busDets[`${avgName}`] === 0) ?
      'Probably ontime*'
      :'unknown'
      }</p>

      <p>
        Prediction is based on {props.busDets[`${arrName}`].length} snapshots for  {`${props.wetOrDry}`} weather
      </p>

      
     
      
    </div>
  }


  const showSnaps = ()=>{
 
      if(props.busDets[`${arrName}`].length){
        return props.busDets[`${arrName}`].map(snap=>{
          return(
              <tr className="snaps" key={snap._id}>
           
        
                <td>{(snap.timetabled !== 'bus_not_found_on_rtpi') ? snap.timetabled : snap.forBusDue}</td>
                <td>{snap.queryDateTime.substring(0,10)} @   {snap.queryScheduledTime} </td>
                <td>{(snap.actual !== 'bus_not_found_on_rtpi') ? snap.actual.substring(10,16) : 'not found'}</td>
                <td>{(snap.earlyOrLate !== 'bus_not_found_on_rtpi') ? snap.earlyOrLate  : `not found`}</td>
                <td>{(snap.minutesOff !== 'bus_not_found_on_rtpi') ? snap.minutesOff  : `not found`}</td>
              
              </tr>
          )
        })
      }else{
        return<tr><td>Sorry, no results.</td></tr>
      }
  }

  return <div>

    {tableTop()}
    
    <table className={styles.busDetsTable}>
      <thead>
        <tr>
        <th>Due at</th>
        <th>BusLoad checked at</th>
        <th>Departed at</th>
        <th>Status</th>
        <th>No. Mins</th>
        </tr>
      </thead>
      <tbody>

        {showSnaps()}

      </tbody>
    </table>
  
    <p><small>*BusLoad checks and saves real time info for bus stops two mins before a bus is scheduled to depart.  There is no guarentee that the bus actually departed at the times stated.  </small></p>

  </div>
}

export default busDets;