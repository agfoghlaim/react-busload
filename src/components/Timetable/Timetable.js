import React from 'react'

const timetable = (props) => {
  console.log(props)
    return(
      <div>
      <h5>{props.busRoutes.bestopid}</h5>
      <h5>{props.busRoutes.name}</h5>
      <h5>{props.busRoutes.stop_sequence}</h5>
      <h5>{props.busRoutes.timetable_name}</h5>
      <table>
        <thead>
          <tr>
            <th>bus</th>
            <th>Time</th>
            <th>Wet</th>
            <th>Dry</th>
            <th>Average</th>
          </tr>
        </thead>
{props.busRoutes.bus_times.map(b=>{
 
       if(b.total_avg === null) b.total_avg = 'x'
       if(b.wet_avg === null) b.wet_avg = 'x'
       if(b.dry_avg === null) b.dry_avg = 'x'
      
          return(
            <tbody>
            <tr key={b.bus}>
              <td>{b.bus}</td>
              <td>{b.time}</td> 
              <td>{b.wet_avg}</td> 
              <td>{b.dry_avg} </td> 
              <td> {b.total_avg}   </td> 
              
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