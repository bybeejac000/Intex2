import React from 'react';
import './ScrollingPosters.css';

interface ScrollingPostersProps {
    images?: {
        src: string;
        alt: string;
    }[];
}

const defaultPosters = [
    { src: '/images/posters/dearJohn.jpeg', alt: "Dear John" },
    { src: '/images/posters/Twisters.png', alt: "Twisters" },
    { src: '/images/posters/harryPotter.jpeg', alt: "Harry Potter" },
    
    { src: '/images/posters/10hours.jpg', alt: "10 Hours" },
    { src: '/images/posters/50FirstDates.jpg', alt: "50 first dates" },
    { src: '/images/posters/DickJohnsonIsDead.jpg', alt: "Dick Johnson Is Dead" },

    { src: '/images/posters/HowtoTrainYourDragon2.jpg', alt: "How To Train Your Dragon 2" },
    { src: '/images/posters/Inception.jpg', alt: "Inception" },
    { src: '/images/posters/Jaws.jpg', alt: "Jaws" },
    { src: '/images/posters/Suits.jpg', alt: "Suits" },
    { src: '/images/posters/TheFatherWhoMovesMountains.jpg', alt: "The Father Who Moves Mountains" },
    { src: '/images/posters/TheOutsiders.jpg', alt: "The Outsiders" },
    { src: '/images/posters/ThePrincessandtheFrog.jpg', alt: "The Princess and the Frog" },
    { src: '/images/posters/Twogether.jpg', alt: "Twogether" },
    { src: '/images/posters/Unbridled.jpg', alt: "Unbridled" },
    // Add more default images here
];

const ScrollingPosters: React.FC<ScrollingPostersProps> = ({ images = defaultPosters }) => {
    return (
        <div className="poster-container" style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="scrolling-posters">
                <div className="poster-column">
                    {images.map((image, index) => (
                        <img key={index} src={image.src} alt={image.alt} />
                    ))}
                    {/* Duplicate posters for seamless scrolling */}
                    {images.map((image, index) => (
                        <img key={`duplicate-${index}`} src={image.src} alt={image.alt} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollingPosters; 