import React from 'react'
import { Link, withRouter } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const breadcrumbs = (props) => {
    console.log("bread props ", props)
  let { route, direction, bestopid } = props.match.params
 // console.log( route, direction, bestopid )
    let str = route+direction;
    console.log(route,direction)
    console.log(str)
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
     console.log("returning ", str)           
    //return str;
  }


  console.log(props)


  return <div className={styles.breadcrumbDiv}>
    <Link className={styles.breadLink}to={`/`}>Home </Link>  
    <span className={styles.breadSlash}>/</span>
    <Link className={styles.breadLink}to={`/${route}/${direction}`}>{route} ({str}) </Link> 
    <span className={styles.breadSlash}>
        {(bestopid) ? '/' : null}
    </span>
    <span >{bestopid}</span>
    
  </div>
}

export default withRouter(breadcrumbs);

