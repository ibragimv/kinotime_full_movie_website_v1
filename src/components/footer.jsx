import React, { useEffect } from 'react';
import './style/footer.css';

const Footer = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(d,s){
        var img = d.getElementById("licnt3F6F");
        if(img) {
          img.src = "https://counter.yadro.ru/hit?t12.6;r" + 
            escape(d.referrer) + 
            ((typeof(s)=="undefined") ? "" : ";s" + s.width + "*" + s.height + "*" + 
            (s.colorDepth ? s.colorDepth : s.pixelDepth)) + 
            ";u" + escape(d.URL) + 
            ";h" + escape(d.title.substring(0,150)) + 
            ";" + Math.random();
        }
      })(document, screen);
    `;
    document.body.appendChild(script);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Chap tomon */}
        <div className="footer-left">KinoTime</div>

        {/* O‘rta qism */}
        <div className="footer-center">
          <div className="copyright">©2025 Barcha huquqlar himoyalangan</div>
          <div className="footer-counter">
            <a href="https://www.liveinternet.ru/click" target="_blank" rel="noreferrer">
              <img
                id="licnt3F6F"
                width="88"
                height="31"
                style={{ border: 0 }}
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAIBTAA7"
                alt="LiveInternet statistikasi"
                title="LiveInternet: 24 soat, bugungi va umumiy tashriflar"
              />
            </a>
          </div>
        </div>

        {/* O‘ng tomon */}
        <div className="footer-right">
          <span
            className="footer-link"
            onClick={() => window.location.href = '/contact'}
            style={{ cursor: 'pointer' }}
          >
            Biz bilan aloqa
          </span>
          <span
            className="footer-link"
            onClick={() => window.location.href = '/dmca'}
            style={{ cursor: 'pointer' }}
          >
            DMCA
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
