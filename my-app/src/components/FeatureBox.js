import React from 'react';
import './FeatureBox.css';

const FeatureBox = ({ title, description, imgSrc }) => {
  return (
    <div className="col-md-4">
      <div className="feature-box">
        <img src={imgSrc} alt="" />
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureBox;
  