import React from 'react';
import Tux from '../../hoc/Tux';
import Header from '../Header/Header';
import styles from './Layout.module.css';

const layout = (props) => ( 
  <Tux>
    <div>
      <Header userDets ={props.userDets} handleLogOut={props.handleLogOut} />
    </div>
    <main className={styles.main}>
      {props.children}
    </main>
  </Tux>
)


export default layout;