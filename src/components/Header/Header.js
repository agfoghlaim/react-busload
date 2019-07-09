import React from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import busoutline from '../../img/busoutline.svg';
import busoutlinewhite from '../../img/busoutlinewhite.svg';

const header = (props) => {

 return (
   <header className={styles.header}>
    <div className={styles.wrapOne}>
       {/* <div className={styles.burger}>Burger</div> */}
       <div className={styles.logo}><a href="/">BusLoad</a></div>
       <img className={styles.busoutline} src={busoutlinewhite} />
       
    </div>

    <nav className={styles.nav}>
       <div className={styles.navWrap}>
         <ul>
           <li><a href="/">Home</a></li>
           
           <li><a href="/">Contact</a></li>
           {(props.userDets.isUser) ? 

          <li onClick={()=>props.handleLogOut()}>
            <span>Logout</span>
          </li>
            : 
            <li><Link to={'/auth'}>Sign Up/Sign In</Link></li>
            }
           
         </ul>
       </div>
    </nav>

   </header>
 );
}

export default header;
