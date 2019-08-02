import React from 'react';
import styles from './BusRoutesList.module.css';
import { Link, Route } from 'react-router-dom';
import BusRouteStopsList from '../BusRouteStopsList/BusRouteStopsList';


const busRoutesList = (props) => {

props.busRoutes.sort((a, b)=>{return a.route-b.route});

 //props.setSelectedRoute
    return(
      <div  className={styles.routeListWrap} >
      <h2>Choose your route</h2>
      <p className={styles.infoP}><small>Select your route to see map and list of stops.</small></p>
      <div className={styles.routewrap} >
      
        {
          props.busRoutes.map(busroute=>{
            return <Link 
            to={`bus/${busroute.route}/${busroute.direction}`}  
            key={`${busroute.route}-${busroute.direction}`} 
            className={`${styles.plainLink} ${styles.tooltip}`}>
              {/* <span className={styles.tooltiptext}>
              View Bus Stops
              </span> */}
              <div className={styles.routebox}>
                  <p className={styles.routeno}>{busroute.route}</p>
                  <p className={styles.routename}>{busroute.routename}</p>
              </div>
            </Link>
          })
        }
         <Route path='/:route/:direction/'  component={BusRouteStopsList} />
      </div>
      </div>
    )
}

export default busRoutesList;