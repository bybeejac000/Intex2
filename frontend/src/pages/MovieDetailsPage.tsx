import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie } from '../types/Movie';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = "https://localhost:5000/CineNiche";

function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/GetMovie/${id}`);
                if (!response.ok) {
                    throw new Error('Movie not found');
                }
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return (
            <>
            <Header />
            <div className="loading-spinner">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
            <Header />
            <div className="error-container">
                <button className="back-button" onClick={() => navigate('/movies')}>
                    ← Back
                </button>
                <h2>{error}</h2>
            </div>
            <Footer />
            </>
        );
    }

    if (!movie) {
        return (
            <>
            <Header />
            <div className="error-container">
                <button className="back-button" onClick={() => navigate('/movies')}>
                    ← Back
                </button>
                <h2>Movie not found</h2>
            </div>
            <Footer />
            </>
        );
    }

    return (
        <>
        <Header />
        <div className="movie-details-container">
            <div className="movie-info">
                <button className="back-button" onClick={() => navigate('/movies')}>
                    ← Back
                </button>
                <h1>{movie.title}</h1>
                <div className="movie-meta">
                    <span>{movie.release_year}</span>
                    <span>{movie.duration}</span>
                    <span>{movie.type}</span>
                    <span>★ {movie.rating}</span>
                </div>
                <div className="movie-director">
                    <strong>Director:</strong> {movie.director}
                </div>
                <div className="movie-cast">
                    <strong>Cast:</strong> {movie.cast}
                </div>
                <div className="movie-description">
                    <p>{movie.description}</p>
                </div>
                <div className="movie-country">
                    <strong>Country:</strong> {movie.country}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default MovieDetailsPage;
