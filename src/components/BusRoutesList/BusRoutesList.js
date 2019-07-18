import React from 'react';
import styles from './BusRoutesList.module.css';
import { Link, Route } from 'react-router-dom';
import BusRouteStopsList from '../BusRouteStopsList/BusRouteStopsList';

const busRoutesList = (props) => {
  

 //props.setSelectedRoute
    return(
      <div className={styles.routeListWrap} >
      <h3>Choose your route</h3>
      <div className={styles.routewrap} >
      
        {
          props.busRoutes.map(busroute=>{
            return <Link onClick={(e)=>props.setSelectedRoute(e,busroute.route,busroute.direction)} to={`${busroute.route}/${busroute.direction}`}  key={`${busroute.route}-${busroute.direction}`} className={styles.plainLink}><div 
           
            className={styles.routebox}>
              <p className={styles.routeno}>{busroute.route}</p>
              <p className={styles.routename}>{busroute.routename}</p>
              </div></Link>
          })
        }
         <Route path='/:route/:direction/'  component={BusRouteStopsList} />
      </div>
      </div>
    )
}

export default busRoutesList;