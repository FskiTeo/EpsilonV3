import React from 'react';
import '../css/background.scss'

const Background = () => {
  return (
    <div className="stars">
      {[...Array(50)].map((_, index) => (
        <div className="star" key={index}></div>
      ))}
    </div>
  );
};

export default Background;
