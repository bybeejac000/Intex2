import React, { useState } from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  const [animateOut, setAnimateOut] = useState(false);

  const handleConfirm = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onConfirm();
    }, 200); // duration should match animation duration
  };

  const handleCancel = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  return (
    <div className={`confirmation-modal ${animateOut ? 'slide-out' : 'slide-in'}`}>
      <div className="confirmation-content">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-buttons">
          <button className="secondary-button" onClick={handleCancel}>
            No
          </button>
          <button className="primary-button" onClick={handleConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
