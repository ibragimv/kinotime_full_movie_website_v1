import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/TvCard.css";

const TVCard = ({ channel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tv/${channel.id}`);
  };

  return (
    <div className="tv-card" onClick={handleClick}>
      <img
        src={channel.logoUrl}
        alt={channel.name}
        className="tv-logo"
      />
      <h3 className="tv-title">{channel.name}</h3>
    </div>
  );
};

export default TVCard;
