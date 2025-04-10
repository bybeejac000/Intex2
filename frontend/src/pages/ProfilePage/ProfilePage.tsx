import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProfilePhoto from "../../components/ProfilePhoto/ProfilePhoto";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import NotificationModal from "../../components/NotificationModal/NotificationModal";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  // Profile fields.
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profilePictureId, setProfilePictureId] = useState<number>(0);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);

  // Modal states.
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [show2FAConfirmation, setShow2FAConfirmation] = useState(false);
  const [showChangeEmailConfirmation, setShowChangeEmailConfirmation] =
    useState(false);
  const [showChangePasswordConfirmation, setShowChangePasswordConfirmation] =
    useState(false);
  const [showEmailSentNotification, setShowEmailSentNotification] =
    useState(false);
  const [showPasswordSentNotification, setShowPasswordSentNotification] =
    useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Editing states.
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);

  // Fetch profile data on mount.
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("https://localhost:5000/account/me", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setTwoFactorEnabled(data.twoFactorEnabled || false);
      setProfilePictureId(data.profilePictureId || 0);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Save functions.
  const saveFirstName = async () => {
    setIsEditingFirstName(false);
    try {
      const payload = { firstName };
      const res = await fetch("https://localhost:5000/account/updateProfile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Profile update failed");
      console.log("First name updated.");
    } catch (error) {
      console.error(error);
      alert("Error updating first name.");
    }
  };

  const saveLastName = async () => {
    setIsEditingLastName(false);
    try {
      const payload = { lastName };
      const res = await fetch("https://localhost:5000/account/updateProfile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Profile update failed");
      console.log("Last name updated.");
    } catch (error) {
      console.error(error);
      alert("Error updating last name.");
    }
  };

  // Update profile picture.
  const handleEditPhoto = () => {
    setShowPhotoSelector(!showPhotoSelector);
  };
  const handleSelectPicture = async (idx: number) => {
    setProfilePictureId(idx);
    setShowPhotoSelector(false);
    try {
      const payload = { ProfilePictureId: idx };
      const res = await fetch("https://localhost:5000/account/updateProfile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update profile picture");
      console.log("Profile picture updated.");
    } catch (error) {
      console.error(error);
      alert("Error updating profile picture.");
    }
  };

  // Action button handlers.
  const handleEnable2FA = () => {
    setShow2FAConfirmation(true);
  };
  const handleChangeEmail = () => {
    setShowChangeEmailConfirmation(true);
  };
  const handleChangePassword = () => {
    setShowChangePasswordConfirmation(true);
  };
  const handleResetPreferences = () => {
    setShowResetConfirmation(true);
  };

  // Logout.
  const handleLogOutClick = () => {
    setShowLogoutConfirmation(true);
  };
  const performLogOut = async () => {
    setLoggingOut(true);
    try {
      const response = await fetch("https://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");
      setShowLogoutConfirmation(false);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Error logging out.");
      setLoggingOut(false);
    }
  };

  // Toggle 2FA.
  const toggle2FA = async () => {
    try {
      const response = await fetch("https://localhost:5000/account/toggle2FA", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Toggle 2FA failed");
      const data = await response.json();
      setTwoFactorEnabled(data.twoFactorEnabled);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-arrow-btn" onClick={handleBack}>
            ←
          </button>
          <h1 className="profile-title">My Profile</h1>
        </div>

        <div className="profile-details">
          {/* Left: Editable fields */}
          <div className="profile-text">
            <div className="profile-field">
              <label>First Name</label>
              <div className="field-with-check">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly={!isEditingFirstName}
                  onFocus={() => setIsEditingFirstName(true)}
                />
                {isEditingFirstName && (
                  <button className="check-icon-button" onClick={saveFirstName}>
                    &#10003;
                  </button>
                )}
              </div>
            </div>

            <div className="profile-field">
              <label>Last Name</label>
              <div className="field-with-check">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly={!isEditingLastName}
                  onFocus={() => setIsEditingLastName(true)}
                />
                {isEditingLastName && (
                  <button className="check-icon-button" onClick={saveLastName}>
                    &#10003;
                  </button>
                )}
              </div>
            </div>

            <div className="profile-field">
              <label>Email</label>
              <div className="email-display">{email}</div>
            </div>
          </div>

          {/* Right: Profile Photo */}
          <div className="profile-photo-section">
            <ProfilePhoto pictureId={profilePictureId} size={180} />
            <button className="edit-photo-button" onClick={handleEditPhoto}>
              Edit
            </button>
            {showPhotoSelector && (
              <div
                className="photo-dropdown"
                tabIndex={0}
                onBlur={() => setShowPhotoSelector(false)}
              >
                <div className="photo-grid">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <div
                      key={idx}
                      className="photo-option"
                      onClick={() => handleSelectPicture(idx)}
                    >
                      <ProfilePhoto pictureId={idx} size={80} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secondary action buttons */}
        <div className="profile-actions">
          <button className="secondary-button" onClick={handleEnable2FA}>
            {twoFactorEnabled
              ? "✔ 2 Factor Authentication Enabled"
              : "2 Factor Authentication"}
          </button>
          <button className="secondary-button" onClick={handleChangeEmail}>
            Change Email
          </button>
          <button className="secondary-button" onClick={handleChangePassword}>
            Change Password
          </button>
          <button className="secondary-button" onClick={handleResetPreferences}>
            Reset Preferences
          </button>
        </div>

        {/* Log Out button */}
        <div className="logout-row">
          <button
            className="profile-button"
            onClick={handleLogOutClick}
            disabled={loggingOut}
          >
            Log Out
          </button>
        </div>

        {/* Modals */}
        {show2FAConfirmation && (
          <ConfirmationModal
            message={
              twoFactorEnabled
                ? "Disable 2 factor authentication?"
                : `Enable 2 factor authentication using email ${email}?`
            }
            onConfirm={async () => {
              await toggle2FA();
              setShow2FAConfirmation(false);
            }}
            onCancel={() => setShow2FAConfirmation(false)}
          />
        )}
        {showResetConfirmation && (
          <ConfirmationModal
            message="Would you like to reset your preferences?"
            onConfirm={() => {
              setShowResetConfirmation(false);
              // TODO: implement reset preferences logic
            }}
            onCancel={() => setShowResetConfirmation(false)}
          />
        )}
        {showLogoutConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to log out?"
            onConfirm={performLogOut}
            onCancel={() => setShowLogoutConfirmation(false)}
          />
        )}
        {showChangeEmailConfirmation && (
          <ConfirmationModal
            message="Would you like to change your email?"
            onConfirm={() => {
              setShowChangeEmailConfirmation(false);
              setShowEmailSentNotification(true);
            }}
            onCancel={() => setShowChangeEmailConfirmation(false)}
          />
        )}
        {showEmailSentNotification && (
          <NotificationModal
            message={`An email was sent to ${email} to change your email.`}
            onOk={() => setShowEmailSentNotification(false)}
          />
        )}
        {showChangePasswordConfirmation && (
          <ConfirmationModal
            message="Would you like to change your password?"
            onConfirm={() => {
              setShowChangePasswordConfirmation(false);
              setShowPasswordSentNotification(true);
            }}
            onCancel={() => setShowChangePasswordConfirmation(false)}
          />
        )}
        {showPasswordSentNotification && (
          <NotificationModal
            message={`An email was sent to ${email} to change your password.`}
            onOk={() => setShowPasswordSentNotification(false)}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
