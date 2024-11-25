import React from 'react';
import './Boxes.css';

const Boxes = ({ title, description}) => {
  return (
    <div className="col-md-4">
      <div className="feature">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Boxes;
  
