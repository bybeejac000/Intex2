import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./MoviesPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";
import { fetchMovies, fetchMovieById } from "../api/MoviesAPI";
import { Movie } from "../types/Movie";

function MoviesPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  //   const [recommendationsRows, setRecommendationsRows] = useState(1);
  const [popularRows, setPopularRows] = useState(1);
  const [newReleasesRows, setNewReleasesRows] = useState(1);
  const [allMoviesRows, setAllMoviesRows] = useState(1);
  const [allTVShowsRows, setAllTVShowsRows] = useState(1);

  // Movie data state
  const [recommendationsData, setRecommendationsData] = useState<Movie[]>([]);
  const [popularData, setPopularData] = useState<Movie[]>([]);
  const [newReleasesData, setNewReleasesData] = useState<Movie[]>([]);
  const [allMoviesData, setAllMoviesData] = useState<Movie[]>([]);
  const [allTVShowsData, setAllTVShowsData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Category filtering
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Recommendations paging
  const [totalRecommendations, setTotalRecommendations] = useState<string[]>(
    []
  );
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(7);
  const [hasMoreRecommendations, setHasMoreRecommendations] = useState(true);

  const navigate = useNavigate();

  // Available categories
  const categories = [
    "action",
    "adventure",
    "comedies",
    "documentaries",
    "dramas",
    "horror_movies",
    "family_movies",
    "thrillers",
  ];

  // Handle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  // Apply category filters and reload movies
  const applyFilters = async () => {
    setLoading(true);
    try {
      // Refetch all movies with selected categories
      const allMoviesResponse = await fetchMovies(
        7,
        1,
        selectedCategories,
        null
      );
      setAllMoviesData(allMoviesResponse.movies);

      // Update other sections with category filters
      const popularResponse = await fetchMovies(
        7,
        1,
        selectedCategories,
        "popular"
      );
      setPopularData(popularResponse.movies);

      const newReleasesResponse = await fetchMovies(
        7,
        1,
        selectedCategories,
        "release_year_desc"
      );
      setNewReleasesData(newReleasesResponse.movies);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
      setShowCategoryFilter(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get user name from localStorage
        const firstName = localStorage.getItem("userFirstName") || "";
        setUserName(firstName);

        // Fetch personalized recommendations from recommendation API (get 50 max)
        const recommendationsResponse = await fetch(
          `http://44.214.17.52:5000/recommend_user?user_id=${localStorage.getItem(
            "userId"
          )}&num=50`
        );
        const recommendationsData = await recommendationsResponse.json();
        const recommendedShowIds = recommendationsData.results;

        // Store all recommendation IDs for later paging
        setTotalRecommendations(recommendedShowIds);

        // Only fetch details for the first 7 recommendations initially
        const initialShowIds = recommendedShowIds.slice(0, 7);

        // Fetch full details for each recommended movie
        const recommendedMovies: Movie[] = [];
        for (const showId of initialShowIds) {
          try {
            const movieDetails = await fetchMovieById(showId);
            recommendedMovies.push(movieDetails);
          } catch (error) {
            console.error(`Error fetching details for movie ${showId}:`, error);
          }
        }
        console.log("Recommendations data:", recommendedMovies);
        setRecommendationsData(recommendedMovies);

        // Set if we have more recommendations to load
        setHasMoreRecommendations(recommendedShowIds.length > 7);

        // Fetch popular movies
        const popularResponse = await fetchMovies(7, 1, [], "popular");
        console.log("Popular data:", popularResponse.movies);
        setPopularData(popularResponse.movies);

        // Fetch new releases (sort by release year)
        const newReleasesResponse = await fetchMovies(
          7,
          1,
          [],
          "release_year_desc"
        );
        console.log("New releases data:", newReleasesResponse.movies);
        setNewReleasesData(newReleasesResponse.movies);

        // Fetch all movies
        const allMoviesResponse = await fetchMovies(7, 1, [], null);
        console.log("All movies data:", allMoviesResponse.movies);
        setAllMoviesData(allMoviesResponse.movies);

        // Fetch TV shows
        const tvShowsResponse = await fetchMovies(7, 1, ["tv_shows"], null);
        console.log("TV shows data:", tvShowsResponse.movies);
        setAllTVShowsData(tvShowsResponse.movies);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to load more movies for a category
  const loadMoreMovies = async (
    category: string,
    page: number,
    setter: React.Dispatch<React.SetStateAction<Movie[]>>,
    currentData: Movie[]
  ) => {
    try {
      let sortOrder = null;
      let categories: string[] = [];

      if (category === "recommendations") sortOrder = "rating_desc";
      if (category === "popular") sortOrder = "popular";
      if (category === "new_releases") sortOrder = "release_year_desc";
      if (category === "tv_shows") categories = ["tv_shows"];

      const response = await fetchMovies(7, page, categories, sortOrder);
      setter([...currentData, ...response.movies]);
    } catch (error) {
      console.error(`Error loading more ${category}:`, error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      handleSearch(e.target.value);
    } else if (e.target.value.length === 0) {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Search for movies
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetchMovies(10, 1, [], null, query);
      setSearchResults(response.movies);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleClick = (show_id: string) => {
    console.log("Clicked on movie with show_id:", show_id);
    console.log("Movie show_id type:", typeof show_id);
    console.log("Navigating to:", `/movie/${show_id}`);
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    navigate(`/movie/${show_id}`);
  };

  const MoviePoster = ({ movie }: { movie: Movie }) => {
    // Remove unwanted characters like (), :, and -
    const title = movie.title
        .replace(/[\(\):\'\.\-&]/g, '')  // Remove parentheses, colons, and dashes
        .replace(/^#+/, '');

    const imageUrl = `http://44.214.17.52/${encodeURIComponent(title)}.jpg`; // Use encodeURIComponent instead of Uri.EscapeDataString

    return (
      <div className="movie-poster" onClick={() => handleClick(movie.show_id)}>
        <img
          src={imageUrl}
          alt={movie.title}
          className="poster-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    );
  };

  // Function to load more recommendations
  const loadMoreRecommendations = async () => {
    if (!hasMoreRecommendations) return;

    try {
      // Calculate the next batch (next 7 or remaining if less than 7)
      const end = Math.min(
        recommendationsLoaded + 7,
        totalRecommendations.length
      );
      const nextBatch = totalRecommendations.slice(recommendationsLoaded, end);

      // Fetch details for each recommendation in the next batch
      const newRecommendations: Movie[] = [];
      for (const showId of nextBatch) {
        try {
          const movieDetails = await fetchMovieById(showId);
          newRecommendations.push(movieDetails);
        } catch (error) {
          console.error(`Error fetching details for movie ${showId}:`, error);
        }
      }

      // Add new recommendations to the existing data
      setRecommendationsData((current) => [...current, ...newRecommendations]);

      // Update how many we've loaded
      setRecommendationsLoaded(end);

      // Check if we have more to load
      setHasMoreRecommendations(end < totalRecommendations.length);
    } catch (error) {
      console.error("Error loading more recommendations:", error);
    }
  };

  return (
    <>
      <AuthorizeView>
        <Header />
        <div
          className="movies-container"
          style={{
            backgroundColor: "#0a1929",
            backgroundImage:
              "linear-gradient(135deg, #000810 0%, #00294D 100%)",
            overflow: "hidden",
            margin: 0,
            width: "100vw",
            height: "100vh",
            marginTop: "65px",
            paddingBottom: "75px",
          }}
        >
          {/* Sidebar Navigation */}
          <div
            className={`sidebar ${isExpanded ? "expanded" : ""}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => {
              if (!isSearching) {
                setIsExpanded(false);
              }
            }}
          >
            <div className="search-bar">
              {!isExpanded && (
                <i className="bi bi-search" style={{ fontSize: "1.2rem" }}></i>
              )}
              {isExpanded && (
                <input
                  type="text"
                  placeholder="Explore movies..."
                  className="form-control"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              )}
            </div>

            {/* Search Results */}
            {isExpanded && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((movie) => (
                  <div
                    key={movie.show_id}
                    className="search-result-item"
                    onClick={() => handleClick(movie.show_id)}
                  >
                    <div className="search-result-title">{movie.title}</div>
                    <div className="search-result-year">
                      {movie.release_year}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="nav-items">
              <div
                className="nav-item"
                onClick={() => {
                  const section = document.querySelector("#recommendations");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-star"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                </svg>
                {isExpanded && <span>Top Recommendations</span>}
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  const section = document.querySelector("#popular");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-fire"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z" />
                </svg>
                {isExpanded && <span>Most Popular Ratings</span>}
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  const section = document.querySelector("#newReleases");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-calendar-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                </svg>
                {isExpanded && <span>New Releases</span>}
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  const section = document.querySelector("#allMovies");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-film"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
                </svg>
                {isExpanded && <span>All Movies</span>}
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  const section = document.querySelector("#allTVShows");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-tv"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z" />
                </svg>
                {isExpanded && <span>TV Shows</span>}
              </div>

              {/* Category Filter Button */}
              <div
                className="nav-item"
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-filter"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                </svg>
                {isExpanded && <span>Filter by Category</span>}
              </div>

              {/* Category Filter Dropdown */}
              {isExpanded && showCategoryFilter && (
                <div className="category-filter">
                  <div className="category-list">
                    {categories.map((category) => (
                      <div key={category} className="category-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                          />
                          <span>{category.replace(/_/g, " ")}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="filter-actions">
                    <button className="apply-filter" onClick={applyFilters}>
                      Apply Filters
                    </button>
                    <button
                      className="clear-filter"
                      onClick={() => {
                        setSelectedCategories([]);
                        setShowCategoryFilter(false);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-nav-item">
              <div className="nav-item" onClick={() => navigate("/profile")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
                {isExpanded && <span>My Profile</span>}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {/* My Recommendations Section */}
                <section id="recommendations" className="movie-section">
                  <h2>{userName ? `${userName}'s` : "(nameHere)'s"} Top Recommendations</h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {recommendationsData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                    {hasMoreRecommendations && (
                      <div
                        className="movie-navigation-arrow"
                        onClick={loadMoreRecommendations}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-chevron-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </section>

                {/* Most Popular Section */}
                <section id="popular" className="movie-section">
                  <h2>Most Popular on CineNiche</h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {popularData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="movie-navigation-arrow"
                      onClick={() => {
                        setPopularRows(popularRows + 1);
                        loadMoreMovies(
                          "popular",
                          popularRows + 1,
                          setPopularData,
                          popularData
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                  </div>
                </section>

                {/* New Releases Section */}
                <section id="newReleases" className="movie-section">
                  <h2>New Releases</h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {newReleasesData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="movie-navigation-arrow"
                      onClick={() => {
                        setNewReleasesRows(newReleasesRows + 1);
                        loadMoreMovies(
                          "new_releases",
                          newReleasesRows + 1,
                          setNewReleasesData,
                          newReleasesData
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                  </div>
                </section>

                {/* All Movies Section */}
                <section id="allMovies" className="movie-section">
                  <h2>All Movies</h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {allMoviesData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="movie-navigation-arrow"
                      onClick={() => {
                        setAllMoviesRows(allMoviesRows + 1);
                        loadMoreMovies(
                          "all_movies",
                          allMoviesRows + 1,
                          setAllMoviesData,
                          allMoviesData
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                  </div>
                </section>

                {/* All TV Shows Section */}
                <section id="allTVShows" className="movie-section">
                  <h2>All TV Shows</h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {allTVShowsData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="movie-navigation-arrow"
                      onClick={() => {
                        setAllTVShowsRows(allTVShowsRows + 1);
                        loadMoreMovies(
                          "tv_shows",
                          allTVShowsRows + 1,
                          setAllTVShowsData,
                          allTVShowsData
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                      </svg>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
        <Footer />
      </AuthorizeView>
    </>
  );
}

export default MoviesPage;
