import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import './style/MovieDetailPage.css';
import './style/SerialDetailPage.css';
import { FaPlay, FaRegHeart, FaStar } from 'react-icons/fa';
import UniversalPlayer from '../models/UniversalPlayer';
import FilmCard from '../models/FilmCard';
import axios from 'axios';
import YandexFloorAd from '../components/YandexFloorAd';
import YandexRtbAd from '../components/YandexAmpAd';
import YandexTopAds from '../components/YandexTopAds';


const SerialDetailPage = () => {
  const { id, slug } = useParams();
  const [serial, setSerial] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [allSerials, setAllSerials] = useState([]);
  const [imdbRating, setImdbRating] = useState(null);
  const playerRef = useRef(null);
  const isLightMode = document.body.classList.contains('light-mode');

  useEffect(() => {
    const fetchSerial = async () => {
      const res = await fetch(`https://api.kinotime.world/api/serials/${id}`);
      const data = await res.json();
      setSerial(data);
      document.title = `${data.name} | KinoTime`;
      setSelectedEpisode(data.episodes?.[0]);
      if (data?.name) {
        const translated = await translateToEnglish(data.name);
        fetchImdbRating(translated);
      }
    };

    const fetchAllSerials = async () => {
      const res = await fetch(`https://api.kinotime.world/api/serials?take=30`);
      const data = await res.json();
      setAllSerials(data);
    };

    fetchSerial();
    fetchAllSerials();
  }, [id, slug]);

  const translateToEnglish = async (text) => {
    try {
      const res = await axios.post('https://google-translate113.p.rapidapi.com/api/v1/translator/text', {
        from: 'uz',
        to: 'en',
        text
      }, {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'ff402a9314msh4c093fcc8c31bf8p1deaf0jsnca606ad4b1c0',
          'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
        }
      });
      return res.data.trans || text;
    } catch (err) {
      console.error("Tarjimada xatolik:", err);
      return text;
    }
  };

  const fetchImdbRating = async (title) => {
    try {
      const response = await axios.get('https://imdb236.p.rapidapi.com/api/imdb/search/title', {
        params: { query: title },
        headers: {
          'X-RapidAPI-Key': 'f3e36514f4msh677721a5d46b72bp1ef694jsn121cd24d53a6',
          'X-RapidAPI-Host': 'imdb236.p.rapidapi.com'
        }
      });
      const movieResult = response.data.titles?.[0];
      setImdbRating(movieResult?.rating?.rating || '--');
    } catch (error) {
      console.error('IMDB reyting olishda xatolik:', error);
      setImdbRating('--');
    }
  };

  const scrollToPlayer = (e) => {
    e.preventDefault();
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleEpisodeChange = (selectedOption) => {
    const episode = serial.episodes.find((ep) => ep.id === selectedOption.value);
    setSelectedEpisode(episode);
  };

  if (!serial) return <div className="movie-loading">Yuklanmoqda...</div>;

  const episodeOptions = serial.episodes.map((ep) => ({ value: ep.id, label: ep.name }));

  return (
    <>
    <div className="movie-detail-wrapper">
    <YandexRtbAd/>
    <br />
      <div className="movie-poster-block">
        <img src={serial.posterUrl} alt={serial.name} className="poster-image" />
        <div className="episode-badge">{serial.year}</div>
        <div className="episode-badge" style={{ marginLeft: "55px", fontStyle: 'italic' }}>HD</div>
      </div>

      <div className="movie-info-block">
        <h1 className="movie-title">«{serial.name}» Serialini onlayn tomosha qilish</h1>
        <p className="movie-subtitle">kinotime | seriallar | onlayn ko'rish</p>

        <div className="buttons">
          <a href="#player" onClick={scrollToPlayer} className="watch-btn">
            ONLAYN KO'RISH <FaPlay size={16} />
          </a>
          <a target="_blank" className="watch-btn favorite-btn">SARALANGAN <FaRegHeart size={17} /></a>
        </div>

        <div className="movie-meta">
          <div><span>Yil:</span> {serial.year}</div>
          <div><span>Davlat:</span> {serial.country}</div>
          <div><span>Tarjimasi:</span> {serial.dubLanguage}</div>
          <div><span>Davomiyligi:</span> ...</div>
          <div>
            <span>Janr:</span>
            {serial.genres.map((g, i) => (
              <span key={i} className="genre-badge">Ommabop</span>
            ))}
          </div>
          <div className="rating-row">
            <div className="kp-rating">Reyting: <b>+{serial.rating}</b> <FaStar /></div>
            <div className="imdb-rating">IMDb: <b>{imdbRating}</b></div>
          </div>
        </div>
      </div>

      <div className="movie-description-box desc">
        <h3>Serial haqida:</h3>
        <p>{serial.description}</p>
      </div>

      <div ref={playerRef} id="player">
        {selectedEpisode && (
          <UniversalPlayer
            videoUrl={selectedEpisode.videoUrl}
            posterUrl={serial.posterUrl}
            name={`${serial.name} - ${selectedEpisode.name}`}
          />
        )}
      </div>

      {serial.episodes.length > 0 && (
        <div className="episode-dropdown-wrapper">
          <h5>Qismlardan birini tanlang</h5>
          <Select
            className="episode-select-blur"
            options={episodeOptions}
            defaultValue={episodeOptions[0]}
            onChange={handleEpisodeChange}
            styles={getEpisodeSelectStyles(isLightMode)}
          />
        </div>
      )}

      {allSerials.length > 0 && (
        <div className="movie-description-box">
          <h3 className="title-txt" style={{ fontSize: '27px' }}>O'xshash Film va Seriallar</h3>
          <div className="movie-grid">
            {allSerials.map((serial) => (
              <FilmCard
                key={serial.id}
                title={serial.name}
                poster={serial.posterUrl}
                id={serial.id}
                type={'serial'}
              />
            ))}
          </div>
        </div>
      )}
      <YandexFloorAd/>
      <YandexTopAds/>
    </div>
    </>
  );
};

// ✅ LIGHT / DARK MODE uchun Select styles
const getEpisodeSelectStyles = (isLightMode) => ({
  control: (base) => ({
    ...base,
    backgroundColor: isLightMode ? '#f0f0f0' : 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    border: isLightMode
      ? '1px solid rgba(0, 0, 0, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '4px',
    color: isLightMode ? '#000' : 'white',
  }),
  singleValue: (base) => ({
    ...base,
    color: isLightMode ? '#000' : 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: isLightMode
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(24, 24, 24, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    marginTop: '4px',
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? isLightMode
        ? 'rgba(0, 0, 0, 0.05)'
        : 'rgba(255, 255, 255, 0.08)'
      : 'transparent',
    color: isLightMode ? '#000' : 'white',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '6px',
  }),
});

export default SerialDetailPage;
