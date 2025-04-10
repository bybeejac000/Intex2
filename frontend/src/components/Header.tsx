import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import ProfilePhoto from "../components/ProfilePhoto/ProfilePhoto";

function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePictureId, setProfilePictureId] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let timeoutId: number | undefined;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("https://cineniche.click/account/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          if (data && typeof data.profilePictureId === "number") {
            setProfilePictureId(data.profilePictureId);
          }
        } else if (response.status === 401) {
          // Unauthorized - user not logged in (no error needed)
          setIsLoggedIn(false);
        } else {
          console.warn(`Profile fetch returned status ${response.status}`);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.warn("Error fetching profile in header:", error);
        setIsLoggedIn(false);
      }
    };

    fetchProfileData();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = window.setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleTitleClick = () => {
    if (isLoggedIn) {
      navigate("/movies");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("https://cineniche.click/account/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        navigate("/");
      } else {
        console.warn("Logout failed.");
      }
    } catch (error) {
      console.warn("Error during logout:", error);
    }
  };

  return (
    <header
      className="fixed-top"
      style={{
        backgroundColor: "#010f1e",
        padding: "1rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        zIndex: 1000,
      }}
    >
      <div
        onClick={handleTitleClick}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginLeft: "-4px",
        }}
      >
        <img
          src="/images/CineNiche_Icon.png"
          alt="CineNiche Icon"
          style={{ height: "40px", marginRight: "8px" }}
        />
        <h1
          className="text-start text-light display-6 mb-0"
          style={{ fontSize: "1.75rem" }}
        >
          CineNiche
        </h1>
      </div>

      {isLoggedIn && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            right: "25px",
            top: "1rem",
            cursor: "pointer",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              transition: "transform 0.2s ease",
              transform: isDropdownOpen ? "scale(1.1)" : "scale(1)",
            }}
          >
            <ProfilePhoto pictureId={profilePictureId} size={40} />
          </div>

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "#0a1929",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "0.5rem 0",
                minWidth: "180px",
                zIndex: 1001,
                marginTop: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                animation: "fadeIn 0.2s ease",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem 1.25rem",
                  color: "white",
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                  gap: "10px",
                }}
                className="hover-effect"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Profile</span>
              </Link>
              <Link
                to="/admin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem 1.25rem",
                  color: "white",
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                  gap: "10px",
                }}
                className="hover-effect"
              >
                <FontAwesomeIcon icon={faCog} />
                <span>Admin</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem 1.25rem",
                  color: "white",
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                  gap: "10px",
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
                className="hover-effect"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}

      <style>
        {`
          .hover-effect:hover {
            background-color: rgba(255,255,255,0.1);
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </header>
  );
}

export default Header;
