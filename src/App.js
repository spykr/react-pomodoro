import React, { Component } from 'react';
import './App.scss';
import Header from './Header.js';
import CircleTimer from './CircleTimer.js';

class App extends Component {
  render() {
    return (
      <div className="c-app">
        <Header />
        <div className="c-body">
          <CircleTimer />
        </div>
      </div>
    )
  }
}

export default App;
