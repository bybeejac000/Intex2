// ContactPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PrivacyPage.css";

const ContactPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header />
      <div style={{ height: '50px' }} />
      <div className="privacy-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <aside className="privacy-sidebar">
          <h2>Contact Info</h2>
          <ul>
            <li>Email: <a href="mailto:help@cineniche.org" className="highlight-link">help@cineniche.org</a></li>
            <li>Phone: <span className="highlight">(760) 828-8405</span></li>
            <li>Address: <br />
              <span className="highlight">
                900 W University Pkwy,<br />
                Provo, UT 84602
              </span>
            </li>
          </ul>
          <button className="print-button" onClick={handlePrint}>
            Print
          </button>
        </aside>

        <main className="privacy-main">
          <h1 className="policy-title">Contact CineNiche</h1>
          <p>
            CineNiche is committed to delivering an exceptional movie discovery experience and welcomes feedback, inquiries, and support requests from our community. Please reach out using the contact information provided.
          </p>
          <p>
            Our team is based in Provo, Utah, and we aim to respond to all inquiries within 1-2 business days. Thank you for your interest in CineNiche.
          </p>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;