import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a cookie choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (!cookieChoice) {
      setVisible(true);
    }
  }, []);

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

  if (!visible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '0',
        right: '0',
        width: '80%',
        margin: '0 auto',
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
        borderRadius: '8px'
      }}
    >
      <div>
        <p style={{ margin: '0 0 10px 0', fontSize: '16px', textAlign: 'center' }}>
          <strong>Cookie Notice</strong>
        </p>
        <p style={{ marginRight: '15px', fontSize: '14px', textAlign: 'center' }}>
          We use cookies to enhance your experience on our website. By clicking "Accept", 
          you agree to the use of cookies for authentication and personalization.
          You can decline non-essential cookies by clicking "Decline".
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
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