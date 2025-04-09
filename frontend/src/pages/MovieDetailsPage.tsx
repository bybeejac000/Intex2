import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie } from "../types/Movie";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchMovieById } from "../api/MoviesAPI";
import AuthorizeView from "../components/AuthorizeView";

function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <>
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
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
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
            className="btn btn-primary"
            style={{ marginBottom: "20px" }}
            onClick={() => navigate("/movies")}
          >
            ← Back
          </button>
          <h2>Movie not found</h2>
          {error && <p className="text-danger">{error}</p>}
          <p>Movie ID attempted: {id}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AuthorizeView>
        <Header />
        <div
          className="movie-details-container"
          style={{
            backgroundColor: "#0a1929",
            backgroundImage:
              "linear-gradient(135deg, #000810 0%, #00294D 100%)",
            color: "white",
            padding: "150px 20px",
            minHeight: "100vh" /* Ensure it fills the viewport height */,
            height:
              "100vh" /* This ensures the container takes up the full height */,
            display:
              "flex" /* Flexbox layout to allow for vertical alignment */,
            flexDirection: "column" /* Align items vertically */,
          }}
        >
          <div className="container">
            <button
              className="btn btn-primary mb-4"
              onClick={() => navigate("/movies")}
            >
              ← Back
            </button>
            <div className="row">
              <div className="col-md-4">
                <div
                  className="movie-poster-large"
                  style={{
                    height: "400px",
                    backgroundColor: "#1a2e40",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                ></div>
              </div>
              <div className="col-md-8">
                <h1 className="display-4 text-center">{movie.title}</h1>
                <br />
                <br />
                <div className="movie-meta d-flex justify-content-center gap-3 mb-3">
                  <span className="badge bg-secondary">
                    {movie.release_year}
                  </span>
                  <span className="badge bg-secondary">{movie.duration}</span>
                  <span className="badge bg-secondary">{movie.type}</span>
                  <span className="badge bg-warning text-dark">
                    ★ {movie.rating}
                  </span>
                  <span className="badge bg-info text-dark">
                    ⭐ {movie.averageRating}
                  </span>{" "}
                  {/* Average Rating */}
                  <span className="badge bg-info text-dark">
                    {movie.numRatings} ratings
                  </span>{" "}
                  {/* Number of Ratings */}
                </div>
                <br />
                <div className="movie-director mb-2">
                  <strong>Director:</strong> {movie.director}
                </div>
                <div className="movie-cast mb-2">
                  <strong>Cast:</strong> {movie.cast}
                </div>
                <div className="movie-description mb-2">
                  <strong className="lead">{movie.description}</strong>
                </div>
                <div className="movie-country mb-2">
                  <strong>Country:</strong> {movie.country}
                </div>
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
