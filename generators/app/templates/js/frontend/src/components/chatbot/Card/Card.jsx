import React from 'react';
import { deployedURL } from '../../../helpers/variables';

const Card = ({ header, link, price, image, description }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <div className="card">
      <div className="img-container">
        <img src={image} alt="restaurant hero"></img>
      </div>
      <h3>{header}</h3>
      <p>{description}</p>
      <p className="price">{price}</p>
      <img className="card-arrow" src={`${deployedURL}/img/arrow.png`} alt="arrow" />
    </div>
  </a>
)

export default Card;