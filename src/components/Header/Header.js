import React from 'react';
import styles from './Header.module.css';
import Nav from '../Nav/Nav';
import HomeHero from '../UI/HomeHero/HomeHero';
import Weather from '../Weather/Weather';
import { Route } from 'react-router-dom';


const header = (props) => {
  
 return (
   <header className={styles.header}>
      <Weather />
      <Route exact path='/' component={HomeHero}/>
      <Nav handleLogOut={props.handleLogOut} userDets={props.userDets}/>
   </header>
 );
}

export default header;
