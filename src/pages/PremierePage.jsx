import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import Card from '../models/FilmCard';
import './style/PremierePage.css';
import YandexFloorAd from '../components/YandexFloorAd';
import YandexRtbAd from '../components/YandexAmpAd';
import YandexTopAds from '../components/YandexTopAds';


const PremierePage = () => {
  const isLightMode = document.body.classList.contains('light-mode');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAgeLimit, setSelectedAgeLimit] = useState(null);

  useEffect(() => {
    const fetchPremieres = async () => {
      try {
        const res = await axios.get('https://api.kinotime.world/api/genres/1');
        if (Array.isArray(res.data.movies)) {
          const extracted = res.data.movies.map((item) => item.movie);
          setMovies(extracted);
          setFilteredMovies(extracted);
        }
      } catch (err) {
        console.error('Premyera kinolarni olishda xatolik:', err);
      }
    };

    fetchPremieres();
  }, []);

  const handleFilter = () => {
    const filtered = movies.filter((movie) => {
      const matchYear = selectedYear ? movie.year.toString() === selectedYear.value : true;
      const matchCountry = selectedCountry ? movie.country === selectedCountry.value : true;
      const matchAgeLimit = selectedAgeLimit ? movie.ageLimit === selectedAgeLimit.value : true;
      return matchYear && matchCountry && matchAgeLimit;
    });

    setFilteredMovies(filtered);
  };

  const allYears = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a);
  const allCountries = [...new Set(movies.map(movie => movie.country))];
  const allAgeLimits = [...new Set(movies.map(movie => movie.ageLimit))];

  const yearOptions = allYears.map(year => ({ value: year.toString(), label: year.toString() }));
  const countryOptions = allCountries.map(c => ({ value: c, label: c }));
  const ageLimitOptions = allAgeLimits.map(a => ({ value: a, label: a }));

  return (
    <div className="premiere-container">
      <YandexRtbAd/>
      <h1 className="premiere-title">PREMYERA FILMLAR</h1>

      <div className="filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <Select
          className="filter-select-2"
          options={yearOptions}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Yil"
          isClearable
          styles={getCustomStyles(isLightMode)}
        />
        <Select
          className="filter-select-2"
          options={countryOptions}
          value={selectedCountry}
          onChange={setSelectedCountry}
          placeholder="Davlat"
          isClearable
          styles={getCustomStyles(isLightMode)}
        />
        <Select
          className="filter-select-2"
          options={ageLimitOptions}
          value={selectedAgeLimit}
          onChange={setSelectedAgeLimit}
          placeholder="Yosh"
          isClearable
          styles={getCustomStyles(isLightMode)}
        />
        <button className="filter-button-2" onClick={handleFilter}>Filtrlash</button>
      </div>

      <div className="premiere-grid">
        {filteredMovies.map((movie) => (
          <Card
            key={movie.id}
            title={movie.name}
            poster={movie.posterUrl}
            rating={movie.rating}
            id={movie.id}
          />
        ))}
      </div>
      <YandexFloorAd/>
    <YandexTopAds/>
    </div>
  );
};

// === LIGHT/DARK MODE uchun react-select style ===
const getCustomStyles = (isLightMode) => ({
  menu: (base) => ({
    ...base,
    backgroundColor: isLightMode ? '#fff' : '#111',
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? isLightMode ? '#e0e0e0' : '#8000ff'
      : isLightMode ? '#fff' : '#111',
    color: isLightMode ? '#000' : '#fff',
    padding: '10px 15px',
    cursor: 'pointer',
  }),
  control: (base) => ({
    ...base,
    backgroundColor: isLightMode ? '#f0f0f0' : '#1a1a1a',
    borderColor: isLightMode ? '#ccc' : '#8000ff',
    color: isLightMode ? '#000' : '#fff',
    minWidth: '130px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: isLightMode ? '#999' : '#a64dff',
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: isLightMode ? '#000' : '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    color: isLightMode ? '#555' : '#aaa',
  }),
  input: (base) => ({
    ...base,
    color: isLightMode ? '#000' : '#fff',
  }),
});

export default PremierePage;
