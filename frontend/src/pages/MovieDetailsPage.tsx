import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Movie {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    director: string;
    rating: number;
    posterUrl: string;
    genre: string;
    duration: number;
}

function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`/api/movies/${id}`);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!movie) {
        return <div>Movie not found</div>;
    }

    return (
        <>
            <Header />
            <div className="movie-details-container">
                <div className="movie-poster">
                    <img src={movie.posterUrl} alt={movie.title} />
                </div>
                <div className="movie-info">
                    <h1>{movie.title}</h1>
                    <div className="movie-meta">
                        <span>{movie.releaseDate}</span>
                        <span>{movie.duration} min</span>
                        <span>{movie.genre}</span>
                        <span>★ {movie.rating}</span>
                    </div>
                    <div className="movie-director">
                        <strong>Director:</strong> {movie.director}
                    </div>
                    <div className="movie-description">
                        <p>{movie.description}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MovieDetailsPage;
