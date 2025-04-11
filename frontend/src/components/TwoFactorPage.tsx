import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NotificationModal from "../components/NotificationModal/NotificationModal";
import "./TwoFactorPage.css";

const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();

  // ─── state ─────────────────────────────────────────────────────────
  const [verificationDigits, setVerificationDigits] = useState(["", "", "", ""]);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [timer, setTimer] = useState(30);
  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const email = localStorage.getItem("email") ?? "";

  // ─── start / restart 30‑second countdown on mount & resend ─────────
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ─── input helpers ────────────────────────────────────────────────
  const handleDigitChange = (idx: number, value: string) => {
    if (value.length > 1) return;
    const next = [...verificationDigits];
    next[idx] = value;
    setVerificationDigits(next);
    if (value && idx < 3) digitRefs[idx + 1].current?.focus();
  };

  // ─── hard‑coded verification check ────────────────────────────────
  const handleVerifyCode = () => {
    const code = verificationDigits.join("");
    if (code === "8712") {
      setNotification({ show: true, message: "Code verified! Logging in…" });
      setTimeout(() => navigate("/movies"), 500);
    } else {
      setNotification({ show: true, message: "Invalid code. Please try again." });
    }
  };

  // ─── resend code (UI only) ─────────────────────────────────────────
  const resendCode = () => {
    setVerificationDigits(["", "", "", ""]);
    setTimer(30);
    setNotification({
      show: true,
      message: "A new code has been (pretend) sent to your e‑mail.",
    });
  };

  // ─── UI ────────────────────────────────────────────────────────────
  return (
    <div className="twofactor-container">
      <button className="back-button" onClick={() => navigate("/login")}>
        <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white", fontSize: "2.25rem" }} />
      </button>

      <h2>Two‑Factor Authentication</h2>
      <p>
        A verification code has been sent to <strong>{email}</strong>. Please enter it below to
        continue.
      </p>

      <div className="code-inputs">
        {verificationDigits.map((d, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            ref={digitRefs[i]}
            value={d}
            onChange={(e) => handleDigitChange(i, e.target.value)}
          />
        ))}
      </div>

      <div className="resend-container">
        {timer > 0 ? (
          <p className="timer-text">Resend code in {timer}s</p>
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
