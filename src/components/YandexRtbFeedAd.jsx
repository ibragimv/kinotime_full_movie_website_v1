import React, { useEffect } from 'react';

const YandexRtbFeedAd = () => {
  useEffect(() => {
    // Yandex context.js scriptni yuklash
    const script = document.createElement('script');
    script.src = 'https://yandex.ru/ads/system/context.js';
    script.async = true;
    document.body.appendChild(script);

    // Reklama blokini chaqirish
    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya.Context.AdvManager.render({
        blockId: 'R-A-15604108-4',
        renderTo: 'yandex_rtb_R-A-15604108-4',
        type: 'feed'
      });
    });
  }, []);

  return (
    <div id="yandex_rtb_R-A-15604108-4" style={{ width: '100%' }}></div>
  );
};

export default YandexRtbFeedAd;
