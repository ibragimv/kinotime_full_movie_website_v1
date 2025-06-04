import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FilmCard from '../models/FilmCard';
import './style/SearchResultPage.css';
import { FaMeh } from 'react-icons/fa';
import YandexFloorAd from '../components/YandexFloorAd';
import YandexRtbAd from '../components/YandexAmpAd';
import YandexTopAds from '../components/YandexTopAds';


const SearchResultPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const pageParam = parseInt(new URLSearchParams(location.search).get('page')) || 1;
  const [results, setResults] = useState([]);

  const itemsPerPage = 20;
  const currentPage = pageParam;

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const [moviesRes, serialsRes] = await Promise.all([
          fetch(`https://api.kinotime.world/api/movies?name=${encodeURIComponent(query)}`),
          fetch(`https://api.kinotime.world/api/serials?name=${encodeURIComponent(query)}`)
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
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        console.error('Search fetch error:', err);
      }
    };

    fetchResults();
  }, [query]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    window.location.href = `/search?query=${encodeURIComponent(query)}&page=${pageNumber}`;
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

      if (currentPage > sideCount + 2) {
        pages.push('...');
      }

      const startPage = Math.max(2, currentPage - sideCount);
      const endPage = Math.min(totalPages - 1, currentPage + sideCount);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - sideCount - 1) {
        pages.push('...');
      }

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
    <div className="search-result-container">
      <YandexRtbAd/>
      <h2 className="search-title">
        Qidiruv natijalari: <span className='query-result'>“{query}”</span> so'zi bo'yicha
      </h2>

      {currentItems.length === 0 ? (
        <div className='no-result-box'><p className="no-results">
          <FaMeh size={70}/>Hech narsa topilmadi</p></div>
      ) : (
        <>
          <div className="movies-grid">
            {currentItems.map((item) => (
              <FilmCard
                key={item.id}
                id={item.id}
                title={item.name}
                poster={item.posterUrl}
                rating={item.rating}
                type={item.type}
              />
            ))}
          </div>

          {/* DYNAMIC Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {renderPageNumbers()}
            </div>
          )}
        </>
      )}
      <YandexFloorAd/>
      <YandexTopAds/>
    </div>
  );
};

export default SearchResultPage;
