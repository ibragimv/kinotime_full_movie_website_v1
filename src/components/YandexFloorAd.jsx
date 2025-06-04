import React, { useEffect } from 'react';

const YandexFloorAd = () => {
  useEffect(() => {
    // Yandex scriptni yuklash
    const script = document.createElement('script');
    script.src = 'https://yandex.ru/ads/system/context.js';
    script.async = true;
    document.body.appendChild(script);

    // Reklama blokini chaqirish
    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya.Context.AdvManager.render({
        blockId: 'R-A-15604108-5',
        type: 'floorAd',
        platform: 'desktop'
      });
    });
  }, []);

  return null; // floorAd sahifaning pastiga yopishtiriladi, element kerak emas
};

export default YandexFloorAd;
