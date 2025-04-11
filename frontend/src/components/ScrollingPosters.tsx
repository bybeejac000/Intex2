import React from 'react';
import './ScrollingPosters.css';

// Component props interface for ScrollingPosters
interface ScrollingPostersProps {
    images?: {
        src: string;
        alt: string;
    }[];
}

// Default movie posters that will be used if no images are provided
const defaultPosters = [
    { src: '/images/posters/dearJohn.jpeg', alt: "Dear John" },
    { src: '/images/posters/Twisters.png', alt: "Twisters" },
    { src: '/images/posters/harryPotter.jpeg', alt: "Harry Potter" },
    { src: '/images/posters/10hours.jpg', alt: "10 Hours" },
    { src: '/images/posters/ThePrincessandtheFrog.jpg', alt: "The Princess and the Frog" },
    { src: '/images/posters/50FirstDates.jpg', alt: "50 First Dates" },
    { src: '/images/posters/DickJohnsonIsDead.jpg', alt: "Dick Johnson Is Dead" },
    { src: '/images/posters/Fireworks.jpg', alt: "Fireworks" },
    { src: '/images/posters/Jaws.jpg', alt: "Jaws" },
    { src: '/images/posters/TheFatherWhoMovesMountains.jpg', alt: "The Father Who Moves Mountains" },
    { src: '/images/posters/Inception.jpg', alt: "Inception" },
    { src: '/images/posters/FlashofGenius.jpg', alt: "Flas of Genius" },
    // Add more default images here
];

/**
 * ScrollingPosters Component
 * Creates a vertically scrolling display of movie posters
 * CSS animations handle the continuous scrolling effect
 */
const ScrollingPosters: React.FC<ScrollingPostersProps> = ({ images = defaultPosters }) => {
    return (
        <div className="poster-container" style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="scrolling-posters">
                <div className="poster-column">
                    {/* First set of posters */}
                    {images.map((image, index) => (
                        <img key={index} src={image.src} alt={image.alt} />
                    ))}
                    {/* Duplicate posters for seamless infinite scrolling effect */}
                    {images.map((image, index) => (
                        <img key={`duplicate-${index}`} src={image.src} alt={image.alt} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollingPosters; 