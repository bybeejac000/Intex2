// AboutPage.tsx
//import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PrivacyPage.css";

const AboutPage = () => {
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
          <h2>Quick Links</h2>
          <ul>
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Our Mission</button></li>
            <li><button onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}>Technology</button></li>
            <li><button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>INTEX 2025</button></li>
          </ul>
          <button className="print-button" onClick={handlePrint}>
            Print
          </button>
        </aside>

        <main className="privacy-main">
          <h1 className="policy-title">About CineNiche</h1>
          <section>
            <h2 className="section-title">Our Mission</h2>
            <p>
              CineNiche is a visionary movie streaming service focused on bringing the world's most compelling and underrepresented cinema to the forefront. From cult classics and international gems to indie masterpieces and thought-provoking documentaries, we curate a catalog for passionate viewers seeking something beyond the mainstream.
            </p>
            <p>
              Our goal is to connect cinephiles with stories that inspire, challenge, and resonate—regardless of origin, budget, or fame.
            </p>
          </section>

          <section>
            <h2 className="section-title">Technology</h2>
            <p>
              CineNiche leverages cutting-edge technologies including machine-learning powered recommendation engines, cross-platform deployment, and robust user analytics to enhance the cinematic discovery process. Whether you're watching on iOS, Android, Roku, AppleTV, or your browser, CineNiche delivers a seamless, intelligent viewing experience.
            </p>
          </section>

          <section>
            <h2 className="section-title">INTEX 2025 Project</h2>
            <p>
              As part of our ongoing innovation, CineNiche partnered with an elite development team during Winter 2025 to prototype a dynamic recommendation system. This system harnesses machine learning to personalize movie suggestions based on user ratings and behavior, empowering our users to uncover new favorites.
            </p>
            <p>
              The project also focused on robust admin tools for managing the catalog and improving site security and usability. This prototype laid the foundation for CineNiche's next-generation streaming platform.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
