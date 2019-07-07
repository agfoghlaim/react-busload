import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';


import FindStop from './FindStop';
import Auth from './Auth/Auth';

import Header from '../components/Header/Header';

import SingleStopSnap from '../components/SingleStopSnap/SingleStopSnap';
import BusRouteStopsList from '../components/BusRouteStopsList/BusRouteStopsList';
import styles from './App.module.css';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  render() {
 
    return (
      <BrowserRouter>
        <ApolloProvider client={client} >
        <div className={styles.App}>
          <Route path='/' component={Header} />
          <Route path='/auth' component={Auth} />
          <Route path='/' exact component={FindStop} />
          <Route path='/:route/:direction/:bestopid' component={SingleStopSnap} />
          <Route path='/:route/:direction/' exact component={BusRouteStopsList} />
        </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
