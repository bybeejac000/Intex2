/**
 * AdminMoviesPage - Administrator interface for movie database management
 * Provides functionality for viewing, sorting, filtering, adding, editing, and deleting movies
 * with pagination support and business analytics features
 */
import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import { deleteMovie, fetchMovies } from "../api/MoviesAPI";
import NewMovieForm from "../components/NewMovieForm";
import EditMovieForm from "../components/EditMovieForm";
import Pagination from "../components/Pagination";
import { Modal } from "bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";

const AdminMoviesPage = () => {
  // State management for movie data and UI controls
  const [movies, setMovies] = useState<Movie[]>([]); // Stores the current page of movies
  const [error, setError] = useState<string | null>(null); // Error message if API request fails
  const [loading, setLoading] = useState(true); // Loading indicator for API requests
  const [pageSize, setPageSize] = useState<number>(10); // Number of movies per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortOrder, setSortOrder] = useState<string | null>(null); // Current sort order
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Selected genre filters
  const [searchTerm, setSearchTerm] = useState<string>(""); // Current search input
  const [searchQuery, setSearchQuery] = useState<string>(""); // Submitted search query

  // Fetch movies when filter parameters change
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(
          pageSize,
          pageNum,
          selectedCategories,
          sortOrder,
          searchQuery
        );
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum, sortOrder, selectedCategories, searchQuery]);

  /**
   * Handles movie deletion with confirmation
   * @param show_id - The unique ID of the movie to delete
   */
  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(show_id);
      setMovies(movies.filter((m) => m.show_id !== show_id));
    } catch (error) {
      alert("Failed to delete movie. Please try again.");
    }
  };

  /**
   * Submits the search form and updates the search query
   * @param e - Form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNum(1); // Reset to first page when searching
    setSearchQuery(searchTerm); // Use the entered search term when submitting the form
  };

  // Display loading or error states
  if (loading) return <p>Loading Movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <AuthorizeView>
        <Header />
        {/* Main container with gradient background */}
        <div
          className="container-fluid min-vh-100"
          style={{
            backgroundColor: "#2d3748",
            paddingBottom: "100px",
            paddingTop: "75px",
            backgroundImage:
              "linear-gradient(135deg, #000810 00%, #00294D 70%)",
          }}
        >
          {/* Page title section */}
          <div className="d-flex justify-content-center align-items-center pt-5">
            <button
              className="btn btn-link text-light text-decoration-none me-3"
              onClick={() => window.history.back()}
              style={{ fontSize: "1.5rem" }}
            >
              ←
            </button>
            <h1 className="mb-0" style={{ color: "#FFFFFF" }}>
              Administrator Database
            </h1>
          </div>

          <div className="text-center">
            <h5 className="mt-3 mb-5" style={{ color: "#FFFFFF" }}>
              Collection of all titles available on CineNiche with their
              respective information and reviews.
            </h5>
          </div>
          
          {/* Add new movie button */}
          <button
            className="btn"
            data-bs-toggle="modal"
            data-bs-target="#addMovieModal"
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
            }}
          >
            Add a Title
          </button>

          {/* Space before table */}
          <br />
          <br />

          <div className="row">
            {/* Left Column - Filters and search options */}
            <div className="col-md-3">
              <div
                className="card shadow"
                style={{
                  backgroundColor: "#F0F2F5",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                }}
              >
                <div className="card-body">
                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search titles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        className="btn btn-primary"
                        type="submit"
                        style={{ backgroundColor: "#1976d2" }}
                      >
                        Search
                      </button>
                    </div>
                    {searchTerm && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary mt-2"
                        onClick={() => {
                          setSearchTerm("");
                          setSearchQuery("");
                          setPageNum(1);
                        }}
                      >
                        Clear Search
                      </button>
                    )}
                  </form>

                  {/* Sort options section */}
                  <h3
                    className="card-title h5 mb-3"
                    style={{ color: "#00294D" }}
                  >
                    Sort Options
                  </h3>
                  <div className="d-grid gap-2 mb-4">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder(null)}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Default Order
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder("asc")}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Sort A → Z
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder("desc")}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Sort Z → A
                    </button>
                    <br />
                    {/* Business analytics sorting options */}
                    <h3
                    className="card-title h5 mb-3"
                    style={{ color: "#00294D" }}
                  >
                    Business Analytics
                  </h3>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder("averagerating_asc")}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Sort By Avg Rating Asc
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder("averagerating_desc")}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Sort By Avg Rating Desc
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder("numratings_asc")}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Sort By Num Rating Asc
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setSortOrder("numratings_desc")}
                      style={{ borderColor: "#1976d2", color: "#1976d2" }}
                    >
                      Sort By Num Rating Desc
                    </button>
                  </div>

                  {/* Genre filter checkboxes */}
                  <h3
                    className="card-title h5 mb-3"
                    style={{ color: "#00294D", textAlign: 'center' }}
                  >
                    Filter by Categories
                  </h3>
                  {/* Action & Adventure filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="actionAdventureCheck"
                      checked={selectedCategories.includes("action") || selectedCategories.includes("adventure") || selectedCategories.includes("tv_action")}
                      onChange={() => {
                        const actionCategories = ["action", "adventure", "tv_action"];
                        const hasAllSelected = actionCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all action categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !actionCategories.includes(cat)));
                        } else {
                          // Add all action categories that aren't already selected
                          const catsToAdd = actionCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="actionAdventureCheck">
                      Action & Adventure
                    </label>
                  </div>
                  
                  {/* Comedy filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="comedyCheck"
                      checked={selectedCategories.includes("comedies") || selectedCategories.includes("comedies_romantic_movies") || 
                              selectedCategories.includes("tv_comedies") || selectedCategories.includes("talk_shows_tv_comedies") ||
                              selectedCategories.includes("comedies_international_movies") || selectedCategories.includes("comedies_dramas_international_movies")}
                      onChange={() => {
                        const comedyCategories = ["comedies", "comedies_romantic_movies", "tv_comedies", 
                                              "talk_shows_tv_comedies", "comedies_international_movies", 
                                              "comedies_dramas_international_movies"];
                        const hasAllSelected = comedyCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all comedy categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !comedyCategories.includes(cat)));
                        } else {
                          // Add all comedy categories that aren't already selected
                          const catsToAdd = comedyCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="comedyCheck">
                      Comedy
                    </label>
                  </div>

                  {/* Drama filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="dramaCheck"
                      checked={selectedCategories.includes("dramas") || selectedCategories.includes("dramas_romantic_movies") || 
                              selectedCategories.includes("tv_dramas") || selectedCategories.includes("dramas_international_movies") ||
                              selectedCategories.includes("comedies_dramas_international_movies") || 
                              selectedCategories.includes("international_tv_shows_romantic_tv_shows_tv_dramas")}
                      onChange={() => {
                        const dramaCategories = ["dramas", "dramas_romantic_movies", "tv_dramas", 
                                            "dramas_international_movies", "comedies_dramas_international_movies", 
                                            "international_tv_shows_romantic_tv_shows_tv_dramas"];
                        const hasAllSelected = dramaCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all drama categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !dramaCategories.includes(cat)));
                        } else {
                          // Add all drama categories that aren't already selected
                          const catsToAdd = dramaCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="dramaCheck">
                      Drama
                    </label>
                  </div>

                  {/* Documentary filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="documentaryCheck"
                      checked={selectedCategories.includes("documentaries") || selectedCategories.includes("documentaries_international_movies") || 
                              selectedCategories.includes("docuseries") || selectedCategories.includes("crime_tv_shows_docuseries") ||
                              selectedCategories.includes("british_tv_shows_docuseries_international_tv_shows")}
                      onChange={() => {
                        const docCategories = ["documentaries", "documentaries_international_movies", "docuseries", 
                                          "crime_tv_shows_docuseries", "british_tv_shows_docuseries_international_tv_shows"];
                        const hasAllSelected = docCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all documentary categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !docCategories.includes(cat)));
                        } else {
                          // Add all documentary categories that aren't already selected
                          const catsToAdd = docCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="documentaryCheck">
                      Documentaries
                    </label>
                  </div>

                  {/* Kids & Family filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="familyCheck"
                      checked={selectedCategories.includes("children") || selectedCategories.includes("family_movies") || 
                              selectedCategories.includes("kids_tv")}
                      onChange={() => {
                        const familyCategories = ["children", "family_movies", "kids_tv"];
                        const hasAllSelected = familyCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all family categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !familyCategories.includes(cat)));
                        } else {
                          // Add all family categories that aren't already selected
                          const catsToAdd = familyCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="familyCheck">
                      Kids & Family
                    </label>
                  </div>

                  {/* Thriller & Horror filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="thrillerCheck" 
                      checked={selectedCategories.includes("thrillers") || selectedCategories.includes("horror_movies") || 
                              selectedCategories.includes("international_movies_thrillers")}
                      onChange={() => {
                        const thrillerCategories = ["thrillers", "horror_movies", "international_movies_thrillers"];
                        const hasAllSelected = thrillerCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all thriller categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !thrillerCategories.includes(cat)));
                        } else {
                          // Add all thriller categories that aren't already selected
                          const catsToAdd = thrillerCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="thrillerCheck">
                      Thriller & Horror
                    </label>
                  </div>

                  {/* International filter */}
                  <div className="form-check mb-2" style={{ textAlign: 'left' }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="internationalCheck"
                      checked={selectedCategories.includes("international_movies_thrillers") || 
                              selectedCategories.includes("comedies_international_movies") || 
                              selectedCategories.includes("dramas_international_movies") || 
                              selectedCategories.includes("documentaries_international_movies") ||
                              selectedCategories.includes("anime_series_international_tv_shows") ||
                              selectedCategories.includes("british_tv_shows_docuseries_international_tv_shows") ||
                              selectedCategories.includes("international_tv_shows_romantic_tv_shows_tv_dramas") ||
                              selectedCategories.includes("language_tv_shows")}
                      onChange={() => {
                        const internationalCategories = ["international_movies_thrillers", 
                                                     "comedies_international_movies", 
                                                     "dramas_international_movies", 
                                                     "documentaries_international_movies",
                                                     "anime_series_international_tv_shows",
                                                     "british_tv_shows_docuseries_international_tv_shows",
                                                     "international_tv_shows_romantic_tv_shows_tv_dramas",
                                                     "language_tv_shows"];
                        const hasAllSelected = internationalCategories.every(cat => selectedCategories.includes(cat));
                        
                        if (hasAllSelected) {
                          // Remove all international categories
                          setSelectedCategories(prevCats => prevCats.filter(cat => !internationalCategories.includes(cat)));
                        } else {
                          // Add all international categories that aren't already selected
                          const catsToAdd = internationalCategories.filter(cat => !selectedCategories.includes(cat));
                          setSelectedCategories(prevCats => [...prevCats, ...catsToAdd]);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="internationalCheck">
                      International
                    </label>
                  </div>

                  {/* Page size selector */}
                  <div className="mt-4">
                  <h3
                    className="card-title h5 mb-3"
                    style={{ color: "#00294D", textAlign: 'center' }}
                  >
                    Results Per Page
                  </h3>
                    <select
                      className="form-select"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNum(1);
                      }}
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Movie list display with actions */}
            <div className="col-md-9">
              {movies.length === 0 ? (
                <div className="alert alert-info">
                  No movies found. Try adjusting your search or filters.
                </div>
              ) : (
                movies.map((m) => (
                  <div
                    key={m.show_id}
                    className="card mb-3 shadow"
                    style={{
                      backgroundColor: "#F0F2F5",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h5 className="card-title mb-1">{m.title}</h5>
                          <div className="text-muted small">
                            {m.release_year} • {m.duration}
                          </div>
                        </div>
                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                          <button
                            className="btn btn-outline-info btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target={`#infoModal${m.show_id}`}
                            style={{ borderColor: "#1976d2", color: "#1976d2" }}
                          >
                            All Information
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            data-bs-toggle="modal"
                            data-bs-target={`#editMovieModal${m.show_id}`}
                            style={{ borderColor: "#1976d2", color: "#1976d2" }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(m.show_id)}
                            style={{ borderColor: "#dc3545", color: "#dc3545" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Pagination controls */}
              <div className="mt-4">
                <Pagination
                  currentPage={pageNum}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageChange={setPageNum}
                  onPageSizeChange={setPageSize}
                />
              </div>
            </div>
          </div>

          {/* Modal for adding a new movie */}
          <div
            className="modal fade"
            id="addMovieModal"
            tabIndex={-1}
            aria-labelledby="addMovieModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div
                className="modal-content"
                style={{ backgroundColor: "#F0F2F5" }}
              >
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#F0F2F5" }}
                >
                  <h5
                    className="modal-title"
                    id="addMovieModalLabel"
                    style={{ color: "#00294D" }}
                  >
                    Add New Title
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <NewMovieForm
                    onSuccess={() => {
                      // Close modal and refresh movie list after successful add
                      const modalElement =
                        document.getElementById("addMovieModal");
                      if (modalElement) {
                        const modal = Modal.getInstance(modalElement);
                        modal?.hide();
                      }
                      fetchMovies(
                        pageSize,
                        pageNum,
                        selectedCategories,
                        sortOrder,
                        searchQuery
                      ).then((data) => setMovies(data.movies));
                    }}
                    onCancel={() => {
                      // Just close the modal on cancel
                      const modalElement =
                        document.getElementById("addMovieModal");
                      if (modalElement) {
                        const modal = Modal.getInstance(modalElement);
                        modal?.hide();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modals for displaying detailed movie information */}
          {movies.map((m) => (
            <div
              key={`modal-${m.show_id}`}
              className="modal fade"
              id={`infoModal${m.show_id}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div
                  className="modal-content"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div
                    className="modal-header"
                    style={{
                      backgroundColor: "#E8F0FE",
                      borderBottom: "1px solid #1976d2",
                    }}
                  >
                    <h5 className="modal-title" style={{ color: "#00294D" }}>
                      {m.title}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* Display all movie details */}
                    <p>
                      <strong>Show ID:</strong> {m.show_id}
                    </p>
                    <p>
                      <strong>Average Rating:</strong>{" "}
                      {m.averageRating ?? "N/A"}
                    </p>
                    <p>
                      <strong>Number of Ratings:</strong> {m.numRatings ?? 0}
                    </p>
                    <p>
                      <strong>Director:</strong> {m.director}
                    </p>
                    <p>
                      <strong>Cast:</strong> {m.cast}
                    </p>
                    <p>
                      <strong>Country:</strong> {m.country}
                    </p>
                    <p>
                      <strong>Release Year:</strong> {m.release_year}
                    </p>
                    <p>
                      <strong>Rating:</strong> {m.rating}
                    </p>
                    <p>
                      <strong>Duration:</strong> {m.duration}
                    </p>
                    <p>
                      <strong>Description:</strong> {m.description}
                    </p>
                    <div>
                      <strong>Genre{"(s)"}:</strong>
                      <ul className="list-unstyled mb-0">
                        {/* Dynamically list all genres (properties with value 1) */}
                        {Object.keys(m).map((key) => {
                          if (
                            key !== "show_id" &&
                            key !== "title" &&
                            key !== "director" &&
                            key !== "cast" &&
                            key !== "country" &&
                            key !== "release_year" &&
                            key !== "rating" &&
                            key !== "duration" &&
                            key !== "description" &&
                            key !== "averageRating" &&
                            key !== "numRatings"
                          ) {
                            return m[key as keyof Movie] === 1 ? (
                              <li
                                key={key}
                                className="badge bg-secondary me-1 mb-1"
                              >
                                {key}
                              </li>
                            ) : null;
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Modals for editing existing movies */}
          {movies.map((m) => (
            <div
              key={`edit-modal-${m.show_id}`}
              className="modal fade"
              id={`editMovieModal${m.show_id}`}
              tabIndex={-1}
              aria-labelledby={`editMovieModalLabel${m.show_id}`}
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div
                  className="modal-content"
                  style={{ backgroundColor: "#F0F2F5" }}
                >
                  <div
                    className="modal-header"
                    style={{ backgroundColor: "#F0F2F5" }}
                  >
                    <h5
                      className="modal-title"
                      id={`editMovieModalLabel${m.show_id}`}
                      style={{ color: "#00294D" }}
                    >
                      Edit Title
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <EditMovieForm
                      movie={m}
                      onSuccess={() => {
                        // Close modal and refresh movie list after successful edit
                        const modalElement = document.getElementById(
                          `editMovieModal${m.show_id}`
                        );
                        if (modalElement) {
                          const modal = Modal.getInstance(modalElement);
                          modal?.hide();
                        }
                        fetchMovies(
                          pageSize,
                          pageNum,
                          selectedCategories,
                          sortOrder,
                          searchQuery
                        ).then((data) => setMovies(data.movies));
                      }}
                      onCancel={() => {
                        // Just close the modal on cancel
                        const modalElement = document.getElementById(
                          `editMovieModal${m.show_id}`
                        );
                        if (modalElement) {
                          const modal = Modal.getInstance(modalElement);
                          modal?.hide();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </AuthorizeView>
    </>
  );
};

export default AdminMoviesPage;
