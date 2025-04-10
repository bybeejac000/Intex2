import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NotificationModal from "../components/NotificationModal/NotificationModal";
import "./TwoFactorPage.css";

const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();
  const [verificationDigits, setVerificationDigits] = useState(["", "", "", ""]);
  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [timer, setTimer] = useState(30);

  // Start countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  // Retrieve email from localStorage
  const email = localStorage.getItem("email") || "";

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...verificationDigits];
    newDigits[index] = value;
    setVerificationDigits(newDigits);
    if (value.length === 1 && index < 3) {
      digitRefs[index + 1].current?.focus();
    }
  };

  // Hardcoded verification code "0000"
  const handleVerifyCode = () => {
    const codeEntered = verificationDigits.join("");
    if (codeEntered === "0000") {
      setNotification({ show: true, message: "2FA Verified! Logging in..." });
      setTimeout(() => {
        navigate("/movies");
      }, 500);
    } else {
      setNotification({ show: true, message: "Invalid code. Please try again." });
    }
  };

  // Resend code: reset inputs and timer (and eventually call backend)
  const resendCode = () => {
    setVerificationDigits(["", "", "", ""]);
    setTimer(30);
    setNotification({ show: true, message: "A new code has been sent to your email." });
    // TODO: Trigger actual resend logic when backend is integrated.
  };

  return (
    <div className="twofactor-container">
      {/* Back Button using FontAwesomeIcon */}
      <button
        className="back-button"
        onClick={() => navigate("/login")}
      >
        <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white", fontSize: "2.25rem" }} />
      </button>

      <h2>Two Factor Authentication</h2>
      <p>
        A verification code has been sent to <strong>{email}</strong>. Please enter it below to continue.
      </p>

      <div className="code-inputs">
        {verificationDigits.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={digitRefs[index]}
            value={verificationDigits[index]}
            onChange={(e) => handleDigitChange(index, e.target.value)}
          />
        ))}
      </div>

      <div className="resend-container">
        {timer > 0 ? (
          <p className="timer-text">Resend code in {timer} seconds</p>
        ) : (
          <p className="resend-link" onClick={resendCode}>
            Send a new code
          </p>
        )}
      </div>

      <button className="verify-btn" onClick={handleVerifyCode}>
        Verify
      </button>

      {notification.show && (
        <NotificationModal
          message={notification.message}
          onOk={() => setNotification({ show: false, message: "" })}
        />
      )}
    </div>
  );
};

export default TwoFactorPage;
