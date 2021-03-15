import React from 'react';
import { deployedURL } from '../../../helpers/variables';

interface CardProps {
  title: string;
  subtitle: string;
  link: string;
  image: string;
}
const Card = ({ title, subtitle, link, image }: CardProps) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <div className="card">
      <div className="card__img-container">
        <img src={image} alt="restaurant hero"></img>
      </div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <img className="card__arrow" src={`${deployedURL}/img/arrow.png`} alt="arrow" />
    </div>
  </a>
)

export default Card;