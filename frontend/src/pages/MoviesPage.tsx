import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./MoviesPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";

function MoviesPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleRows, setVisibleRows] = useState(1);
  const navigate = useNavigate();

  return (
    <>
      <AuthorizeView>
        <Header />
        <div className="movies-container" style={{
            backgroundColor: '#0a1929',
            backgroundImage: 'linear-gradient(135deg, #000810 0%, #00294D 100%)',
            overflow: 'hidden',
            margin: 0,
            width: '100vw',
            height: '100vh',
            marginTop: '65px',
            paddingBottom: '75px'
        }}>

            
            {/* Sidebar Navigation */}
            <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
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
                />
              )}
            </div>

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

            <div
              className="expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-chevron-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              ) : (
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
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {/* My Recommendations Section */}
            <section className="movie-section">
              <h2>(nameHere)'s Top Recommendations</h2>
              <div className="movie-grid">
                {[...Array(visibleRows * 7)].map((_, i) => (
                  <div key={i} className="movie-card">
                    <div className="movie-poster"></div>
                    <p className="movie-title">Movie Title</p>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary see-more"
                onClick={() => setVisibleRows(visibleRows + 1)}
              >
                See more
              </button>
            </section>

            {/* Most Popular Section */}
            <section id="popular" className="movie-section">
              <h2>Most Popular</h2>
              <div className="movie-grid">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="movie-card">
                    <div className="movie-poster"></div>
                    <p className="movie-title">Movie Title</p>
                  </div>
                ))}
              </div>
            </section>

            {/* New Releases Section */}
            <section id="newReleases" className="movie-section">
              <h2>New Releases</h2>
              <div className="movie-grid">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="movie-card">
                    <div className="movie-poster"></div>
                    <p className="movie-title">Movie Title</p>
                  </div>
                ))}
              </div>
            </section>

            {/* All Movies Section */}
            <section id="allMovies" className="movie-section">
              <h2>All Movies</h2>
              <div className="movie-grid">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="movie-card">
                    <div className="movie-poster"></div>
                    <p className="movie-title">Movie Title</p>
                  </div>
                ))}
              </div>
            </section>

            {/* All TV Shows Section */}
            <section id="allTVShows" className="movie-section">
              <h2>All TV Shows</h2>
              <div className="movie-grid">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="movie-card">
                    <div className="movie-poster"></div>
                    <p className="movie-title">Movie Title</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </AuthorizeView>
    </>
  );
}

export default MoviesPage;
