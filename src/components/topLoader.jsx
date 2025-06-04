// src/components/TopLoader.jsx
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './style/toploader.css';

const TopLoader = ({ isLoading }) => {
  if (isLoading) {
    NProgress.start();
  } else {
    NProgress.done();
  }

  return null; // hech narsa return qilmaydi
};

export default TopLoader;
