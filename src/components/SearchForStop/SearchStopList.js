import React from 'react'
import styles from './SearchStopList.module.css';
const searchStopList = (props) => {

    return (<ul className={styles.theUl}>
    {
      props.filteredStops.map(stop=><li
        className={styles.theLi} 
        key={`${stop.bestopid}-${stop.route}-${stop.direction}`}
        data-bestopid={stop.bestopid}
        data-route={stop.route}
        data-direction={stop.direction}
        onClick={props.handleChooseStop}>
        {stop.name} - {stop.bestopid}-{stop.route} 
        </li>)
    }
</ul>)
}

export default searchStopList;