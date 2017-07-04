import React, { Component } from 'react';
import './CircleTimerButtons.scss';

class CircleTimerButtons extends Component {
  render(){
    return (
        <div className="c-timer-buttons">
          <button onClick={() => this.props.changeTimer( 1 )} className={ 'c-button c-timer-buttons__c-button' + ( ( this.props.active === 1 ) ? ' c-button--active' : '' ) }>
              WORK
          </button>
          <button onClick={() => this.props.changeTimer( 2 )} className={ 'c-button c-timer-buttons__c-button' + ( ( this.props.active === 2 ) ? ' c-button--active' : '' ) }>
              5m BREAK
          </button>
          <button onClick={() => this.props.changeTimer( 3 )} className={ 'c-button c-timer-buttons__c-button' + ( ( this.props.active === 3 ) ? ' c-button--active' : '' ) }>
              15m BREAK
          </button>
        </div>
    )
  }
}

export default CircleTimerButtons;
