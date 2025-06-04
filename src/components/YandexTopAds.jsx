import { useEffect } from 'react';

const YandexTopAds = () => {
  useEffect(() => {
    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      window.Ya.Context.AdvManager.render({
        blockId: 'R-A-15604108-1',
        renderTo: 'yandex_rtb_R-A-15604108-1',
        type: 'floorAd',
        platform: 'touch',
      });
    });
  }, []);

  return <div id="yandex_rtb_R-A-15604108-1"></div>;
};

export default YandexTopAds;
