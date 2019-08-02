import React from 'react';
import Tux from '../../hoc/Tux';
import Header from '../Header/Header';
import styles from './Layout.module.css';
import Footer from '../UI/Footer/Footer';
import Welcome from '../UI/Welcome/Welcome';
import {Route}  from 'react-router-dom';

const layout = (props) => { 

  return<Tux>
    <div>
      <Header userDets ={props.userDets} handleLogOut={props.handleLogOut} />
    </div>
    <main className={styles.main}>
      <Route exact path='/' component={Welcome}/>
 
      {props.children}
     
    </main>
    <Footer />
  </Tux>
}


export default layout;