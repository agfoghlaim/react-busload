import React from 'react';
import styles from './RefineForStop.module.css';

const refineForStop = (props) => {
  console.log(props)
    return(
      <div className={styles.routewrap} >
        
        {
          props.busRoutes.map(busroute=>{
            return <div 
            key={`${busroute.route}-${busroute.direction}`}
            className={styles.routebox}>
              <p className={styles.routeno}>{busroute.route}</p>
              <p className={styles.routename}>{busroute.routename}</p>
            </div>
          })
        }
      </div>
    )
}

export default refineForStop;