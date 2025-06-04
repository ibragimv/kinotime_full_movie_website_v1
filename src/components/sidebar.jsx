import React, { useState, useEffect } from 'react';
import {
  FaTimes, FaHome, FaFilm, FaTv, FaFire, FaGem, FaHeart, FaSun, FaMoon
} from 'react-icons/fa';
import { BiGridAlt, BiCameraMovie } from "react-icons/bi";
import { useLocation, useNavigate } from 'react-router-dom';
import './style/sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [theme, setTheme] = useState('dark');
  const location = useLocation();
  const navigate = useNavigate();

  const closeSidebar = () => setIsOpen(false);
  const isActive = (path) => location.pathname === path;

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle('light-mode');
    const newTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      setTheme('light');
    } else {
      document.body.classList.remove('light-mode');
      setTheme('dark');
    }
  }, []);

  return (
    <>
      {/* FON ORQALIK OCHISH-UCHIRISH */}
      <div
        className={`mobile-sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* SIDEBAR O‘ZI */}
      <aside className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <h3>BO'LIMLAR</h3>
          <FaTimes className="close-icon" onClick={closeSidebar} />
        </div>

        <nav className="mobile-sidebar-menu">
          <a href="/" className={isActive('/') ? 'active' : ''}><FaHome /> Bosh Sahifa</a>
          <a href="/movies" className={isActive('/movies') ? 'active' : ''}><BiCameraMovie size={19} /> Filmlar</a>
          <a href="/serials" className={isActive('/serials') ? 'active' : ''}><FaFilm /> Seriallar</a>
          <a href="/tv" className={isActive('/tv') ? 'active' : ''}><FaTv /> Tv kanallar</a>
          <a href="/premiere" className={isActive('/premiere') ? 'active' : ''}><FaFire /> Premyera</a>
          <a href="/catalog" className={isActive('/catalog') ? 'active' : ''}><BiGridAlt size={18} /> Katalog</a>
          <a href="/developing" className={isActive('/favourites') ? 'active' : ''}><FaHeart size={17} /> Sevimlilar</a>
        </nav>

        <div className="mobile-sidebar-footer">
          <button onClick={() => navigate('/developing')}>
            <FaGem size={19} className='premium-icon' /> PREMIUM
          </button>
          <button onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />} FON RANGI
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
