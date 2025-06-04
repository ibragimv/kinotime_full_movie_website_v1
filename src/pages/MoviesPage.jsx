import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Card from '../models/FilmCard';
import axios from 'axios';
import './style/MoviesPage.css';
import YandexFloorAd from '../components/YandexFloorAd';
import YandexRtbAd from '../components/YandexAmpAd';
import YandexTopAds from '../components/YandexTopAds';


const MoviesPage = () => {
  const isLightMode = document.body.classList.contains('light-mode');

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAgeLimit, setSelectedAgeLimit] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get('page')) || 1;
  const filterYear = urlParams.get('year');
  const filterGenre = urlParams.get('genre');
  const filterCountry = urlParams.get('country');
  const filterAgeLimit = urlParams.get('ageLimit');
  const moviesPerPage = 20;



  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('https://api.kinotime.world/api/movies');
        const all = res.data;
        setMovies(all);

        const filtered = all.filter((movie) => {
          const matchYear = filterYear ? movie.year.toString() === filterYear : true;
          const matchGenre = filterGenre ? movie.genres.some(g => g.genre.name === filterGenre) : true;
          const matchCountry = filterCountry ? movie.country === filterCountry : true;
          const matchAgeLimit = filterAgeLimit ? movie.ageLimit === filterAgeLimit : true;
          return matchYear && matchGenre && matchCountry && matchAgeLimit;
        });

        setFilteredMovies(filtered);

        if (filterYear) setSelectedYear({ value: filterYear, label: filterYear });
        if (filterGenre) setSelectedGenre({ value: filterGenre, label: filterGenre });
        if (filterCountry) setSelectedCountry({ value: filterCountry, label: filterCountry });
        if (filterAgeLimit) setSelectedAgeLimit({ value: filterAgeLimit, label: filterAgeLimit });
      } catch (err) {
        console.error('Kinolarni olishda xatolik:', err);
      }
    };

    fetchMovies();
  }, [filterYear, filterGenre, filterCountry, filterAgeLimit]);

  const handleFilter = () => {
    const query = new URLSearchParams();

    if (selectedYear) query.set('year', selectedYear.value);
    if (selectedGenre) query.set('genre', selectedGenre.value);
    if (selectedCountry) query.set('country', selectedCountry.value);
    if (selectedAgeLimit) query.set('ageLimit', selectedAgeLimit.value);
    query.set('page', 1);

    window.location.href = `?${query.toString()}`;
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber);
    window.location.href = `?${params.toString()}`;
  };

  const allYears = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a);
  const allGenres = [...new Set(movies.flatMap(movie => movie.genres.map(g => g.genre.name)))];
  const allCountries = [...new Set(movies.map(movie => movie.country))];
  const allAgeLimits = [...new Set(movies.map(movie => movie.ageLimit))];

  const yearOptions = allYears.map(year => ({ value: year.toString(), label: year.toString() }));
  const genreOptions = allGenres.map(g => ({ value: g, label: g }));
  const countryOptions = allCountries.map(c => ({ value: c, label: c }));
  const ageLimitOptions = allAgeLimits.map(a => ({ value: a, label: a }));

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    const sideCount = 2;
    const maxVisible = sideCount * 2 + 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > sideCount + 2) pages.push('...');
      const startPage = Math.max(2, currentPage - sideCount);
      const endPage = Math.min(totalPages - 1, currentPage + sideCount);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (currentPage < totalPages - sideCount - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === '...' ? (
        <span key={`dots-${index}`} className="dots">...</span>
      ) : (
        <button
          key={page}
          className={currentPage === page ? 'active' : ''}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="movies-container">
      <div className="movies-header">
        <YandexRtbAd/>
        <h1 className="movies-title">BARCHA FILMLAR</h1>
        <div className="filters">
          <Select className='filter-select' options={yearOptions} value={selectedYear} onChange={setSelectedYear} placeholder="Yil" isClearable styles={getCustomStyles(isLightMode)} menuPortalTarget={document.body} />
          <Select className='filter-select' options={genreOptions} value={selectedGenre} onChange={setSelectedGenre} placeholder="Janr" isClearable styles={getCustomStyles(isLightMode)} menuPortalTarget={document.body} />
          <Select className='filter-select' options={countryOptions} value={selectedCountry} onChange={setSelectedCountry} placeholder="Davlat" styles={getCustomStyles(isLightMode)} menuPortalTarget={document.body} />
          <Select className='filter-select' options={ageLimitOptions} value={selectedAgeLimit} onChange={setSelectedAgeLimit} placeholder="Yosh" styles={getCustomStyles(isLightMode)} menuPortalTarget={document.body} />
          <button className="filter-button" onClick={handleFilter}>Filtrlash</button>
        </div>
      </div>
      <div className="movies-grid-1">
        {currentMovies.map((movie) => (
          <Card key={movie.id} title={movie.name} poster={movie.posterUrl} rating={movie.rating} id={movie.id} />
        ))}
      </div>
      {totalPages > 1 && <div className="pagination">{renderPageNumbers()}</div>}
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


export default MoviesPage;
