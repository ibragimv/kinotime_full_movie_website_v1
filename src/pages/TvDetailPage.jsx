import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import TVCard from "../models/TvCard";
import "./style/tv.css";

const TVDetailPage = () => {
  const { id } = useParams(); // route orqali id keladi
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [channelDetails, setChannelDetails] = useState(null); // playerda ochiladigan kanal

  // Fetch all categories
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

  // Agar URL orqali id kelgan bo‘lsa, uni playerga o‘rnatamiz
  useEffect(() => {
    if (id) {
      setSelectedChannelId(id);
      fetch(`https://api.kinotime.world/api/tvchannels/${id}`)
        .then((res) => res.json())
        .then((data) => setChannelDetails(data))
        .catch((err) => console.error("Kanal topilmadi:", err));
    }
  }, [id]);

  // Kategoriya bo‘yicha hozirgi tanlangan
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return (
    <div className="tv-page">
      <h1 className="tv-page-title-text">Telekanallar</h1>

      {/* Player faqat selectedChannelId bo‘lsa ko‘rsatiladi */}
      {selectedChannelId && channelDetails && (
        <div className="tv-detail-wrapper">
          <div className="tv-header" style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
            <img
              src={channelDetails.logoUrl}
              alt={channelDetails.name}
              style={{ width: 80, height: 80, objectFit: "contain", marginRight: 15, borderRadius: 8 }}
            />
            <h2 style={{ margin: 0, fontWeight: "bold", fontSize: 24 }}>{channelDetails.name}</h2>
          </div>

          <div className="tv-player-wrapper" style={{ marginBottom: "20px" }}>
            <ReactPlayer
              url={channelDetails.streamUrl}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              light={channelDetails.logoUrl}
              config={{
                file: {
                  attributes: {
                    poster: channelDetails.logoUrl,
                    muted: true,
                    playsInline: true,
                  },
                  forceHLS: true,
                },
              }}
            />
          </div>
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
              setSelectedChannelId(null);
              setChannelDetails(null);
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
              onClick={() => {
                setSelectedChannelId(ch.tvChannel.id);
                fetch(`https://api.kinotime.world/api/tvchannels/${ch.tvChannel.id}`)
                  .then((res) => res.json())
                  .then((data) => setChannelDetails(data));
              }}
            />
          ))
        ) : (
          <p className="empty-text">Ushbu kategoriyada hech qanday kanal yo‘q.</p>
        )}
      </div>
    </div>
  );
};

export default TVDetailPage;
