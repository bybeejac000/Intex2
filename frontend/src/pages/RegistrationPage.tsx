import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";
import ScrollingPosters from "../components/ScrollingPosters";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../components/NotificationModal/NotificationModal";

function RegistrationPage() {
  const navigate = useNavigate();

  // Steps 1-8: Registration fields, including confirmPassword and agreed (checkbox)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    zipcode: "",
    state: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  // Step 9: 4-digit verification code entry
  const [verificationDigits, setVerificationDigits] = useState([
    "",
    "",
    "",
    "",
  ]);
  // Refs for the 4 input boxes
  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // The step can go from 1 to 9
  const [step, setStep] = useState(1);

  // State for notification modals (replaces alerts)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  // Handle changes for any registration field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      // For the "agreed" checkbox
      setFormData({ ...formData, agreed: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Intercept Enter key presses to avoid unwanted form submission
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // For steps 1–7, simulate "Next" button
      if (step < 8) {
        handleNext();
      }
      // For step 9 or 8, do nothing or custom logic
    }
  };

  // Advance to the next step. If step 7, check password length.
  const handleNext = () => {
    if (step === 7 && formData.password.length < 15) {
      setNotification({
        show: true,
        message: "Password must be at least 15 characters long",
      });
      return;
    }
    if (step < 9) {
      setStep(step + 1);
    }
  };

  // Submit registration on step 8
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      zip: formData.zipcode,
      state: formData.state,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("https://localhost:5000/Account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        localStorage.setItem("pendingRegistrationEmail", formData.email);
        setNotification({
          show: true,
          message:
            "Almost there! Please check your email for the verification code.",
        });
        setStep(9);
      } else {
        const errorData = await response.json();
        console.error(errorData);
        setNotification({
          show: true,
          message: "Registration Failed. Please check your input.",
        });
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      setNotification({
        show: true,
        message: "An error occurred. Please try again later.",
      });
    }
  };

  // Handling each verification digit box for step 9
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newDigits = [...verificationDigits];
    newDigits[index] = value;
    setVerificationDigits(newDigits);
    // Auto-focus next input if user typed a digit
    if (value.length === 1 && index < 3) {
      digitRefs[index + 1].current?.focus();
    }
  };

  // Hardcoded "0000" for verification code
  const handleVerifyCode = () => {
    const codeEntered = verificationDigits.join("");
    if (codeEntered === "0000") {
      setNotification({ show: true, message: "Email verified successfully!" });
      localStorage.removeItem("pendingRegistrationEmail");
      navigate("/movies");
    } else {
      setNotification({
        show: true,
        message: "Invalid verification code. Please try again.",
      });
    }
  };

  const buttonStyle = {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "10px 20px",
    fontSize: "1.2rem",
    height: "50px",
    textAlign: "center" as const,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  };

  // Renders each step's UI
  const renderStep = () => {
    switch (step) {
      // Steps 1–7: user inputs
      case 1:
        return (
          <div className="mb-3">
            <h5 className="mb-4">What's your first name?</h5>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="form-control form-control-lg"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        );
      case 2:
        return (
          <div className="mb-3">
            <h5 className="mb-4">What's your last name?</h5>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="form-control form-control-lg"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        );
      case 3:
        return (
          <div className="mb-3">
            <h5 className="mb-4">What's your zip code?</h5>
            <input
              type="text"
              name="zipcode"
              placeholder="Zipcode"
              className="form-control form-control-lg"
              value={formData.zipcode}
              onChange={handleChange}
            />
          </div>
        );
      case 4:
        return (
          <div className="mb-3">
            <h5 className="mb-4">What's your state?</h5>
            <input
              type="text"
              name="state"
              placeholder="State"
              className="form-control form-control-lg"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        );
      case 5:
        return (
          <div className="mb-3">
            <h5 className="mb-4">What's your phone number?</h5>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              className="form-control form-control-lg"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
        );
      case 6:
        return (
          <div className="mb-3">
            <h5 className="mb-4">What's your email address?</h5>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-control form-control-lg"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        );
      case 7:
        return (
          <div className="mb-3">
            <h5 className="mb-4">Create a password</h5>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`form-control form-control-lg ${
                formData.password.length > 0
                  ? formData.password.length >= 15
                    ? "is-valid"
                    : "is-invalid"
                  : ""
              }`}
              value={formData.password}
              onChange={handleChange}
            />
            <p
              className={
                formData.password.length > 0 && formData.password.length < 15
                  ? "text-danger"
                  : ""
              }
            >
              *Password must contain at least 15 characters{" "}
              {formData.password.length > 0 &&
                `(${formData.password.length}/15)`}
            </p>
            <h5 className="mb-4">Confirm password</h5>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`form-control form-control-lg ${
                formData.confirmPassword.length > 0
                  ? formData.confirmPassword === formData.password
                    ? "is-valid"
                    : "is-invalid"
                  : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <p
              className={
                formData.confirmPassword.length > 0 &&
                formData.confirmPassword !== formData.password
                  ? "text-danger"
                  : ""
              }
            >
              *Passwords must match
            </p>
          </div>
        );
      // Step 8: final confirmation + "agreed" checkbox
      case 8:
        return (
          <div className="text-center">
            <h2>Confirm Your Details</h2>
            <br />
            <p>First Name: {formData.firstName}</p>
            <p>Last Name: {formData.lastName}</p>
            <p>Zipcode: {formData.zipcode}</p>
            <p>State: {formData.state}</p>
            <p>Email: {formData.email}</p>
            <br />
            <div className="form-check mb-3">
              <input
                type="checkbox"
                id="termsCheckbox"
                className="form-check-input"
                checked={formData.agreed}
                onChange={handleChange}
                name="agreed"
              />
              <label
                htmlFor="termsCheckbox"
                className="form-check-label"
                style={{ fontSize: "0.9rem" }}
              >
                I have read and agree to the{" "}
                <a
                  href="/terms"
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-lg"
              style={{
                backgroundColor: buttonStyle.backgroundColor,
                color: buttonStyle.color,
                padding: buttonStyle.padding,
                fontSize: buttonStyle.fontSize,
                height: buttonStyle.height,
                textAlign: "center",
                display: buttonStyle.display,
                justifyContent: buttonStyle.justifyContent,
                alignItems: buttonStyle.alignItems,
                width: "300px",
              }}
              disabled={!formData.agreed}
            >
              Confirm and Register
            </button>
          </div>
        );
      // Step 9: verification codes
      case 9:
        return (
          <div className="mb-3 text-center">
            <h3 className="mb-4">Enter Verification Code</h3>
            <p>
              An email has been sent to <strong>{formData.email}</strong> with a
              verification code. Please enter it below.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              {verificationDigits.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={digitRefs[index]}
                  className="verification-box"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "2rem",
                    textAlign: "center",
                    backgroundColor: "rgba(200,200,200,0.5)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    borderRadius: "4px",
                  }}
                  value={verificationDigits[index]}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                />
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ ...buttonStyle, width: "300px", marginTop: "1.5rem" }}
              onClick={handleVerifyCode}
            >
              Verify
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div
        className="container-fluid p-0 min-vh-100"
        style={{
          backgroundImage: "linear-gradient(135deg, #000810 0%, #00294D 100%)",
          backgroundColor: "#0a1929",
          overflow: "hidden",
          margin: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <div className="row g-0 h-100">
          <div className="col-md-4">
            <ScrollingPosters />
          </div>
          <div
            className="col-md-8 d-flex flex-column justify-content-center align-items-center text-light"
            style={{ height: "100vh" }}
          >
            <div
              className="text-center mb-5 d-flex align-items-center justify-content-center"
              style={{ paddingTop: "100px" }}
            >
              <button
                className="btn btn-link text-light text-decoration-none me-3"
                onClick={() => window.history.back()}
                style={{ fontSize: "2.25rem", paddingBottom: "38px" }}
              >
                ←
              </button>
              <h1 className="display-1 fw-light mb-4">
                Register for an Account
              </h1>
            </div>
            <br />
            <br />
            <form
              className="d-flex flex-column gap-3"
              style={{ maxWidth: "300px", margin: "0 auto" }}
              onSubmit={handleSubmit}
              onKeyDown={handleFormKeyDown}
            >
              {renderStep()}
              <div className="d-flex justify-content-center gap-3">
                {step === 8 && (
                  <button
                    type="submit"
                    className="btn btn-lg"
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #1976d2",
                      color: "#1976d2",
                      padding: buttonStyle.padding,
                      fontSize: buttonStyle.fontSize,
                      height: buttonStyle.height,
                      textAlign: "center",
                      display: buttonStyle.display,
                      justifyContent: buttonStyle.justifyContent,
                      alignItems: buttonStyle.alignItems,
                      width: "500px",
                    }}
                    onClick={() => setStep(1)}
                  >
                    Go Back and Edit
                  </button>
                )}
                {step < 8 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
              </div>
              <div className="mt-3">
                <p>Step {step} of 9</p>
                <div className="progress" style={{ marginBottom: "100px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(step / 9) * 100}%` }}
                    aria-valuenow={step}
                    aria-valuemin={1}
                    aria-valuemax={9}
                  ></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />

      {/* Notification Modal */}
      {notification.show && (
        <NotificationModal
          message={notification.message}
          onOk={() => setNotification({ show: false, message: "" })}
        />
      )}
    </>
  );
}

export default RegistrationPage;
