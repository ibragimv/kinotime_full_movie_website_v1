import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style/premiereBanner.css";
import { FaPlay } from "react-icons/fa";
import FilmCardSkeleton from "./FilmCardSkeleton";

function PremiereSlider() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.kinotime.world/api/genres/1");
        const data = await res.json();
        if (Array.isArray(data.movies)) {
          setMovies(data.movies.map((m) => m.movie));
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Premyera olishda xatolik:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const slugify = (str) =>
    str.toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");

  const handleClick = (movie) => {
    const slug = slugify(movie.name) + ".html";
    window.location.href = `/movies/${movie.id}/${slug}`;
  };

  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow next" onClick={onClick}>
      <ChevronRight size={22} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow prev" onClick={onClick}>
      <ChevronLeft size={22} />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 2.03,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="slider-container">
      {loading || error ? (
        <Slider {...settings}>
          {[...Array(3)].map((_, index) => (
            <div className="premiere-card" key={index}>
              <FilmCardSkeleton />
            </div>
          ))}
        </Slider>
      ) : (
        <Slider {...settings}>
          {movies.map((movie, index) => (
            <div
              key={index}
              className="premiere-card"
              onClick={() => handleClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <div className="poster-wrapper">
                <img src={movie.posterUrl} alt={movie.name} className="poster" />
                <button className="watch-button">
                  KO'RISH <FaPlay size={15} style={{ marginBottom: 2 }} />
                </button>
                <div className="badge">PREMYERA</div>
              </div>
              <div className="info">
                <h3>{movie.name}</h3>
                <p>{movie.year} • PREMYERA • KINOTIME</p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

export default PremiereSlider;
