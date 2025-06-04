import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import FilmCard from '../models/FilmCard';
import FilmCardSkeleton from '../components/FilmCardSkeleton';
import './style/KatalogMoviePage.css';
import { BiGridAlt } from "react-icons/bi";

const CatalogMoviePage = () => {
  const isLightMode = document.body.classList.contains('light-mode');
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genreId');
  const pageParam = parseInt(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreName, setGenreName] = useState('');

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAgeLimit, setSelectedAgeLimit] = useState(null);

  const moviesPerPage = 20;
  const currentPage = pageParam;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`https://api.kinotime.world/api/genres/${genreId}`);
        const data = await res.json();
        if (data.movies) {
          setGenreName(data.name);
          const movieList = data.movies.map((item) => item.movie);
          setMovies(movieList);
          setFilteredMovies(movieList);
        }
      } catch (err) {
        console.error('Xatolik:', err);
      } finally {
        setLoading(false);
      }
    };

    if (genreId) fetchMovies();
  }, [genreId]);

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

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    window.location.href = `/catalog/movie?genreId=${genreId}&page=${pageNumber}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const sideCount = 2;
    const maxVisible = sideCount * 2 + 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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
        <span key={`dots-${index}`} className="catalog-movies-pagination-dots">...</span>
      ) : (
        <button
          key={page}
          className={currentPage === page ? 'catalog-movies-pagination-button active' : 'catalog-movies-pagination-button'}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className='catalog-movies-container'>
      <h1 className="catalog-movies-title"><BiGridAlt size={30}/> {genreName} KINOLAR</h1>

      <div className="catalog-movies-header">
        <div className="catalog-movies-filters">
          <Select
            className="catalog-movies-filter-select"
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Yil"
            isClearable
            styles={getCustomStyles(isLightMode)}
          />
          <Select
            className="catalog-movies-filter-select"
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Davlat"
            isClearable
            styles={getCustomStyles(isLightMode)}
          />
          <Select
            className="catalog-movies-filter-select"
            options={ageLimitOptions}
            value={selectedAgeLimit}
            onChange={setSelectedAgeLimit}
            placeholder="Yosh"
            isClearable
            styles={getCustomStyles(isLightMode)}
          />
          <button className="catalog-movies-filter-button" onClick={handleFilter}>Filtrlash</button>
        </div>
      </div>

      <div className="catalog-movies-grid">
        {(loading ? [...Array(10)] : currentMovies).map((movie, index) => (
          <div key={index}>
            {loading ? (
              <FilmCardSkeleton />
            ) : (
              <FilmCard title={movie.name} poster={movie.posterUrl} id={movie.id} />
            )}
          </div>
        ))}
      </div>

      {!loading && totalPages > 1 && (
        <div className="catalog-movies-pagination">
          {renderPageNumbers()}
        </div>
      )}
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

export default CatalogMoviePage;
