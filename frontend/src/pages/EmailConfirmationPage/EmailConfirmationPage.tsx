import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./EmailConfirmationPage.css"; // optional
import NotificationModal from "../../components/NotificationModal/NotificationModal";

interface EmailConfirmationPageProps {
  // If you want to pass props or use route params, you can do so here.
}

const EmailConfirmationPage: React.FC<EmailConfirmationPageProps> = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const email = localStorage.getItem("pendingRegistrationEmail") || "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!code) {
      setError("Please enter your verification code.");
      return;
    }

    try {
      const response = await fetch("https://localhost:5000/account/verifyEmailCode", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.message || "Verification failed.");
      }

      // If successful:
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Failed to verify code.");
    }
  };

  return (
    <>
      <Header />
      <div className="email-confirmation-container">
        <h1>Enter Verification Code</h1>
        <p>We’ve emailed a verification code to {email}. Please enter it below.</p>

        <form onSubmit={handleSubmit} className="email-confirmation-form">
          <input
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="verification-input"
          />
          <button type="submit" className="verify-button">
            Verify
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* On success, show a single-button notification, or navigate away */}
      {showSuccessModal && (
        <NotificationModal
          message="Your email has been successfully verified!"
          onOk={() => {
            setShowSuccessModal(false);
            // e.g. redirect to /movies or login:
            window.location.href = "/movies";
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default EmailConfirmationPage;
