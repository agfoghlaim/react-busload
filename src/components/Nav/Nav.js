import React from 'react';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

const nav = (props) => {

  return(
    <nav className={styles.nav}>

    <div className={styles.navWrap}>
      <ul>
        <li><a href="/">Home</a></li>
        
        <li><a href="/">About</a></li>
        {(props.userDets.isUser) ? 

       <li onClick={()=>props.handleLogOut()}>
         <button className={styles.buttonSmall}>Logout</button>
       </li>
         : 
         <li><Link to={'/auth'}>Sign Up/Sign In</Link></li>
         }
        
      </ul>
    </div>
 </nav>
  )
}

export default nav;