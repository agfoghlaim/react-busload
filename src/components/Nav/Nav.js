import React from 'react';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

const nav = (props) => {
 
  return(
    <nav className={styles.nav}>

    <div className={styles.navWrap}>
      <ul>
        <li><Link to={'/'}>Home</Link></li>
        
        {(props.userDets.isUser) 

        ? 
          <React.Fragment>
            <li>
              <Link to={`/user/${props.userDets.userId}`} >Profile</Link>
            </li>
            <li>
            <button  onClick={()=>props.handleLogOut()} className={styles.buttonSmall}>Logout</button>
            </li>
          </React.Fragment>
         : 

         <li><Link to={'/auth'}>Sign Up/Sign In</Link></li>
        }
        
      </ul>
    </div>
 </nav>
  )
}

export default nav;