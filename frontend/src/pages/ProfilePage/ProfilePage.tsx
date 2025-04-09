import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProfilePhoto from '../../components/ProfilePhoto/ProfilePhoto';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  // Local state for profile fields.
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email] = useState('john.doe@example.com'); // read-only

  // Editing states for name fields.
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);

  // Profile picture state.
  const [profilePictureId, setProfilePictureId] = useState<number>(0);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);

  // Confirmation modal states.
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [show2FAConfirmation, setShow2FAConfirmation] = useState(false);
  const [showChangeEmailConfirmation, setShowChangeEmailConfirmation] = useState(false);
  const [showChangePasswordConfirmation, setShowChangePasswordConfirmation] = useState(false);

  // Notification modals (one-button) for email and password.
  const [showEmailSentNotification, setShowEmailSentNotification] = useState(false);
  const [showPasswordSentNotification, setShowPasswordSentNotification] = useState(false);

  // Save logic for name fields.
  const saveFirstName = () => {
    setIsEditingFirstName(false);
    // TODO: Send update to backend.
  };
  const saveLastName = () => {
    setIsEditingLastName(false);
    // TODO: Send update to backend.
  };

  // Photo selection logic.
  const handleEditPhoto = () => {
    setShowPhotoSelector(!showPhotoSelector);
  };
  const handleSelectPicture = (idx: number) => {
    setProfilePictureId(idx);
    setShowPhotoSelector(false);
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

  const handleLogOutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const performLogOut = () => {
    setShowLogoutConfirmation(false);
    // TODO: Implement actual logout logic.
    console.log("User logged out.");
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
          {/* Left side: Editable fields */}
          <div className="profile-text">
            {/* First Name */}
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

            {/* Last Name */}
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

            {/* Email: display only */}
            <div className="profile-field">
              <label>Email</label>
              <div className="email-display">{email}</div>
            </div>
          </div>

          {/* Right side: Profile Photo and Edit dropdown */}
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

        {/* Row of four secondary action buttons (centered) */}
        <div className="profile-actions">
          <button className="secondary-button" onClick={handleEnable2FA}>
            2 Factor Authentication
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

        {/* Log Out button on its own centered row */}
        <div className="logout-row">
          <button className="profile-button" onClick={handleLogOutClick}>
            Log Out
          </button>
        </div>

        {/* Confirmation modal for 2 Factor Authentication */}
        {show2FAConfirmation && (
          <ConfirmationModal
            message={`Enable 2 factor authentication using email ${email}?`}
            onConfirm={() => {
              // TODO: implement enabling 2FA logic
              setShow2FAConfirmation(false);
            }}
            onCancel={() => setShow2FAConfirmation(false)}
          />
        )}

        {/* Confirmation modal for reset preferences */}
        {showResetConfirmation && (
          <ConfirmationModal
            message="Would you like to reset your preferences?"
            onConfirm={() => {
              // TODO: implement reset preferences logic
              setShowResetConfirmation(false);
            }}
            onCancel={() => setShowResetConfirmation(false)}
          />
        )}

        {/* Confirmation modal for logout */}
        {showLogoutConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to log out?"
            onConfirm={performLogOut}
            onCancel={() => setShowLogoutConfirmation(false)}
          />
        )}

        {/* Confirmation modal for change email */}
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

        {/* Notification modal: email sent */}
        {showEmailSentNotification && (
          <NotificationModal
            message={`An email was sent to ${email} to change your email.`}
            onOk={() => setShowEmailSentNotification(false)}
          />
        )}

        {/* Confirmation modal for change password */}
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

        {/* Notification modal: password sent */}
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
