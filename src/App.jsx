import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/sidebar';
import Navbar from './components/navbar';
import PremiereSlider from './components/premiereBanner';
import TelegramBanner from './components/TelegramBanner';
import HomeCardSliderOne from './components/HomeCardSliderOne';
import HomeCardSliderTwo from './components/HomeCardSliderTwo';
import HomeCardSliderThere from './components/HomeCardSliderThere';
import HomeCardSliderFour from './components/HomeCardSliderFour';
import HomeCardSliderSix from './components/HomeCardSliderSix';
import HomeCardSliderFive from './components/HomeCardSliderFive';
import HomeCardSliderSeven from './components/HomeCardSliderSeven';
import Footer from './components/footer';

import MoviesPage from './pages/MoviesPage';
import SerialsPage from './pages/SerialsPage';
import DevelopingPage from './pages/DevelopingPage';
import PremierePage from './pages/PremierePage';
import CatalogPage from './pages/CatalogGenresPage';
import CatalogMoviePage from './pages/KatalogMoviesPage'; // ✅ YANGI
import MovieDetailPage from './pages/MovieDetailPage';
import SerialDetailPage from './pages/SerialDetailPage';
import SearchResultPage from './pages/SearchResultPage';
import NotFoundPage from './pages/NotFoundPage';
import ContactPage from './pages/ContactPage';
import DmcaPage from './pages/DmcaPage';
import TVPage from './pages/tvPage';

import './App.css';
import YandexTopAds from './components/YandexTopAds';
import YandexRtbAd from './components/YandexAmpAd';
import YandexRtbFeedAd from './components/YandexRtbFeedAd';
import YandexFloorAd from './components/YandexFloorAd';
import TVDetailPage from './pages/TvDetailPage';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-wrapper">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="main-container">
        <main className="content">
          <Navbar toggleSidebar={toggleSidebar} />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <PremiereSlider />
                  <YandexRtbAd/>
                  <TelegramBanner />
                  <HomeCardSliderOne />
                  <HomeCardSliderSix />
                  <HomeCardSliderFive />
                  <HomeCardSliderSeven />
                  <HomeCardSliderTwo />
                  <HomeCardSliderThere />
                  <HomeCardSliderFour />
                  <YandexFloorAd/> 
                  <YandexTopAds/>
                </>
              }
            />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/serials" element={<SerialsPage />} />
            <Route path="/developing" element={<DevelopingPage />} />
            <Route path="/premiere" element={<PremierePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/movie" element={<CatalogMoviePage />} /> {/* ✅ YANGI QATOR */}
            <Route path="/movies/:id/:slug" element={<MovieDetailPage />} />
            <Route path="/serials/:id/:slug" element={<SerialDetailPage />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dmca" element={<DmcaPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/tv" element={<TVPage/>}/>
            <Route path="/tv/:id" element={<TVDetailPage/>}/>
          </Routes>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default App;
