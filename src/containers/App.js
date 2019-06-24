import React, { Component } from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';

import FindStop from './FindStop';

import styles from './App.module.css';


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client} >
      <div className={styles.App}>
          <h1 className="App-title">BusLoad</h1>
          <FindStop />
      </div>
      </ApolloProvider>
    );
  }
}

export default App;
