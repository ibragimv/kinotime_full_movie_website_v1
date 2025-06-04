import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import './style/UniversalPlayer.css';
import {
  Fullscreen, Settings, Pause, Play, Volume2, VolumeX
} from 'lucide-react';

const UniversalPlayer = ({ videoUrl, posterUrl = '', name = '' }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);
  const hideTimeout = useRef(null);

  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState('0:00');
  const [hoverLeft, setHoverLeft] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [adPlaying, setAdPlaying] = useState(true);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return hrs > 0
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs}`
      : `${mins}:${secs}`;
  };

  const showControlsTemporarily = useCallback((force = false) => {
    setShowControls(true);
    clearTimeout(hideTimeout.current);
    if (isPlaying || force) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      showControlsTemporarily();
    } else {
      video.pause();
      setIsPlaying(false);
      showControlsTemporarily(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !muted;
    setMuted(newMuted);
    video.muted = newMuted;
    showControlsTemporarily(true);
  };

  const changeVolume = (e) => {
    const value = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    setVolume(value);
    setMuted(value === 0);
    video.volume = value;
    video.muted = value === 0;
    showControlsTemporarily();
  };

  const skip = (sec) => {
    const video = videoRef.current;
    if (!video || adPlaying) return;
    video.currentTime += sec;
    showControlsTemporarily();
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    const container = video?.parentElement;
    if (!video || !container) return;

    if (isIOS && video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (container.requestFullscreen) {
      container.requestFullscreen();
    }
    showControlsTemporarily();
  };

  const changeSpeed = (rate) => {
    const video = videoRef.current;
    if (!video || adPlaying) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
    showControlsTemporarily();
  };

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || adPlaying) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
    const percent = (video.currentTime / video.duration) * 100;
    if (progressRef.current) progressRef.current.style.width = `${percent}%`;
    if (dotRef.current) dotRef.current.style.left = `${percent}%`;
  }, [adPlaying]);

  const handleSeekByPosition = useCallback((clientX) => {
    if (adPlaying) return;
    const bar = progressRef.current?.parentElement;
    const video = videoRef.current;
    if (!bar || !video) return;
    const rect = bar.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percent = x / rect.width;
    video.currentTime = percent * video.duration;
    handleTimeUpdate();
  }, [adPlaying, handleTimeUpdate]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('progress-dot')) {
      setIsDragging(true);
      handleSeekByPosition(e.clientX);
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging && !adPlaying) {
      handleSeekByPosition(e.clientX);
    }
  }, [isDragging, adPlaying, handleSeekByPosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleTouchStart = (e) => {
    if (e.target.classList.contains('progress-dot')) {
      setIsDragging(true);
      handleSeekByPosition(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && !adPlaying) {
      handleSeekByPosition(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const percent = hoverX / rect.width;
    const time = percent * duration;
    setHoverTime(formatTime(time));
    setHoverLeft(hoverX);
  };

  const onAdFinished = () => {
    setCurrentVideoUrl(videoUrl);
    setAdPlaying(false);
  };

  const handleDoubleTap = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const half = bounds.width / 2;
    skip(x < half ? -10 : 10);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || adPlaying) return;

    const onWaiting = () => {
      if (!video.paused && !video.ended) setIsBuffering(true);
    };

    const onPlaying = () => setIsBuffering(false);
    const onPause = () => setIsBuffering(false);

    video.volume = volume;
    video.muted = muted;

    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
      handleTimeUpdate();
    });

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTimeUpdate, adPlaying, muted, volume]);

  useEffect(() => {
    if (!adPlaying) {
      setCurrentVideoUrl(videoUrl);
    }
  }, [adPlaying, videoUrl]);

  return (
    <div className="player-wrapper">
      <h2 className="player-title">{name}</h2>
      <div
        className="player-container"
        onDoubleClick={handleDoubleTap}
        onTouchEnd={(e) => {
          if (e.detail === 2) handleDoubleTap(e);
        }}
        onMouseMove={() => showControlsTemporarily()}
      >
        {adPlaying ? (
          <iframe
            src="https://s.magsrv.com/v1/vast.php?idzone=5619676"
            style={{ width: '100%', height: '100%', border: 'none' }}
            onLoad={() => setTimeout(onAdFinished, 5000)}
            allow="autoplay"
          />
        ) : (
          <video
            ref={videoRef}
            src={currentVideoUrl}
            poster={posterUrl}
            className="custom-video"
            controls={false}
            onClick={togglePlay}
            playsInline
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        )}
        {isBuffering && <div className="loading-spinner" />}
        {!isPlaying && !adPlaying && (
          <div className="center-play-icon" onClick={togglePlay}>
            <Play size={72} />
          </div>
        )}
        <div className={`player-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
          <div
            className="progress-bar"
            onClick={(e) => handleSeekByPosition(e.clientX)}
            onMouseMove={handleHover}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="progress-filled" ref={progressRef}></div>
            <div
              className="progress-dot"
              ref={dotRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            ></div>
            {hovering && (
              <div className="preview-bubble" style={{ left: hoverLeft }}>
                {hoverTime}
              </div>
            )}
          </div>
          <div className="control-row">
            <div className="left-controls">
              <button onClick={togglePlay}>
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <span className="time">{formatTime(currentTime)} - {formatTime(duration)}</span>
              <div className="volume-control">
                <button onClick={toggleMute}>
                  {muted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={changeVolume}
                />
              </div>
            </div>
            <div className="right-controls">
              <div className="settings-wrapper">
                <button onClick={() => setShowSettings(!showSettings)}>
                  <Settings size={22} />
                </button>
                {showSettings && (
                  <div className="settings-modal">
                    {[0.5, 1, 1.5, 2].map((rate) => (
                      <div
                        key={rate}
                        className={`rate-option ${playbackRate === rate ? 'active' : ''}`}
                        onClick={() => changeSpeed(rate)}
                      >
                        {rate}x
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={toggleFullscreen}><Fullscreen size={22} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalPlayer;
