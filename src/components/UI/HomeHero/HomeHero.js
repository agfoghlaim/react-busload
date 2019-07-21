import React from 'react';
import styles from './HomeHero.module.css';
//import busoutline from '../../../img/busoutline.svg';
import busoutlinewhite from '../../../img/busoutlinewhite.svg';
//import newLogo from '../../../img/newLogo.svg';
import newLogo from '../../../img/busLogoNew.svg';
const homeHero = () => {
return      <div className={styles.homePageHeroWrap}>
<div className={styles.wrapOne}>
  <div className={styles.logo}><a href="/"></a></div>
  <img className={styles.busoutline} src={newLogo} alt="bus"/>
</div>
</div>
}

export default homeHero;