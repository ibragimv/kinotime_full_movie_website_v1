import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Card from '../models/FilmCard';
import axios from 'axios';
import './style/SerialsPage.css';
import YandexFloorAd from '../components/YandexFloorAd';
import YandexRtbAd from '../components/YandexAmpAd';
import YandexTopAds from '../components/YandexTopAds';

const SerialsPage = () => {
  const isLightMode = document.body.classList.contains('light-mode');
  const [serials, setSerials] = useState([]);
  const [filteredSerials, setFilteredSerials] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get('page')) || 1;
  const filterYear = urlParams.get('year');
  const filterCountry = urlParams.get('country');
  const serialsPerPage = 20;

  useEffect(() => {
    const fetchSerials = async () => {
      try {
        const res = await axios.get('https://api.kinotime.world/api/serials');
        const all = res.data;
        setSerials(all);

        const filtered = all.filter((serial) => {
          const matchYear = filterYear ? serial.year.toString() === filterYear : true;
          const matchCountry = filterCountry ? serial.country === filterCountry : true;
          return matchYear && matchCountry;
        });

        setFilteredSerials(filtered);

        if (filterYear) setSelectedYear({ value: filterYear, label: filterYear });
        if (filterCountry) setSelectedCountry({ value: filterCountry, label: filterCountry });
      } catch (err) {
        console.error('Seriallarni olishda xatolik:', err);
      }
    };

    fetchSerials();
  }, [filterYear, filterCountry]);

  const handleFilter = () => {
    const query = new URLSearchParams();
    if (selectedYear) query.set('year', selectedYear.value);
    if (selectedCountry) query.set('country', selectedCountry.value);
    query.set('page', 1);
    window.location.href = `?${query.toString()}`;
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNumber);
    window.location.href = `?${params.toString()}`;
  };

  const allYears = [...new Set(serials.map(s => s.year))].sort((a, b) => b - a);
  const allCountries = [...new Set(serials.map(s => s.country))];

  const yearOptions = allYears.map(year => ({ value: year.toString(), label: year.toString() }));
  const countryOptions = allCountries.map(c => ({ value: c, label: c }));

  const indexOfLast = currentPage * serialsPerPage;
  const indexOfFirst = indexOfLast - serialsPerPage;
  const currentSerials = filteredSerials.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSerials.length / serialsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="serials-container">
      <YandexRtbAd/>
      <div className="serials-header">
        <h1 className="serials-title">BARCHA SERIALLAR</h1>
        <div className="filters">
          <Select
            className="filter-select"
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
            placeholder="Yil"
            isClearable
            styles={getCustomStyles(isLightMode)}
            menuPortalTarget={document.body}
          />
          <Select
            className="filter-select"
            options="tanlov yo'q"
            value="tanlov yo'q"
            onChange="tanlov yo'q"
            placeholder="Janr"
            isClearable
            styles={getCustomStyles(isLightMode)}
            menuPortalTarget={document.body}
          />
          <Select
            className="filter-select"
            options="tanlov yo'q"
            value="tanlov yo'q"
            onChange="tanlov yo'q"
            placeholder="Yosh"
            isClearable
            styles={getCustomStyles(isLightMode)}
            menuPortalTarget={document.body}
          />
          <Select
            className="filter-select"
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Davlat"
            isClearable
            styles={getCustomStyles(isLightMode)}
            menuPortalTarget={document.body}
          />
          <button className="filter-button-1" onClick={handleFilter}>Filtrlash</button>
        </div>
      </div>

      <div className="serials-grid">
        {currentSerials.map((serial) => (
          <Card
            key={serial.id}
            title={serial.name}
            poster={serial.posterUrl}
            rating={serial.rating}
            id={serial.id}
            type={'serial'}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {renderPageNumbers()}
        </div>
      )}

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

export default SerialsPage;
