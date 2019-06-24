import React, { Fragment } from 'react'

const refineForStop = (props) => {
  console.log(props)
    return(
 <div style={{background:'pink'}}>
   <h5>BusRoute Component:</h5>
      <p>{props.route.route} {props.route.direction}</p>
      <p>{props.route.routename}</p>
      </div>
    )
}

export default refineForStop;