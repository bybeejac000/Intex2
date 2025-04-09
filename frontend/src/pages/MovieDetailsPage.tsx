import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchMovieById } from '../api/MoviesAPI';
import AuthorizeView from '../components/AuthorizeView';

interface Recommendation {
    title: string;
    show_id: string;
}

function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    //const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // New state for recommendations
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                if (!id) {
                    throw new Error('No movie ID provided');
                }
                
                // Enhanced debugging
                console.log('Movie ID from URL:', id);
                console.log('URL path:', window.location.pathname);
                
                // Fetch movie data
                console.log('Attempting to fetch movie with API call...');
                const data = await fetchMovieById(id);
                console.log('API response data:', data);
                
                if (!data) {
                    throw new Error('Movie data is empty');
                }
                
                setMovie(data);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                // More detailed error information
                if (err instanceof Error) {
                    console.error('Error name:', err.name);
                    console.error('Error message:', err.message);
                    console.error('Error stack:', err.stack);
                }
                setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    // Function to fetch movie recommendations
    const fetchRecommendations = async () => {
        if (!id) return;
        
        setLoadingRecommendations(true);
        setShowRecommendations(true);
        
        try {
            // Fetch recommendations from the API
            const response = await fetch(`http://44.214.17.52:5000/recommend?show_id=${id}&num=5`);
            const data = await response.json();
            
            if (data && data.recommendations) {
                // Map the string titles to objects with title and show_id
                // This is simplistic - ideally we'd have complete movie data including IDs
                const recommendationObjects = data.recommendations.map((title: string, index: number) => ({
                    title,
                    show_id: `rec_${index}` // Placeholder IDs - in a real app, we'd have actual IDs
                }));
                
                setRecommendations(recommendationObjects);
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
        } finally {
            setLoadingRecommendations(false);
        }
    };

    // Function to handle clicking on a recommendation
    const handleRecommendationClick = (title: string) => {
        // In a real app, you would navigate to the actual movie page
        // This is a placeholder implementation
        alert(`You clicked on "${title}". In a complete app, this would navigate to that movie's page.`);
    };

    if (loading) {
        return (
            <>
            <Header />
            <div className="loading-spinner" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: 'calc(100vh - 150px)'
            }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <Footer />
            </>
        );
    }

    if (error || !movie) {
        return (
            <>
            <Header />
            <div className="error-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 150px)',
                textAlign: 'center',
                padding: '20px'
            }}>
                <button 
                    className="btn btn-link text-light text-decoration-none me-3" 
                    onClick={() => window.history.back()}
                    style={{ fontSize: '2.25rem' }}
                >
                    ←
                </button>
                <h2>Movie not found</h2>
                {error && <p className="text-danger">{error}</p>}
                <p>Movie ID attempted: {id}</p>
            </div>
            <Footer />
            </>
        );
    }

    // Create image URL using the same logic as on the MoviesPage
    const title = movie?.title.replace(/^#+/, '');
    const imageUrl = title ? `http://44.214.17.52/${encodeURIComponent(title)}.jpg` : '';

    return (
        <>
        <AuthorizeView>
            <Header />
                <div className="movie-details-container" 
                style={{
                    backgroundColor: '#0a1929',
                    backgroundImage: 'linear-gradient(135deg, #000810 0%, #00294D 100%)',
                    color: 'white',
                    padding: '80px 20px',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-8">
                            <div className="row">
                                <div className="col-md-4 d-flex justify-content-center mb-4 position-relative">
                                    <button 
                                        className="btn btn-link text-light text-decoration-none position-absolute" 
                                        onClick={() => window.history.back()}
                                        style={{ 
                                            fontSize: '3rem', 
                                            paddingRight: '100px', 
                                            marginRight: '100px',
                                            lineHeight: 2,
                                            top: 0,
                                            left: -80,
                                            zIndex: 10
                                        }}>
                                        ←
                                    </button>
                                    <img 
                                        src={imageUrl}
                                        alt={movie.title}
                                        className="movie-poster-large img-fluid"
                                        style={{
                                            maxWidth: '260px',
                                            height: '400px',
                                            maxHeight: '500px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                        }}
                                    />
                                </div>
                                <div className="col-md-8 text-center text-md-start ps-md-5">
                                    <div className="d-flex align-items-center mb-3">
                                        <h1 className="display-4 mb-0">{movie.title}</h1>
                                    </div>
                                    <div className="movie-meta d-flex flex-wrap justify-content-center justify-content-md-start gap-2 mb-4 mt-3">
                                        <span className="badge bg-secondary">{movie.release_year}</span>
                                        <span className="badge bg-secondary">{movie.duration}</span>
                                        <span className="badge bg-secondary">{movie.type}</span>
                                        <span className="badge bg-warning text-dark">★ {movie.rating}</span>
                                    </div>
                                    
                                    {/* Genres Section */}
                                    <div className="movie-genres mb-3">
                                        <strong>Genre:</strong>
                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                            {Object.keys(movie).map((key) => {
                                                if (
                                                    key !== "show_id" &&
                                                    key !== "type" &&
                                                    key !== "title" &&
                                                    key !== "director" &&
                                                    key !== "cast" &&
                                                    key !== "country" &&
                                                    key !== "release_year" &&
                                                    key !== "rating" &&
                                                    key !== "duration" &&
                                                    key !== "description" &&
                                                    movie[key as keyof Movie] === 1
                                                ) {
                                                    return (
                                                        <span key={key} className="badge bg-secondary">{key.replace(/_/g, ' ')}</span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="movie-director mb-3">
                                        <strong>Director:</strong> {movie.director}
                                    </div>
                                    <div className="movie-cast mb-3">
                                        <strong>Cast:</strong> {movie.cast}
                                    </div>
                                    <div className="movie-description mb-3">
                                        <strong>Description:</strong> {movie.description}
                                    </div>
                                    <div className="movie-country mb-3">
                                        <strong>Country:</strong> {movie.country}
                                    </div>
                                    
                                    {/* Recommendation Button */}
                                    <div className="mt-4">
                                        <button 
                                            className="btn btn-primary" 
                                            onClick={fetchRecommendations}
                                            disabled={loadingRecommendations}
                                        >
                                            {loadingRecommendations 
                                                ? <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading recommendations...</span>
                                                : "Want to watch more movies like this one?"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Recommendations Section */}
                            {showRecommendations && (
                                <div className="row mt-5">
                                    <div className="col-12">
                                    <h3 className="mb-4" style={{ fontWeight: 300 }}>Because you liked <strong>{movie.title}</strong>, you might also like:</h3>

                                        
                                        {loadingRecommendations ? (
                                            <div className="d-flex justify-content-center my-5">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading recommendations...</span>
                                                </div>
                                            </div>
                                        ) : recommendations.length > 0 ? (
                                            <div className="row g-4 justify-content-center">
                                                {recommendations.map((rec, index) => (
                                                    <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={index}>
                                                        <div 
                                                            className="recommendation-item d-flex flex-column align-items-center" 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleRecommendationClick(rec.title)}
                                                        >
                                                            <div className="poster-container" style={{

                                                                position: 'relative',
                                                                width: '100%',
                                                                paddingBottom: '150%', // 2:3 aspect ratio
                                                                overflow: 'hidden',
                                                                borderRadius: '8px',
                                                                marginBottom: '10px',
                                                                backgroundColor: '#1a2638',
                                                                opacity: 1 // Ensure no fading effect here
                                                            }}>
                                                                <img 
                                                                    src={`http://44.214.17.52/${encodeURIComponent(rec.title)}.jpg`}
                                                                    alt={rec.title}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                        opacity: 1 // Ensure no fading effect on the image itself
                                                                    }}
                                                                    onError={(e) => {
                                                                        // Fallback image if the movie image fails to load
                                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x225?text=No+Image';
                                                                    }}
                                                                />
                                                            </div>
                                                            <h6 className="movie-title text-center mb-0" style={{ 
                                                                fontSize: '0.9rem', 
                                                                fontWeight: 400,
                                                                width: '100%',
                                                                overflow: 'visible',
                                                                wordBreak: 'normal',
                                                                whiteSpace: 'normal',
                                                                textAlign: 'center',
                                                                lineHeight: '1.2',
                                                                minHeight: '2.4rem', // Enough space for 2 lines of text
                                                                maxWidth: '100%'
                                                            }}>
                                                                {rec.title}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No recommendations found.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </AuthorizeView>
        </>
    );
}

export default MovieDetailsPage;
