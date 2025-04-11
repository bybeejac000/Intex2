import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./HomePage.css";
import ScrollingPosters from "../components/ScrollingPosters";
import { useNavigate } from "react-router-dom";
import NotificationModal from "../components/NotificationModal/NotificationModal";
//import ConfirmationModal from "../components/ConfirmationModal/ConfirmationModal";

/**
 * RegistrationPage Component
 * 
 * A multi-step registration form that collects user information, creates an account,
 * and verifies the user's email with a verification code.
 * 
 * The registration process consists of 9 steps:
 * 1-7: Collecting user information (name, location, contact, credentials)
 * 8: Review information and agree to terms
 * 9: Enter verification code sent to email
 */
function RegistrationPage() {
  const navigate = useNavigate();

  // Form data state to store all user registration information
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

  // State for the 4-digit verification code at step 9
  const [verificationDigits, setVerificationDigits] = useState([
    "",
    "",
    "",
    "",
  ]);
  
  // Refs for the 4 verification code input boxes to enable auto-focus
  const digitRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Current step in the registration process (1-9)
  const [step, setStep] = useState(1);

  // State for displaying notification modals instead of alerts
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  /**
   * Updates form data state when input fields change
   * Handles both text inputs and checkbox (for terms agreement)
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      // For the "agreed" checkbox
      setFormData({ ...formData, agreed: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * Prevents form submission when Enter key is pressed
   * Instead advances to next step when appropriate
   */
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

  /**
   * Advances to the next step in the registration process
   * Includes validation for password length at step 7
   */
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

  /**
   * Handles form submission at step 8
   * Sends registration data to the server API
   * Moves to verification step on success
   */
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
      const response = await fetch("https://cineniche.click/Account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (response.ok) {
        // Store email temporarily for verification step
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

  /**
   * Handles input changes for the verification code digits
   * Automatically focuses the next input box when a digit is entered
   */
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

  /**
   * Verifies the entered code against hardcoded "0000"
   * Navigates to movies page on success
   */
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

  // Common button style used throughout the form
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

  /**
   * Renders the appropriate UI for the current registration step
   * Each step focuses on a specific piece of information
   */
  const renderStep = () => {
    switch (step) {
      // Step 1: First name
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
      // Step 2: Last name
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
      // Step 3: Zip code
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
      // Step 4: State
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
      // Step 5: Phone number
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
      // Step 6: Email address
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
      // Step 7: Password creation and confirmation
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
            <p style={{ fontSize: "0.65rem" }}
              className={
                formData.password.length > 0 && formData.password.length < 15
                  ? "text-danger"
                  : ""
              }
            >
              *Password must contain at least 15 characters and contain at least one uppercase letter, one lowercase letter, one number{" "}
              {formData.password.length > 0 &&
                `(${formData.password.length}/15)`}
            </p>
            <br />
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
      // Step 8: Review information and agree to terms
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
      // Step 9: Email verification with 4-digit code
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
      {/* Header component for site navigation */}
      <Header />
      
      {/* Main container with gradient background */}
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
          {/* Left column with scrolling movie posters */}
          <div className="col-md-4">
            <ScrollingPosters />
          </div>
          
          {/* Right column with registration form */}
          <div
            className="col-md-8 d-flex flex-column justify-content-center align-items-center text-light"
            style={{ height: "100vh" }}
          >
            {/* Page title with back button */}
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
            
            {/* Registration form that adapts based on current step */}
            <form
              className="d-flex flex-column gap-3"
              style={{ maxWidth: "300px", margin: "0 auto" }}
              onSubmit={handleSubmit}
              onKeyDown={handleFormKeyDown}
            >
              {/* Current step form content */}
              {renderStep()}
              
              {/* Navigation buttons */}
              <div className="d-flex justify-content-center gap-3">
                {/* Back button only on confirmation step */}
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
                
                {/* Next button for steps 1-7 */}
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
              
              {/* Progress indicator */}
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
      
      {/* Footer component */}
      <Footer />

      {/* Notification Modal for alerts and messages */}
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
