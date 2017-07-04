import React, { Component } from 'react';
import './CircleTimer.scss';
import play from './play.svg';
import pause from './pause.svg';

class CircleTimerInner extends Component {
  formatTime( t ){
    let minutes = Math.max( 0, Math.floor( t / 60 ) );
    let seconds = Math.max( 0, t );
    if( minutes > 0 )
    {
      seconds = t % ( minutes * 60 );
    }

    return (
        <p className="c-timer-inner__time">
          { ( minutes < 10 ) ? `0${minutes}` : minutes }
          :
          { ( seconds < 10 ) ? `0${seconds}` : seconds }
        </p>
    )
  }

  render() {
    return (
      <div className="c-timer-inner">
        <p className="c-timer-inner__status">
          {this.props.status}
        </p>
        <div className="u-flex-rows">
          <img className="c-timer-inner__icon" src={this.props.paused ? pause : play} alt="playing" />
          {this.formatTime( this.props.time )}
        </div>
        { this.props.buttonText !== null &&
          <button className="c-button c-timer-inner__c-button" onClick={this.props.buttonClick}>
            {this.props.buttonText}
          </button>
        }
      </div>
    )
  }
}

export default CircleTimerInner;
