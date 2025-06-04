import React, { useEffect, useState } from "react";
import TVCard from "../models/TvCard";
import TVDetailPage from "./TvDetailPage";
import "./style/tv.css";

const TVPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null); // player uchun

  useEffect(() => {
    fetch("https://api.kinotime.world/api/tvcategories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      });
  }, []);

  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="tv-page">
        <h1 className="tv-page-title-text">Telekanallar</h1>
      {/* Agar kanal tanlangan bo‘lsa, player chiqadi */}
      {selectedChannelId && (
        <div className="tv-detail-wrapper">
          <TVDetailPage id={selectedChannelId} />
        </div>
      )}

      {/* Kategoriya tugmalari */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-button ${
              selectedCategoryId === cat.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setSelectedChannelId(null); // playerni tozalash
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Kanallar ro'yxati */}
      <div className="tv-grid">
        {selectedCategory?.channels?.length > 0 ? (
          selectedCategory.channels.map((ch) => (
            <TVCard
              key={ch.tvChannel.id}
              channel={ch.tvChannel}
              onClick={() => setSelectedChannelId(ch.tvChannel.id)} // player ochish
            />
          ))
        ) : (
          <p className="empty-text">Ushbu kategoriyada hech qanday kanal yo‘q.</p>
        )}
      </div>
    </div>
  );
};

export default TVPage;
