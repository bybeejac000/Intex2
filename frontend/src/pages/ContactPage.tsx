// ContactPage.tsx
// This component displays the Contact page containing contact information and a brief message

import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PrivacyPage.css"; // Using the same styling as the Privacy page

/**
 * ContactPage component displays company contact information
 * along with a brief message about the company's commitment to user experience
 */
const ContactPage = () => {
  // Initialize navigation hook for page navigation
  const navigate = useNavigate();

  // Handler to navigate back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Handler to print the current page
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Page header component */}
      <Header />
      {/* Spacing element to provide margin below header */}
      <div style={{ height: '50px' }} />
      <div className="privacy-container">
        {/* Back navigation button */}
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        {/* Sidebar with contact information */}
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
          {/* Print page button */}
          <button className="print-button" onClick={handlePrint}>
            Print
          </button>
        </aside>

        {/* Main content area */}
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
      {/* Page footer component */}
      <Footer />
    </>
  );
};

export default ContactPage;