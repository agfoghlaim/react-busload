import React from 'react';
import styles from './BusRoutesList.module.css';
import { Link } from 'react-router-dom';

const busRoutesList = (props) => {
 // console.log(props)
    return(
      <div className={styles.routeListWrap} >
      <h3>Choose your route</h3>
      <div className={styles.routewrap} >
      
        {
          props.busRoutes.map(busroute=>{
            return <Link to={`${busroute.route}/${busroute.direction}`}  key={`${busroute.route}-${busroute.direction}`}><div 
           
            className={styles.routebox}>
              <p className={styles.routeno}>{busroute.route}</p>
              <p className={styles.routename}>{busroute.routename}</p>
              </div></Link>
          })
        }
      </div>
      </div>
    )
}

export default busRoutesList;