import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TermsPage from "./pages/TermsOfService";
import RegistrationPage from "./pages/RegistrationPage";
import MoviesPage from "./pages/MoviesPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";
import AuthorizeView from "./components/AuthorizeView";
import EmailConfirmationPage from "./pages/EmailConfirmationPage/EmailConfirmationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route
          path="/admin"
          element={
            <AuthorizeView>
              <AdminPage />
            </AuthorizeView>
          }
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/confirmEmail" element={<EmailConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
