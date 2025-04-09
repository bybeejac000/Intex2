import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../types/Movie";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchMovieById } from "../api/MoviesAPI";
import AuthorizeView from "../components/AuthorizeView";

interface Recommendation {
  title: string;
  show_id: string;
}

function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Rating state
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (!id) {
          throw new Error("No movie ID provided");
        }

        // Enhanced debugging
        console.log("Movie ID from URL:", id);
        console.log("URL path:", window.location.pathname);

        // Fetch movie data
        console.log("Attempting to fetch movie with API call...");
        const data = await fetchMovieById(id);
        console.log("API response data:", data);

        if (!data) {
          throw new Error("Movie data is empty");
        }

        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        // More detailed error information
        if (err instanceof Error) {
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
        }
        setError(
          err instanceof Error ? err.message : "Failed to fetch movie details"
        );
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
      const response = await fetch(
        `http://44.214.17.52:5000/recommend?show_id=${id}&num=5`
      );
      const data = await response.json();

      if (data && data.recommendations) {
        // Map the string titles to objects with title and show_id
        // This is simplistic - ideally we'd have complete movie data including IDs
        const recommendationObjects = data.recommendations.map(
          (title: string, index: number) => ({
            title,
            show_id: `rec_${index}`, // Placeholder IDs - in a real app, we'd have actual IDs
          })
        );

        setRecommendations(recommendationObjects);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Function to handle clicking on a recommendation
  const handleRecommendationClick = (title: string) => {
    // In a real app, you would navigate to the actual movie page
    // This is a placeholder implementation
    alert(
      `You clicked on "${title}". In a complete app, this would navigate to that movie's page.`
    );
  };

  // Star Rating Component
  const StarRating = () => {
    const stars = [1, 2, 3, 4, 5];
    
    const handleRatingSubmit = async () => {
      if (userRating === 0) return;
      
      setSubmittingRating(true);
      try {
        // API call to submit rating
        const response = await fetch('http://44.214.17.52:5000/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            show_id: id,
            rating: userRating,
            // Add user info if available
            user_id: localStorage.getItem('userId') || 'anonymous',
          }),
        });
        
        if (response.ok) {
          setRatingSubmitted(true);
          // Update local rating display
          if (movie) {
            const newNumRatings = (movie.numRatings || 0) + 1;
            const newAvgRating = (((movie.averageRating || 0) * (movie.numRatings || 0)) + userRating) / newNumRatings;
            setMovie({
              ...movie,
              numRatings: newNumRatings,
              averageRating: newAvgRating
            });
          }
          
          // Hide rating component after delay
          setTimeout(() => {
            setShowRatingPopup(false);
            setRatingSubmitted(false);
          }, 2000);
        } else {
          throw new Error('Failed to submit rating');
        }
      } catch (err) {
        console.error('Error submitting rating:', err);
      } finally {
        setSubmittingRating(false);
      }
    };
    
    return (
      <div className="rating-component mt-3 mb-3 p-3">
        {ratingSubmitted ? (
          <div className="rating-success text-center">
            <h5>Thank you for your rating!</h5>
            <div className="stars-display">
              {stars.map(star => (
                <span key={star} style={{ color: star <= userRating ? '#FFD700' : '#ccc', fontSize: '1.8rem', padding: '0 5px' }}>★</span>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h5 className="mb-1 text-center">Rate "{movie?.title}"</h5>
            <div className="stars-container d-flex justify-content-center mb-3">
              {stars.map(star => (
                <span 
                  key={star}
                  style={{ 
                    cursor: 'pointer', 
                    color: star <= (hoverRating || userRating) ? '#FFD700' : '#ccc',
                    fontSize: '2rem',
                    padding: '0 5px'
                  }}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-center">
              <button 
                className="btn btn-secondary me-2"
                onClick={() => setShowRatingPopup(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleRatingSubmit}
                disabled={userRating === 0 || submittingRating}
                style={{ backgroundColor: '#1976d2' }}
              >
                {submittingRating ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <AuthorizeView>
          <Header />
          <div
            className="loading-spinner"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 150px)",
            }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <Footer />
        </AuthorizeView>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <AuthorizeView>
          <Header />
          <div
            className="error-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 150px)",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <button
              className="btn btn-link text-light text-decoration-none me-3"
              onClick={() => window.history.back()}
              style={{ fontSize: "2.25rem" }}
            >
              ←
            </button>
            <h2>Movie not found</h2>
            {error && <p className="text-danger">{error}</p>}
            <p>Movie ID attempted: {id}</p>
          </div>
          <Footer />
        </AuthorizeView>
      </>
    );
  }

  // Create image URL using the same logic as on the MoviesPage
  const title = movie?.title
    .replace(/[\(\):\'\.\-&]/g, '')  // Remove parentheses, colons, and dashes
    .replace(/^#+/, "");
  const imageUrl = title
    ? `http://44.214.17.52/${encodeURIComponent(title)}.jpg`
    : "";

  return (
    <>
      <AuthorizeView>
        <Header />
        <div
          className="movie-details-container"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #000810 0%, #00294D 100%)",
            color: "white",
            padding: "100px 20px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="container">
            <div className="row justify-content-start">
              <div className="col-md-3 text-center">
                <img
                  src={imageUrl}
                  alt={movie.title}
                  className="movie-poster-large"
                  style={{ 
                    maxWidth: "300px", 
                    height: "450px", 
                    maxHeight: "500px", 
                    borderRadius: "8px" 
                  }}
                />
                <div className="mt-3">
                  <button className="btn btn-primary w-100 mb-2">Play Now</button>
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => setShowRatingPopup(!showRatingPopup)}
                  >
                    Leave a Rating
                  </button>
                </div>
              </div>
              
              <div className="col-md-5 text-start">
                <button
                  className="btn btn-link text-light text-decoration-none"
                  onClick={() => window.history.back()}
                  style={{ 
                    fontSize: "3rem", 
                    marginBottom: "1rem",
                    position: "fixed",
                    left: "175px",
                    top: "125px",
                    zIndex: 1000
                  }}
                >
                  ←
                </button>
                <h1 className="display-4 mb-3">{movie.title}</h1>
                <div className="movie-meta d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-secondary">{movie.type}</span>
                  <span className="badge bg-secondary">{movie.release_year}</span>
                  <span className="badge bg-secondary">{movie.duration}</span>
                  <span className="badge bg-warning">{movie.rating}</span>
                  <span className="badge" style={{ backgroundColor: "#1976d2" }}>★ {movie.averageRating} from {movie.numRatings} ratings</span>
                </div>
                
                <p><strong>Description:</strong> {movie.description}</p>
                
                <div className="movie-director mb-3">
                  <strong>Director:</strong> {movie.director}
                </div>
                <div className="movie-cast mb-3">
                  <strong>Cast:</strong> {movie.cast}
                </div>
                
                {showRatingPopup && <StarRating />}
                
                <button
                  className="btn btn-primary mt-3"
                  onClick={fetchRecommendations}
                  disabled={loadingRecommendations}
                  style={{ display: showRecommendations ? 'none' : 'block', backgroundColor: "transparent", color: "#1976d2" }}
                >
                  {loadingRecommendations ? (
                    <span>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </span>
                  ) : (
                    "Want to find movies like this?"
                  )}
                </button>
              </div>
              
              <div className="col-md-4">
                {/* Empty column */}
              </div>
            </div>
            
            {showRecommendations && (
              <div className="row mt-5">
                <div className="col-12">
                  <h4 className="mb-3" style={{ fontWeight: "300" }}>Since you enjoyed <strong>{movie.title}</strong>, try watching...</h4>
                  {loadingRecommendations ? (
                    <div className="d-flex justify-content-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading recommendations...</span>
                      </div>
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="recommended-movies d-flex gap-3" style={{ 
                      overflowX: "auto",
                      paddingBottom: "15px",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#1976d2 transparent"
                    }}>
                      <style>
                        {`
                          .recommended-movies::-webkit-scrollbar {
                            height: 8px;
                          }
                          .recommended-movies::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          .recommended-movies::-webkit-scrollbar-thumb {
                            background-color: #1976d2;
                            border-radius: 20px;
                          }
                        `}
                      </style>
                      {recommendations.map((rec, index) => (
                        <div 
                          key={index} 
                          className="recommendation-item d-flex flex-column align-items-center mb-3"
                          style={{ cursor: "pointer", minWidth: "150px" }}
                          onClick={() => handleRecommendationClick(rec.title)}
                        >
                          <img 
                            src={`http://44.214.17.52/${encodeURIComponent(rec.title.replace(/[\(\):\'\.\-&]/g, '').replace(/^#+/, ''))}.jpg`}
                            alt={rec.title}
                            style={{ 
                              width: "150px", 
                              height: "200px", 
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginBottom: "8px"
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x150?text=No+Image";
                            }}
                          />
                          <h6 className="text-center mt-1" style={{ fontSize: "0.9rem", width: "100%" }}>{rec.title}</h6>
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
        
        <Footer />
      </AuthorizeView>
    </>
  );
}

export default MovieDetailsPage;
