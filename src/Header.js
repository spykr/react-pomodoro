import React from 'react';
import './Header.scss';
import logo from './logo.svg';

const Header = () => (
  <div className="c-header">
    <a href="" className="c-header__left">
      <img className="c-header__logo" src={logo} alt="logo" />
      <div className="c-header__title">Pomodoro</div>
    </a>
    <div className="c-header__right">
    </div>
  </div>
);

export default Header;

//<i className="c-header__button material-icons">info_outline</i>
//<i className="c-header__button material-icons">settings</i>
