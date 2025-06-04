import React, { useEffect, useState } from 'react';
import FilmCard from '../models/FilmCard';
import './style/GenreBasedGrid.css'

const RelatedMovies = ({ genreIds, currentMovieId }) => {
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch('https://api.kinotime.world/api/movies');
      const data = await res.json();

      
      const filtered = data.filter(movie =>
        movie.id !== currentMovieId &&
        movie.genres.some(g => genreIds.includes(g.genreId))
      );

     
      const uniqueMap = new Map();
      for (const movie of filtered) {
        uniqueMap.set(movie.id, movie);
      }
      const uniqueMovies = Array.from(uniqueMap.values());

      
      const shuffled = uniqueMovies.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);

      setRelatedMovies(selected);
    };

    fetchMovies();
  }, [genreIds, currentMovieId]);

  if (relatedMovies.length === 0) return null;

  return (
    <div className="movie-description-box" style={{marginTop:'-10px'}}>
      <h3 className="title-txt" style={{ fontSize: '27px' }}>O'xshash Kino va Seriallar</h3>
      <div className="movie-grid">
        {relatedMovies.map(movie => (
          <FilmCard
            key={movie.id}
            id={movie.id}
            title={movie.name}
            poster={movie.posterUrl}
            rating={movie.rating}
            type="movie"
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedMovies;
