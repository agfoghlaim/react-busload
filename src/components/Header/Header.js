import React from 'react';
import styles from './Header.module.css';

const header = (props) => {
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
           <li><a href="/">{props.userDets.userId}</a></li>
         </ul>
       </div>
    </nav>

   </header>
 );
}

export default header;