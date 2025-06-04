import React from 'react';
import './style/NotFoundPage.css';
import { FaGhost } from 'react-icons/fa'; 
import YandexFloorAd from '../components/YandexFloorAd';
import YandexTopAds from '../components/YandexTopAds';


const NotFoundPage = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-icon">
        <FaGhost size={100} />
      </div>
      <p className="notfound-message">Kechirasiz, sahifa topilmadi.</p>
      <a href="/" className="notfound-button">Bosh sahifaga qaytish</a>
      <YandexFloorAd/>
    <YandexTopAds/>
    </div>
  );
};

export default NotFoundPage;
