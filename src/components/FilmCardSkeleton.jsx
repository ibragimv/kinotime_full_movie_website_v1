import React from 'react';
import './style/filmCardSkeleton.css';

const FilmCardSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster shimmer"></div>
        <div className="skeleton-text">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-subtitle shimmer"></div>
      </div>
    </div>
  );
};

export default FilmCardSkeleton;