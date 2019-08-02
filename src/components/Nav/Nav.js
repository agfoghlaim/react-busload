import React from 'react';
import styles from './Nav.module.css';
import { NavLink } from 'react-router-dom';

const nav = (props) => {
 
  return(
    <nav className={styles.nav}>

    <div className={styles.navWrap}>
      <ul>
        <li><NavLink activeClassName={styles.active} exact to={'/'}>Home</NavLink></li>
        
        {(props.userDets.isUser) 

        ? 
          <React.Fragment>
            <li>
              <NavLink activeClassName={styles.active} to={`/user/${props.userDets.userId}`} >Profile</NavLink>
            </li>
            <li>
            <button  onClick={()=>props.handleLogOut()} className={styles.buttonSmall}>Logout</button>
            </li>
          </React.Fragment>
         : 

         <li><NavLink activeClassName={styles.active} to={'/auth'}>Sign Up/Sign In</NavLink></li>
        }
        
      </ul>
    </div>
 </nav>
  )
}

export default nav;