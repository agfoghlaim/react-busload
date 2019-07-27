import React from 'react';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

const nav = (props) => {

  return(
    <nav className={styles.nav}>

    <div className={styles.navWrap}>
      <ul>
        <li><Link to={'/'}>Home</Link></li>
        
        <li><Link to={'/'}>About</Link></li>

        {(props.userDets.isUser) ? 

       <li>
         <button  onClick={()=>props.handleLogOut()} className={styles.buttonSmall}>Logout</button>
         <Link to={`/user/${props.userDets.userId}`} className={styles.buttonSmall}>Profile</Link>
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