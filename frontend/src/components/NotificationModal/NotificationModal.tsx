import React, { useState } from 'react';
import './NotificationModal.css';

interface NotificationModalProps {
  message: string;
  onOk: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ message, onOk }) => {
  const [animateOut, setAnimateOut] = useState(false);

  const handleOk = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onOk();
    }, 200);
  };

  return (
    <div className={`notification-modal ${animateOut ? 'slide-out' : 'slide-in'}`}>
      <div className="notification-content">
        <p className="notification-message">{message}</p>
        <button className="primary-button" onClick={handleOk}>
          Okay!
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
