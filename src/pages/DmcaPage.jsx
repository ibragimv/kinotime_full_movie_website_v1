import React from 'react';
import './style/DmcaPage.css';

const DmcaPage = () => {
  return (
    <div className="dmca-container">
      <h1 className="dmca-title">DMCA Bildirishi</h1>
      <p className="dmca-text">
        Agar siz mualliflik huquqiga ega kontentning ushbu veb-saytda sizning roziligisiz joylashtirilganini aniqlasangiz, iltimos, bizga murojaat qiling va kontentni olib tashlashni so‘rashingiz mumkin.
      </p>

      <p className="dmca-text">
        DMCA shikoyatingizda quyidagilarni ko‘rsating:
      </p>

      <ul className="dmca-list">
        <li>Mualliflik huquqiga ega bo‘lgan asarning aniq nomi</li>
        <li>Ushbu asar joylashgan URL manzili</li>
        <li>Ismingiz va aloqa ma'lumotlaringiz (email, telefon)</li>
        <li>Bu kontent sizning ruxsatingizsiz joylashtirilganiga bo‘lgan ishonchingiz</li>
        <li>Yuqoridagi ma’lumotlarning to‘g‘riligiga bo‘lgan kafolatingiz</li>
      </ul>

      <p className="dmca-text">
       DMCA shikoyatlari uchun murojaat: <a href="mailto:support@kinotime.world">kinotimeworld@gmail.com</a>
      </p>
    </div>
  );
};

export default DmcaPage;
