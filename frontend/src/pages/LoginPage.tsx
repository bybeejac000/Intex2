import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";
import ScrollingPosters from "../components/ScrollingPosters";
import { useState, useEffect } from "react";
import CookieConsent from "../components/CookieConsent";

function LoginPage() {
  // State variables for email, password, and remember me checkbox
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "accepted") {
      setCookiesAccepted(true);
    } else if (cookieConsent === "declined") {
      setCookiesAccepted(false);
    }
  }, []);

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setRememberme(checked);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // Handle cookie consent accept
  const handleCookieAccept = () => {
    setCookiesAccepted(true);
  };

  // Handle cookie consent decline
  const handleCookieDecline = () => {
    setCookiesAccepted(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
  
    /* ───────── 1. build login URL (unchanged) ───────── */
    let loginUrl = "https://cineniche.click/login";
    if (cookiesAccepted === true) {
      loginUrl = rememberme
        ? "https://cineniche.click/login?useCookies=true"
        : "https://cineniche.click/login?useSessionCookies=true";
    } else {
      loginUrl = "https://cineniche.click/login?useSessionCookies=true";
    }
  
    try {
      localStorage.setItem("email", email);
  
      /* ───────── 2. POST /login  ───────── */
      const loginRes = await fetch(loginUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      /* ---- lock‑out & error handling (unchanged) ---- */
      if (!loginRes.ok) {
        if (loginRes.status === 401) {
          const data = await loginRes.json().catch(() => null);
          const msg =
            data?.detail === "LockedOut"
              ? "Your account is temporarily locked due to too many failed login attempts. Please try again in 5 minutes."
              : "Invalid email or password.";
          setError(msg);
          throw new Error(msg);
        }
        const data = await loginRes.json();
        const msg = data?.detail || "Invalid email or password.";
        setError(msg);
        throw new Error(msg);
      }
  
      /* ───────── 3. GET /account/me to check 2‑FA ───────── */
      const meRes = await fetch("https://cineniche.click/account/me", {
        credentials: "include"
      });
      if (!meRes.ok) throw new Error("Failed to fetch profile after login.");
      const me = await meRes.json();
      const twoFA = me.twoFactorEnabled === true;
  
      /* ───────── 4. branch on 2‑FA ───────── */
      if (twoFA) {
        // skip user‑id fetch; TwoFactorPage handles the next step
        navigate("/twofactor");
        return;
      }
  
      /* ───────── 5. no 2‑FA → grab user‑id then movies ───────── */
      await fetchAndStoreUserId();
      navigate("/movies");
    } catch (err: any) {
      const msg = err.message || "Error logging in.";
      if (msg.toLowerCase().includes("locked")) {
        setError(
          "Your account is temporarily locked due to too many failed login attempts. Please try again in 5 minutes."
        );
      } else {
        setError(msg);
      }
      console.error("Login flow failed:", err);
    }
  };
  

  const fetchAndStoreUserId = async (): Promise<void> => {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(
        `https://cineniche.click/CineNiche/getId?email=${email}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.length > 0) {
        const id = data[0].user_id;
        localStorage.setItem("userId", id);
        console.log("✅ User ID stored:", id);
      } else {
        console.warn("No user found for this email.");
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  return (
    <>
      <Header />
      <div
        className="container-fluid p-0 min-vh-100"
        style={{
          backgroundImage: "linear-gradient(135deg, #000810 0%, #00294D 100%)",
          overflow: "hidden",
          margin: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <div className="row g-0 h-100">
          {/* Left side - 1/3 of the screen */}
          <div className="col-md-4">
            <ScrollingPosters />
          </div>

          {/* Right side - 2/3 of the screen */}
          <div
            className="col-md-8 d-flex flex-column justify-content-center align-items-center text-light"
            style={{ height: "100vh" }}
          >
            <div className="text-center mb-5">
              <div className="text-center mb-5 d-flex align-items-center justify-content-center">
                <button
                  className="btn btn-link text-light text-decoration-none me-3"
                  onClick={() => window.history.back()}
                  style={{ fontSize: "2.25rem" }}
                >
                  ←
                </button>
                <h1 className="display-1 fw-light mb-0">Log In</h1>
              </div>
              <form
                className="d-flex flex-column gap-3"
                style={{ maxWidth: "300px", margin: "0 auto" }}
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Username"
                  className="form-control form-control-lg"
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="form-control form-control-lg"
                />
                <div
                  className="form-check mb-3"
                  style={{ textAlign: "left", width: "100%" }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="rememberme"
                    name="rememberme"
                    checked={rememberme}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="rememberme"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Remember password
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-lg"
                  style={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    opacity: cookiesAccepted === null ? "0.6" : "1"
                  }}
                  disabled={cookiesAccepted === null}
                >
                  Login
                </button>
              </form>
              <br />
              {cookiesAccepted === null && (
                  <p className="text-warning mt-2" style={{ fontSize: "0.9rem" }}>
                    Please accept or decline the cookie policy to continue
                  </p>
                )}
                {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      <CookieConsent
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />

      <Footer />
    </>
  );
}
export default LoginPage;
