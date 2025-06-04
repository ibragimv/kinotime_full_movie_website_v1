import React from 'react';
import './style/Alert.css';

const Alert = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <span>{message}</span>
      <button className="alert-close" onClick={onClose}>✖</button>
    </div>
  );
}; 

export default Alert;
