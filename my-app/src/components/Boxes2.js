import React from 'react';
import './Boxes2.css';

const Boxes2 = ({ title, description}) => {
  return (
    <div className="col-md-4">
      <div className="feature-box">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Boxes2;
  