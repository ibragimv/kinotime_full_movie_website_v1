import React, { useState, useEffect, useRef } from 'react';
import './style/navbar.css';
import { FaSearch, FaSlidersH, FaPlayCircle, FaArrowRight, FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setResults([]);
      return;
    }

    try {
      const [moviesRes, serialsRes] = await Promise.all([
        fetch(`https://api.kinotime.world/api/movies?name=${encodeURIComponent(value)}`),
        fetch(`https://api.kinotime.world/api/serials?name=${encodeURIComponent(value)}`)
      ]);

      const [movies, serials] = await Promise.all([
        moviesRes.json(),
        serialsRes.json()
      ]);

      const all = [
        ...movies.map((m) => ({ ...m, type: 'movie' })),
        ...serials.map((s) => ({ ...s, type: 'serial' }))
      ];

      const filtered = all.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );

      setResults(filtered.slice(0, 5));
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const slugify = (str) =>
    str.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');

  const goTo = (item) => {
    const slug = slugify(item.name) + '.html';
    const path = item.type === 'movie'
      ? `/movies/${item.id}/${slug}`
      : `/serials/${item.id}/${slug}`;

    window.location.href = path;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const query = encodeURIComponent(search.trim());
      window.location.href = `/search?query=${query}`;
      setResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />BO'LIMLAR
        </button>

        <h1 className="navbar-logo" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
          KIN<FaPlayCircle size={25} style={{ marginBottom: 1}} /><span>TIME</span>
        </h1>
      </div>

      <div className="navbar-center" ref={searchRef}>
        <form className="search-box" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={handleSearch}
          />
          <button type="submit" className="search-btn"><FaSearch /></button>
        </form>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((item) => (
              <div
                key={item.id}
                className="result-item"
                onClick={() => goTo(item)}
              >
                <img
                  src={item.posterUrl}
                  alt={item.name}
                  className="result-poster"
                />
                <span className="search-result-movie-name">{item.name} - {item.year}</span>
                <p className="arrow-right"><FaArrowRight /></p>
              </div>
            ))}
          </div>
        )}

        <button
          className="filter-btn"
          onClick={() => window.location.href = '/catalog'}
        >
          <FaSlidersH />
        </button>
      </div>

      <div className="navbar-right">
        <button
          className="login-btn"
          onClick={() => window.location.href = '/developing'}
        >
          KIRISH ➝
        </button>
      </div>
    </div>
  );
};

export default Navbar;
