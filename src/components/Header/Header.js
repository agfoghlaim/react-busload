import React from 'react';
import styles from './Header.module.css';

const header = (props) => {
  console.log("header props ", props.userDets.displayName)
 return (
   <header className={styles.header}>
    <div className={styles.wrapOne}>
       {/* <div className={styles.burger}>Burger</div> */}
       <div className={styles.logo}><a href="/">BusLoad</a></div>
    </div>

    <nav className={styles.nav}>
       <div className={styles.navWrap}>
         <ul>
           <li><a href="/">Home</a></li>
           <li><a href="/">Register</a></li>
           <li><a href="/">Contact</a></li>
           {(props.userDets.isUser) ? <li><a href="/">{props.userDets.displayName} {props.userDets.userId} {(props.userDets.emailVerified) ? 'verified' : 'not verified'}</a></li>
            : null }
           
         </ul>
       </div>
    </nav>

   </header>
 );
}

export default header;
