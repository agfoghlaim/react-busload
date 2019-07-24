import React from 'react';
import styles from './HomeHero.module.css';
//import busoutline from '../../../img/busoutline.svg';
// import busoutlinewhite from '../../../img/busoutlinewhite.svg';
//import newLogo from '../../../img/newLogo.svg';
import newLogo from '../../../img/busLogoNew4.svg';
const homeHero = () => {
return      <div className={styles.homePageHeroWrap}>
  <img className={styles.busoutline} src={newLogo} alt="bus"/>
<div className={styles.wrapOne}>
  <div className={styles.logo}></div>
  
</div>
</div>
}

export default homeHero;