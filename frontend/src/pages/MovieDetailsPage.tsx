import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Movie } from "../types/Movie";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchMovieById, submitRating } from "../api/MoviesAPI";
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
  
  // Image error state
  const [mainImageError, setMainImageError] = useState(false);
  const [recImageErrors, setRecImageErrors] = useState<{[key: number]: boolean}>({});

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
        `https://api.cineniche.click/recommend?show_id=${id}&num=5`
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

  // Function to handle recommendation image errors
  const handleRecImageError = (index: number) => {
    setRecImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Star Rating Component
  const StarRating = () => {
    const stars = [1, 2, 3, 4, 5];
    
    const handleRatingSubmit = async () => {
      if (userRating === 0) return;
      
      // Show brief submitting state
      setSubmittingRating(true);
      
      try {
        // Get user ID from localStorage
        const userIdStr = localStorage.getItem('userId');
        
        if (!userIdStr) {
          console.error('Cannot submit rating: User is not logged in');
          setSubmittingRating(false);
          return;
        }
        
        const userId = parseInt(userIdStr);
        
        // Use the submitRating function from MoviesAPI
        await submitRating(userId, id || '', userRating);
        
        // Update local state to show the new rating
        if (movie) {
          const newNumRatings = (movie.numRatings || 0) + 1;
          const newAvgRating = (((movie.averageRating || 0) * (movie.numRatings || 0)) + userRating) / newNumRatings;
          
          setMovie({
            ...movie,
            numRatings: newNumRatings,
            averageRating: newAvgRating
          });
        }
        
        // Close popup
        setShowRatingPopup(false);
        
        // Reset states
        setSubmittingRating(false);
        setRatingSubmitted(true);
        
        // Show success message
        console.log("Rating submitted successfully!");
        
        // Reset rating after a delay
        setTimeout(() => {
          setRatingSubmitted(false);
        }, 2000);
      } catch (error) {
        console.error('Error submitting rating:', error);
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
    .replace(/[\(\):\'\.\-&?!Ññ%]/g, "")  // Remove parentheses, colons, and dashes
    .replace(/^#+/, "");
  const imageUrl = title
    ? `https://api.cineniche.click/posters/${encodeURIComponent(title)}.jpg`
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
                {!mainImageError ? (
                  <img
                    src={imageUrl}
                    alt={movie.title}
                    className="movie-poster-large"
                    onError={() => setMainImageError(true)}
                    style={{ 
                      maxWidth: "300px", 
                      height: "450px", 
                      maxHeight: "500px", 
                      borderRadius: "8px" 
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "300px",
                      height: "450px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                      backgroundColor: "#1a3b5c",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "10px",
                      color: "#fff",
                      fontSize: "18px",
                      margin: "0 auto"
                    }}
                  >
                    Title Image Coming Soon
                    <p style={{ fontSize: "11px", textAlign: "center", color: "#aaa", marginTop: "5px" }}>Click for more details</p>
                  </div>
                )}
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
                
                <div className="movie-genres mb-3">
                  <strong>Genres:</strong>{" "}
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {Object.entries(movie)
                      .filter(([key, value]) => 
                        value === 1 && 
                        key !== "show_id" &&
                        key !== "release_year" &&
                        !["type", "title", "director", "cast", "country", "rating", "duration", "description", "numRatings", "averageRating"].includes(key)
                      )
                      .map(([key]) => (
                        <span key={key} className="badge bg-secondary me-1 mb-1">
                          {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      ))}
                  </div>
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
                          {!recImageErrors[index] ? (
                            <img 
                              src={`https://api.cineniche.click/posters/${encodeURIComponent(rec.title.replace(/[\(\):\'\.\-&\!\Ñ\ñ/%]/g, '').replace(/^#+/, ''))}.jpg`}
                              alt={rec.title}
                              onError={() => handleRecImageError(index)}
                              style={{ 
                                width: "150px", 
                                height: "200px", 
                                objectFit: "cover",
                                borderRadius: "4px",
                                marginBottom: "8px"
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "150px",
                                height: "200px",
                                borderRadius: "4px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                                backgroundColor: "#1a3b5c",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "8px",
                                color: "#fff",
                                fontSize: "12px",
                                marginBottom: "8px"
                              }}
                            >
                              Title Image Coming Soon
                              <p style={{ fontSize: "9px", textAlign: "center", color: "#aaa", marginTop: "5px" }}>Click for more details</p>
                            </div>
                          )}
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
