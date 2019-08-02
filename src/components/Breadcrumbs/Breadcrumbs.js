import React from 'react'
import { Link, withRouter } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const breadcrumbs = (props) => {

  let { route, direction, bestopid } = props.match.params

    let str = route+direction;

    switch(str){
      case '401W':
          str = 'towards Salthill';
          break;
      case '401E':
          str = 'towards Parkmore';
          break;
      case '402W':
          str = 'towards Seacrest';
          break;
      case '402E':
          str = 'towards Merlin Park';
          break;
      case '404W':
          str = 'towards Newcastle';
          break;
      case '404E':
          str = 'towards Oranmore';
          break;
      case '405W':
          str = 'towards Rahoon';
          break;
      case '405E':
          str = 'towards Ballybane';
          break;
      case '409W':
          str = 'towards Eyre Square';
          break;
      case '409E':
          str = 'towards Parkmore';
          break;
      default:
          str = '';
  
  }


 return <div className={`${styles.breadcrumbDiv}`}>
    <Link className={styles.breadLink}
    to={{pathname:`/`,hash:'#routes'}}
    >All Routes </Link>  
    <span className={styles.breadSlash}>/</span>
    <Link className={`${styles.breadLink} ${styles.routeno}`}to={`/bus/${route}/${direction}`}>{route} ({str}) </Link> 
    <span className={styles.breadSlash}>
        {(bestopid) ? '/' : null}
    </span>
    <span className={styles.breadBusid}>{bestopid} {bestopid? 'timetable':null}</span>
 
</div>


}

export default withRouter(breadcrumbs);

