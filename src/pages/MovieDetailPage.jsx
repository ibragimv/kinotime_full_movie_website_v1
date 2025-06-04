import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style/MovieDetailPage.css';
import { FaPlay, FaRegHeart, FaStar } from 'react-icons/fa';
import UniversalPlayer from '../models/UniversalPlayer';
import RelatedMovies from '../components/GenreBasedGrid';
import axios from 'axios';
import YandexFloorAd from '../components/YandexFloorAd';
import YandexRtbAd from '../components/YandexAmpAd';
import YandexTopAds from '../components/YandexTopAds';

const MovieDetailPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [imdbRating, setImdbRating] = useState(null);
  const playerRef = useRef(null);
  console.log(slug);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`https://api.kinotime.world/api/movies/${id}`);
      const data = await res.json();
      setMovie(data);
      document.title = `${data.name} | KinoTime`;

      if (data?.name) {
        const translated = await translateToEnglish(data.name);
        fetchImdbRating(translated);
      }
    };

    fetchMovie();
  }, [id]);

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
      // 1. TMDb orqali qidiruv
      const searchRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: '772abc561e423c7a799c7975f2952505',
          query: title
        }
      });

      const tmdbMovie = searchRes.data.results?.[0];
      if (!tmdbMovie) {
        setImdbRating('Topilmadi');
        return;
      }

      const tmdbId = tmdbMovie.id;

      // 2. IMDb ID olish
      const detailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
        params: {
          api_key: '772abc561e423c7a799c7975f2952505'
        }
      });

      const imdbId = detailsRes.data.imdb_id;
      if (!imdbId) {
        setImdbRating('IMDb ID yo‘q');
        return;
      }

      // 3. IMDb ratingni olish (RapidAPI)
      const imdbRes = await axios.get('https://imdb236.p.rapidapi.com/api/imdb/title', {
        params: { id: imdbId },
        headers: {
          'X-RapidAPI-Key': 'ff402a9314msh4c093fcc8c31bf8p1deaf0jsnca606ad4b1c0',
          'X-RapidAPI-Host': 'imdb236.p.rapidapi.com'
        }
      });

      const rating = imdbRes.data?.rating?.rating || 'Noma’lum';
      setImdbRating(rating);
    } catch (error) {
      console.error('IMDb reyting olishda xatolik:', error);
      setImdbRating('Noma’lum');
    }
  };

  if (!movie) return <div className="movie-loading">Yuklanmoqda...</div>;

  const handleGenreClick = (genreId) => {
    navigate(`/catalog/movie?genreId=${genreId}`);
  };

  const scrollToPlayer = (e) => {
    e.preventDefault();
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <div className="movie-detail-wrapper">
        <div className="movie-poster-block">
          <img src={movie.posterUrl} alt={movie.name} className="poster-image" />
          <div className="episode-badge">{movie.year}</div>
          <div className="episode-badge" style={{ marginLeft: "55px", fontStyle: 'italic' }}>HD</div>
        </div>

        <div className="movie-info-block">
          <h1 className="movie-title">«{movie.name}» Online tomosha qilish</h1>
          <p className="movie-subtitle">kinotime | kinolar va seriallar | onlayn ko'rish</p>

          <div className="buttons">
            <a
              href="#player"
              onClick={scrollToPlayer}
              className="watch-btn"
              style={{ cursor: 'pointer' }}
            >
              ONLAYN KO'RISH <FaPlay size={16} />
            </a>

            <a target="_blank" className="watch-btn favorite-btn">
              SARALANGAN <FaRegHeart size={17} />
            </a>
          </div>

          <div className="movie-meta">
            <div><span>Yil:</span> {movie.year}</div>
            <div><span>Davlat:</span> {movie.country}</div>
            <div><span>Yosh:</span> {movie.ageLimit}+</div>
            <div><span>Davomiyligi:</span> --</div>
            <div><span>Sifati:</span> HD 1080px</div>
            <div><span>Tarjimasi:</span> {movie.dubLanguage}</div>
            <div>
              <span>Janr:</span>
              {movie.genres.map((g, i) => (
                <span
                  key={i}
                  className="genre-badge"
                  onClick={() => handleGenreClick(g.genre.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {g.genre.name}
                </span>
              ))}
            </div>

            <div className="rating-row">
              <div className="kp-rating">Reyting: <b>+{movie.rating}</b> <FaStar /></div>
              <div className="imdb-rating">IMDb: <b>{imdbRating}</b></div>
            </div>
          </div>
        </div>

        <div className="movie-description-box">
          <h3>Nima haqida ekanini bilib oling:</h3>
          <p>{movie.description}</p>
        </div>

        <div ref={playerRef} id="player">
          <UniversalPlayer
            videoUrl={movie.videoUrl}
            posterUrl={movie.posterUrl}
            name={movie.name}
          />
          <YandexRtbAd />
        </div>

        <RelatedMovies
          genreIds={movie.genres.map(g => g.genreId)}
          currentMovieId={movie.id}
        />
        <YandexFloorAd />
        <YandexTopAds />
      </div>
    </>
  );
};

export default MovieDetailPage;
