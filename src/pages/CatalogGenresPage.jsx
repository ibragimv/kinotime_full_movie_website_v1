// src/pages/CatalogGenresPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/CatalogGenresPage.css';

const fontFamilies = [
  'Playfair Display', 'Roboto', 'Lobster', 'Merriweather',
  'Oswald', 'Montserrat', 'Raleway', 'Poppins',
  'Bebas Neue', 'Ubuntu', 'Fjalla One', 'Dancing Script',
  'PT Serif', 'Quicksand', 'Cinzel', 'Caveat',
  'Anton', 'Rubik', 'Teko', 'Exo 2',
  'Josefin Sans', 'Arvo', 'Noto Sans', 'Mukta'
];

const CatalogGenresPage = () => {
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch('https://api.kinotime.world/api/genres');
        const data = await res.json();
        setGenres(data);
      } catch (error) {
        console.error('Janrlarni olishda xatolik:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    navigate(`/catalog/movie?genreId=${genreId}`);
  };

  return (
    <div className="catalog-container">
      <div className="genre-list">
        {genres.map((genre, index) => (
          <div
            key={genre.id}
            className="genre-card"
            style={{
              fontFamily: `'${fontFamilies[index % fontFamilies.length]}', sans-serif`
            }}
          >
            <div className="genre-name"   onClick={() => handleGenreClick(genre.id)}>{genre.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogGenresPage;
