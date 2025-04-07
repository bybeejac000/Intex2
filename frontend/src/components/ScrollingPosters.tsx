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
    { src: '/images/posters/spiderman.jpeg', alt: "Spiderman" }
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