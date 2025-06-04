import React, { useState } from 'react';
import './style/ContactPage.css';
import Alert from '../components/Alert'; 

const ContactPage = () => {
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);

    setTimeout(() => setShowAlert(false), 10000); // 10 sekunddan keyin yo‘qoladi
  };

  return (
    <div className="contact-wrapper">
      {showAlert && (
        <Alert
          message="Xabaringiz muvaffaqiyatli yuborildi!"
          onClose={() => setShowAlert(false)}
        />
      )}

      <div className="contact-page">
        <h1 className="contact-title">Taklif va Shikoyat uchun</h1>
        <p className="contact-subtitle">Taklif, fikr yoki shikoyatingiz bo‘lsa, quyidagi formani to‘ldiring:</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Ismingiz" required />
          <input type="email" placeholder="Email manzilingiz" required />
          <textarea placeholder="Xabaringiz..." rows="6" required></textarea>
          <button type="submit">Yuborish</button>
        </form>
      </div>

      <div className="contact-info-box">
        <h2>Tezkor aloqa</h2>
        <p>Email: <a href="mailto:support@kinotime.world">kinotimeworld@gmail.com</a></p>
        <p>Telefon: <a href="tel:+998949150808">+998 94 915 0808</a></p>
        <p>Telegram: <a href="https://t.me/kinotime_world_admin" target="_blank">@kinotime_world_admin</a></p>
        <p>Instagram: <a href="https://www.instagram.com/kinotime_world" target="_blank">kinotime_world</a></p>
      </div>
    </div>
  );
};

export default ContactPage;
