import React, { useEffect } from 'react';

const YandexRtbAd = () => {
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
        blockId: 'R-A-15604108-3',
        renderTo: 'yandex_rtb_R-A-15604108-3',
      });
    });
  }, []);

  return (
    <div id="yandex_rtb_R-A-15604108-3" style={{width:'100%', height:'150px'}} className='yandexRtbAd'></div>
  );
};

export default YandexRtbAd;
