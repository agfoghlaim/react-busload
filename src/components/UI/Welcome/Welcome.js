import React from 'react';
import styles from './Welcome.module.css';
const welcome = () => {
return <div className={styles.welcomeDiv}>
  <p className ={styles.welcomeP}>
    Welcome to BusLoad. <br/>Find your stop or choose your route to find Busloads of information.
  </p>
</div>
}

export default welcome;