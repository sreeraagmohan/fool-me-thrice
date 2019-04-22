import React from 'react';

import {
  HashRouter as Router,
  Route
} from 'react-router-dom'

import './App.css';
import LoginPageComponent from './components/LoginPage';
import SelectPageComponent from './components/SelectPage';
import ReadPageComponent from './components/ReadPage';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div id="root">
          <Route exact path="/" component={LoginPageComponent} />
          <Route path="/read" exact component={ReadPageComponent} />
          <Route path="/select" exact component={SelectPageComponent} />
        </div>
      </Router>
    );
  }
}

export default App;