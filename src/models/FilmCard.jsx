import React from 'react';
import './style/filmCard.css';

const FilmCard = ({ id, title, poster, rating, type }) => {
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const handleClick = () => {
    const slug = `${slugify(title)}.html`;
    if (type === 'serial') {
      window.location.href = `/serials/${id}/${slug}`; // ❗ to‘liq reload
    } else {
      window.location.href = `/movies/${id}/${slug}`;
    }
  };

  return (
    <div className="film-card-1" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="poster-wrapper-1">
        <img src={poster} alt={title} className="film-poster-1" />
        <button className="watch-btn-1">KO‘RISH</button>
        <div className="badge-1">HD</div>
        <div className="badge-2">{rating}</div>
      </div>
      <div className="film-info-1">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default FilmCard;
