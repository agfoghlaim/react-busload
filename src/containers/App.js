import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Route } from 'react-router-dom';


import FindStop from './FindStop';
import Header from '../components/Header/Header';
import SingleStop from '../components/SingleStop/SingleStop';
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
          <Route path='/' exact component={FindStop} />
          <Route path='/:route/:direction/:bestopid' exact component={SingleStop} />
          <Route path='/:route/:direction/' exact component={BusRouteStopsList} />
            {/* <Header /> */}
            {/* <FindStop /> */}
        </div>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}

export default App;
