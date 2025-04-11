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

  // LOAD IN FIRST NAME:
  const [firstName, setFirstName] = useState("");

  // Fetch profile data on mount.
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("https://cineniche.click/account/me", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setFirstName(data.firstName || "");
      //setLastName(data.lastName || '');
      //setEmail(data.email || '');
      //setTwoFactorEnabled(data.twoFactorEnabled || false);
      //setProfilePictureId(data.profilePictureId || 0);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };
  //trigger
  // Save functions

  // First name is loaded in now

  // Movie data state
  const [recommendationsData, setRecommendationsData] = useState<Movie[]>([]);
  const [popularData, setPopularData] = useState<Movie[]>([]);
  const [newReleasesData, setNewReleasesData] = useState<Movie[]>([]);
  const [allMoviesData, setAllMoviesData] = useState<Movie[]>([]);
  const [throwbackData, setThrowbackData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Category filtering
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Recommendations paging
  const [, setTotalRecommendations] = useState<string[]>([]);
  const [, setHasMoreRecommendations] = useState(true);

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

  // Add activeCategory state to track selected category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Handle category selection
  const toggleCategory = (category: string) => {
    // Set the active category
    setActiveCategory(category);

    // Update selected categories state
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );

    // Fetch movies for this category
    selectCategory(category);

    // Close the category filter dropdown
    setShowCategoryFilter(false);

    // Scroll to the "Find a Title By Category" section
    const section = document.querySelector("#allMovies");
    if (section) section.scrollIntoView({ behavior: "smooth" });
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
  const fetchMoviesData = async () => {
    try {
      const encodedQuery = encodeURIComponent(
        "SELECT * FROM movies_titles WHERE release_year > 2020 ORDER BY release_year DESC LIMIT 30"
      );
      const response = await fetch(
        `https://api.cineniche.click/query?query=${encodedQuery}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log("Fetched new release data:", data);
      setNewReleasesData(data); // data should be an array of Movie objects
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Fetch data on component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ⏳ Wait for userId to appear in localStorage
        let userId = localStorage.getItem("userId");
        let retries = 10;
        while (!userId && retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 200)); // wait 200ms
          userId = localStorage.getItem("userId");
          retries--;
        }

        if (!userId) {
          console.error("userId not found in localStorage after waiting.");
          return;
        }

        // Fetch personalized recommendations from recommendation API (get 50 max)
        const recommendationsResponse = await fetch(
          `https://api.cineniche.click/recommend_user?user_id=${localStorage.getItem(
            "userId"
          )}&num=30`
        );
        const recommendationsData = await recommendationsResponse.json();
        const recommendedShowIds = recommendationsData.results;

        // Store all recommendation IDs for later paging
        setTotalRecommendations(recommendedShowIds);

        // Now fetch details for all 30 recommendations (or less if there are fewer)
        const initialShowIds = recommendedShowIds.slice(0, 30);

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
        setRecommendationsData(recommendedMovies);

        // Filter for throwback titles (movies before 2000)
        const throwbackMovies = recommendedMovies.filter(
          (movie) => movie.release_year < 2000
        );
        setThrowbackData(throwbackMovies);

        setHasMoreRecommendations(false); // No need for load more functionality

        // Fetch popular movies with high ratings (using popular=true parameter)
        const popularResponse = await fetch(
          `https://cineniche.click/CineNiche/GetMovies?sortOrder=averagerating_desc&pageSize=30&pageNum=1`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const popularData = await popularResponse.json();
        // Sort the popular movies alphabetically by title
        const sortedPopularMovies = [...popularData.movies].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setPopularData(sortedPopularMovies);

        // Fetch new releases (sort by release year) (30 at once)
        const newReleasesResponse = await fetchMovies(
          30,
          1,
          [],
          "release_year_desc"
        );
        setNewReleasesData(newReleasesResponse.movies);

        // Fetch all movies (50 at once)
        const allMoviesResponse = await fetchMovies(30, 1, [], null);
        setAllMoviesData(allMoviesResponse.movies);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoviesData();
    loadData();
  }, []);

  // Function to load more movies for a category

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
      .replace(/[\(\):\'\.\-&\!\Ñ\ñ/%]/g, "") // Remove parentheses, colons, and dashes
      .replace(/^#+/, "");

    const imageUrl = `https://api.cineniche.click/posters/${encodeURIComponent(title)}.jpg`; // Use encodeURIComponent instead of Uri.EscapeDataString

    const [imageError, setImageError] = useState(false);

    return (
      <div className="movie-poster" onClick={() => handleClick(movie.show_id)}>
        {!imageError ? (
          <img
            src={imageUrl}
            alt={movie.title}
            className="poster-image"
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
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
              fontSize: "14px",
            }}
          >
            Title Image Coming Soon
            <p
              style={{
                fontSize: "11px",
                textAlign: "center",
                color: "#aaa",
                marginTop: "5px",
              }}
            >
              Click for more details
            </p>
          </div>
        )}
      </div>
    );
  };

  // Function to load more recommendations

  // Function to select specific category and load its movies
  const selectCategory = async (category: string) => {
    setLoading(true);
    setActiveCategory(category);
    try {
      // Fetch 30 movies for the selected category
      const response = await fetchMovies(30, 1, [category], null);
      setAllMoviesData(response.movies);
    } catch (error) {
      console.error("Error loading category movies:", error);
    } finally {
      setLoading(false);

      // Ensure we stay at the allMovies section after category selection
      setTimeout(() => {
        const section = document.querySelector("#allMovies");
        if (section) {
          section.scrollIntoView({ behavior: "auto" });

          // Save current scroll position
          const currentPos = window.scrollY;

          // Prevent any automatic scrolling for a short period
          const preventScroll = (e: Event) => {
            window.scrollTo(0, currentPos);
            e.preventDefault();
          };

          window.addEventListener("scroll", preventScroll, { passive: false });

          // Remove the scroll prevention after a short delay
          setTimeout(() => {
            window.removeEventListener("scroll", preventScroll);
          }, 100);
        }
      }, 30);
    }
  };

  // Reset to all movies (clear category filter)
  const resetCategoryFilter = async () => {
    setLoading(true);
    setActiveCategory(null);
    setSelectedCategories([]);
    try {
      // Fetch 30 movies
      const response = await fetchMovies(30, 1, [], null);
      setAllMoviesData(response.movies);
    } catch (error) {
      console.error("Error resetting category filter:", error);
    } finally {
      setLoading(false);

      // Ensure we stay at the allMovies section after resetting
      setTimeout(() => {
        const section = document.querySelector("#allMovies");
        if (section) {
          section.scrollIntoView({ behavior: "auto" });

          // Save current scroll position
          const currentPos = window.scrollY;

          // Prevent any automatic scrolling for a short period
          const preventScroll = (e: Event) => {
            window.scrollTo(0, currentPos);
            e.preventDefault();
          };

          window.addEventListener("scroll", preventScroll, { passive: false });

          // Remove the scroll prevention after a short delay
          setTimeout(() => {
            window.removeEventListener("scroll", preventScroll);
          }, 100);
        }
      }, 30);
    }
  };

  // Example fetch call

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
                <i
                  className="bi bi-search"
                  style={{ fontSize: "1.2rem", marginLeft: "8px" }}
                ></i>
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
                {isExpanded && <span>Filter by Genre</span>}
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
                <p style={{ color: 'white', marginTop: '10px' }}>Gathering Your Title Library with Personalized Recommendations!</p>
              </div>
            ) : (
              <>
                {/* CSS for horizontal scrolling movie rows */}
                <style>
                  {`
                    .movie-grid {
                      display: flex;
                      overflow-x: auto;
                      scroll-behavior: smooth;
                      padding: 10px 0;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                      gap: 20px;
                      padding-bottom: 20px;
                    }
                    
                    .movie-grid::-webkit-scrollbar {
                      display: none;
                    }
                    
                    .movie-card {
                      flex: 0 0 auto;
                      width: 200px;
                      margin-right: 5px;
                    }
                    
                    @media (max-width: 768px) {
                      .movie-card {
                        width: 140px;
                      }
                    }
                  `}
                </style>

                {/* My Recommendations Section */}
                <section id="recommendations" className="movie-section">
                  <h2 style={{ textAlign: "left" }}>
                    {firstName}'s Top Recommendations
                  </h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {recommendationsData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Most Popular Section */}
                <section id="popular" className="movie-section">
                  <h2 style={{ textAlign: "left" }}>
                    Top Rated Titles on CineNiche Today
                  </h2>
                  <p style={{ textAlign: "left", fontSize: "0.9rem", color: "#aaa", marginTop: "-5px", marginBottom: "10px" }}>
                    5 ★ ratings
                  </p>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {popularData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* New Releases Section */}
                <section id="newReleases" className="movie-section">
                  <h2 style={{ textAlign: "left" }}>New Releases</h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {newReleasesData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Throwback Recommendations Section */}
                <section
                  id="throwbackRecommendations"
                  className="movie-section"
                >
                  <h2 style={{ textAlign: "left" }}>
                    Your Top Throwback Titles
                  </h2>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {throwbackData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* All Movies Section */}
                <section id="allMovies" className="movie-section">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <h2 style={{ textAlign: "left", marginBottom: "5px" }}>
                      {activeCategory
                        ? categories
                            .find((c) => c === activeCategory)
                            ?.replace(/_/g, " ")
                        : "Find a Title By Genre:"}
                    </h2>
                    <div
                      className="category-selector"
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "0",
                        marginBottom: "15px",
                      }}
                    >
                      {activeCategory && (
                        <button
                          className="category-button"
                          onClick={resetCategoryFilter}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "15px",
                            background: "rgba(25, 118, 210, 0.2)",
                            color: "#1976d2",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Show All
                        </button>
                      )}
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={`category-button ${
                            activeCategory === category ? "active" : ""
                          }`}
                          onClick={() => toggleCategory(category)}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "15px",
                            background:
                              activeCategory === category
                                ? "#1976d2"
                                : "rgba(25, 118, 210, 0.2)",
                            color:
                              activeCategory === category ? "white" : "#1976d2",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {category.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="movie-row-container">
                    <div className="movie-grid">
                      {allMoviesData.map((movie) => (
                        <div key={movie.show_id} className="movie-card">
                          <MoviePoster movie={movie} />
                          <p className="movie-title">{movie.title}</p>
                        </div>
                      ))}
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
