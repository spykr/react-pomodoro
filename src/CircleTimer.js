import React, { Component } from 'react';
import './CircleTimer.scss';
import CircleTimerInner from './CircleTimerInner.js';
import CircleTimerButtons from './CircleTimerButtons.js';
import WebAudioAPISound from './Audio.js';

const strokeWidth = 2;
const timerMax = [
  25 * 60,
  5 * 60,
  15 * 60
];
// timerMax = [
//   1,
//   1,
//   1
// ];
const startStatus = 'CLICK TO START TIMER';
const stopStatus = 'CLICK TO STOP ALARM';
const pauseStatus = 'TIMER PAUSED';
const playStatus = [
  "CURRENTLY WORKING",
  "ON SHORT BREAK",
  "ON LONG BREAK"
];
const overStatus = [
  "TIME FOR A BREAK",
  "SHORT BREAK OVER",
  "LONG BREAK OVER"
];
const nextStatus = [
  "KEEP WORKING",
  "TAKE 5m BREAK",
  "TAKE 15m BREAK"
];

class CircleTimer extends Component {
  constructor( props ) {
    super( props );

    this.toggleTimer = this.toggleTimer.bind( this );
    this.tickTimer = this.tickTimer.bind( this );
    this.resetClick = this.resetClick.bind( this );
    this.nextClick = this.nextClick.bind( this );
    this.changeTimer = this.changeTimer.bind( this );
    this.initSounds = this.initSounds.bind( this );
    this.stopAlarmTimer = this.stopAlarmTimer.bind( this );
    this.getNextState = this.getNextState.bind( this );

    this.state = {
      alarmTimer: null,
      alarmSound: new WebAudioAPISound( process.env.PUBLIC_URL + '/turn', { volume: 1 } ),
      buttonClick: this.resetClick,
      buttonText: null,
      countdownSound: new WebAudioAPISound( process.env.PUBLIC_URL + '/click', { volume: 0.6 } ),
      progress: 100,
      paused: true,
      shortBreak: 1,
      soundsInit: false,
      status: startStatus,
      timer: null,
      timerState: 1,
      timerMax: timerMax[ 0 ],
      time: timerMax[ 0 ]
    };
  }

  toggleTimer( forceStart )
  {
    let paused = !this.state.paused;

    if( forceStart !== true )
    {
      if( this.state.alarmTimer !== null )
      {
        this.stopAlarmTimer();
        return;
      }
      if( this.state.time <= 0 )
      {
        return;
      }
    } else {
      paused = false;
    }

    let timer = null;
    let status = pauseStatus;
    let buttonText = null;
    if( paused )
    {
      clearInterval( this.state.timer );
      if( this.state.timerMax !== this.state.time )
      {
        buttonText = "RESET";
      }
    } else {
      this.initSounds();
      timer = setInterval( this.tickTimer, 1000 );
      status = playStatus[ this.state.timerState - 1 ];
      if( this.state.timerState === 2 )
        status = `${status} ${this.state.shortBreak}/3`;
    }
    this.setState({
      buttonClick: this.resetClick,
      buttonText: buttonText,
      paused: paused,
      status: status,
      timer: timer
    });
  }

  //Required for iOS to make sounds play
  initSounds()
  {
  	if( !this.state.soundsInit )
  	{
  		this.state.alarmSound.play( 0 );
      this.setState({
        soundsInit: true
      });
  	}
  }

  stopAlarmTimer()
  {
    clearInterval( this.state.alarmTimer );
    this.setState({
      alarmTimer: null,
      paused: true,
      status: overStatus[ this.state.timerState - 1 ]
    });
  }

