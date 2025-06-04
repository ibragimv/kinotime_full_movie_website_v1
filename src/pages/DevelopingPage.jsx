import React from 'react';
import { FaWrench, FaRegClock} from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import './style/DevelopingPage.css';

const DevelopingPage = () => {
  return (
    <div className="developing-container">
      <div className="developing-box">
        <div className="icons">
          <FaWrench className="icon wrench" size={100}/>
          <FiSettings className="icon gear" size={100}/>
          <FaRegClock className='icon clock' size={100}/>
        </div>
        <p className="message">Bu bo‘lim ishlab chiqilmoqda...</p>
      </div>
    </div>
  );
};

export default DevelopingPage;
