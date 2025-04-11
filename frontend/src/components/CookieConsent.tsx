import { useState, useEffect } from 'react';

/**
 * Cookie consent banner component that displays a notification to users
 * allowing them to accept or decline cookies on the website.
 */
interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a cookie choice
    // Only show the banner if no previous choice is stored
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (!cookieChoice) {
      setVisible(true);
    }
  }, []);

  // Store user's consent choice and trigger the appropriate callback
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
    onDecline();
  };

  // Don't render anything if the banner shouldn't be visible
  if (!visible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '65px',
        right: '0',
        width: '66.5%', 
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,  // Ensure banner appears above other content
        boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <div>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', textAlign: 'center' }}>
          <strong>Cookie Notice</strong>
        </p>
        <p style={{ fontSize: '14px', textAlign: 'center' }}>
          We use cookies to enhance your experience on our website. By clicking "Accept", 
          you agree to the use of cookies for authentication and personalization.
          You can decline non-essential cookies by clicking "Decline".
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: 'white',
            color: '#1976d2',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
            width: '100px',
            height: '36px'
          }}
        >
          Accept
        </button>
        
        <button
          onClick={handleDecline}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
            width: '100px',
            height: '36px'
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent; 