  tickTimer()
  {
    let time = Math.max( 0, ( this.state.time - 1 ) );
    let progress = Math.max( 0, ( time / this.state.timerMax ) * 100 );
    if( time === 0 )
    {
      let beep = 3;
      let beeps = 0;
      let every = 1.1;
      clearInterval( this.state.timer );

      let newState = this.getNextState();
      let shortBreaks = this.state.shortBreak;
      if( this.state.timerState === 2 )
      {
        shortBreaks++;
      }
      else if( this.state.timerState === 3 )
      {
        shortBreaks = 1;
      }

      this.setState({
        alarmTimer: setInterval( function()
        {
          this.state.alarmSound.play();
          beeps++;
          if( beeps === beep )
          {
            this.stopAlarmTimer();
          }
        }.bind( this ), every * 1000 ),
        timer: null,
        buttonText: nextStatus[ newState - 1 ],
        buttonClick: this.nextClick,
        progress: 0,
        time: 0,
        shortBreak: shortBreaks
      });
    } else {
      if( time <= 5 )
      {
        this.state.countdownSound.play();
      }
      this.setState({
        progress: progress,
        time: time
      });
    }
  }

  resetClick()
  {
    this.setState({
      buttonText: null,
      progress: 100,
      status: startStatus,
      time: timerMax[ this.state.timerState - 1 ]
    });
  }

  getNextState()
  {
    let newState = 1;
    switch( this.state.timerState )
    {
      case 1:
        newState = 2;
        break;
      case 2:
        newState = 1;
        break;
      case 3:
        newState = 1;
        break;
      default:
        newState = 1;
    }
    if( this.state.timerState === 1 && this.state.shortBreak > 3 )
    {
      newState = 3;
    }
    return newState;
  }

  nextClick()
  {
    clearInterval( this.state.alarmTimer );
    let newState = this.getNextState();
    let timer = setInterval( this.tickTimer, 1000 );
    let status = playStatus[ newState - 1 ];
    if( newState === 2 )
      status = `${status} ${this.state.shortBreak}/3`;
    // let shortBreaks = this.state.shortBreak;
    // if( newState === 3 )
    //   shortBreaks = 1;
    this.setState({
      alarmTimer: null,
      buttonText: null,
      paused: false,
      progress: 100,
      // shortBreak: shortBreaks,
      status: status,
      timerState: newState,
      timerMax: timerMax[ newState - 1 ],
      time: timerMax[ newState - 1 ],
      timer: timer
    });
  }

  changeTimer( i )
  {
    if( this.state.timer !== null )
    {
      clearInterval( this.state.timer );
    }
    if( this.state.alertTimer !== null )
    {
      clearInterval( this.state.alertTimer );
    }
    let t = timerMax[ i - 1 ];
    this.setState({
      alertTimer: null,
      buttonText: null,
      paused: true,
      progress: 100,
      status: startStatus,
      timerState: i,
      timerMax: t,
      time: t,
      timer: null
    });
  }

  render() {
    const radius = ( 50 - strokeWidth / 2 );
    const desc = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius }
      a ${radius},${radius} 0 1 1 0,-${2 * radius }
    `;
    const diameter = Math.PI * 2 * radius;
    const progress = {
      strokeDasharray: `${diameter}px ${diameter}px`,
      strokeDashoffset: `${ ( ( 100 - this.state.progress ) / 100 * diameter ) }px`
    };
    return (
      <div className="o-timer-wrapper">
        <svg className="c-timer" viewBox="0 0 100 100" onClick={this.toggleTimer}>
          <path className="c-timer__circle" d={desc} strokeWidth={strokeWidth} fillOpacity={0} />
          <path className="c-timer__progress" d={desc} strokeWidth={strokeWidth} fillOpacity={0} style={progress} />
        </svg>
        <CircleTimerInner
          paused={this.state.paused}
          time={this.state.time}
          status={this.state.alarmTimer !== null ? stopStatus : this.state.status}
          buttonClick={this.state.buttonClick}
          buttonText={this.state.buttonText}
        />
        <CircleTimerButtons
          active={this.state.timerState}
          changeTimer={this.changeTimer}
        />
      </div>
    );
  }
}

export default CircleTimer;
