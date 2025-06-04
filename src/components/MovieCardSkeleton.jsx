// src/components/FilmCardSkeleton.jsx
import React from 'react';
import './style/SkeletonCard.css';

const FilmCardSkeleton = () => {
  return (
    <div className="film-skeleton-card">
      <div className="film-skeleton-image shimmer-effect"></div>
      <div className="film-skeleton-line title shimmer-effect"></div>
      <div className="film-skeleton-line subtitle shimmer-effect"></div>
    </div>
  );
};

export default FilmCardSkeleton;
