import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { BiGridAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import FilmCard from '../models/FilmCard';
import FilmCardSkeleton from './FilmCardSkeleton';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style/HomeCardSliderOne.css';

const HomeCardSliderSix = () => {
  const [serials, setSerials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSerials = async () => {
      try {
        const res = await fetch('https://api.kinotime.world/api/serials');
        const data = await res.json();

        if (Array.isArray(data)) {
          const shuffled = data
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

          setSerials(shuffled);
        }
      } catch (err) {
        console.error('Seriallarni olishda xatolik:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSerials();

    const interval = setInterval(fetchSerials, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow-right" onClick={onClick}>
      <ChevronRight size={22} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow-left" onClick={onClick}>
      <ChevronLeft size={22} />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 5.06,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.1,
          arrows: false,
        },
      },
    ],
  };

  const shouldShowSkeleton = loading || !serials.length;

  return (
    <div className="slider-container-1">
      <div className="slider-header">
        <h1 className="slider-title">
          <BiGridAlt size={28} />MASHXUR SERIALLAR
        </h1>
        <button className="see-all-button" onClick={() => navigate('/serials')}>
          BARCHASINI KO'RISH ➝
        </button>
      </div>

      <Slider {...settings}>
        {(shouldShowSkeleton ? [...Array(5)] : serials).map((serial, index) => (
          <div key={index} className='slider-card-wrapper'>
            {shouldShowSkeleton ? (
              <FilmCardSkeleton />
            ) : (
              <FilmCard title={serial.name} poster={serial.posterUrl} id={serial.id} type={'serial'}/>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeCardSliderSix;
