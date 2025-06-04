import React, { Component } from 'react';
import { FaTelegram } from "react-icons/fa";
import './style/TelegramBanner.css';

class TelegramBanner extends Component {
  handleClick = () => {
    window.open('https://t.me/kinotime_world', '_blank');
  };

  render() {
    return (
      <div onClick={this.handleClick}>
        <h1 className='telegram-banner'>
          <FaTelegram size={50} color='rgba(255, 255, 255, 0.979)' /> 
          BIZNI TELEGRAM KANALDA KUZATING!
        </h1>
      </div>
    );
  }
}

export default TelegramBanner;
