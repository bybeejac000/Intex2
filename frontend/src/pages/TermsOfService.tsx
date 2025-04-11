import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PrivacyPage.css";

/**
 * Terms of Service page component
 * Displays the platform's terms and conditions with navigable sections
 */
const TermsPage = () => {
  const navigate = useNavigate();

  // Define sections for the sidebar navigation
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "userResponsibilities", title: "User Responsibilities" },
    { id: "userContent", title: "User-Generated Content" },
    { id: "reviewPolicy", title: "Review Policies" },
    { id: "prohibited", title: "Prohibited Activities" },
    { id: "intellectualProperty", title: "Intellectual Property" },
    { id: "limitation", title: "Disclaimer & Limitation of Liability" },
    { id: "modifications", title: "Modifications to Terms" },
    { id: "contact", title: "How to Contact Us" },
  ];

  // Navigate back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  /**
   * Scrolls the page to the specified section
   * @param id - The ID of the section to scroll to
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Header />
      {/* Spacer to prevent content from being hidden under fixed header */}
      <div style={{ height: '50px' }} />
      <div className="privacy-container">
        <button className="back-button" onClick={handleBack}>
          &#8592; Back
        </button>

        {/* Sidebar navigation menu */}
        <aside className="privacy-sidebar">
          <h2>Contents</h2>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <button onClick={() => scrollToSection(section.id)}>
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
          <button className="print-button" onClick={handlePrint}>
            Print
          </button>
        </aside>

        {/* Main content with Terms of Service sections */}
        <main className="privacy-main">
          <h1 className="policy-title">CineNiche Terms of Service</h1>

          {/* Terms of Service content organized by sections */}
          <section id="introduction">
            <h2 className="section-title">Introduction</h2>
            <p>
              Welcome to CineNiche! By accessing or using our platform, you
              agree to be bound by these Terms of Service. These terms govern
              your use of our website and services and outline your rights and
              responsibilities as a user.
            </p>
          </section>

          <section id="acceptance">
            <h2 className="section-title">Acceptance of Terms</h2>
            <p>
              By creating an account or using CineNiche, you acknowledge that
              you have read, understood, and agree to these Terms. If you do not
              agree, please do not use the service.
            </p>
          </section>

          <section id="userResponsibilities">
            <h2 className="section-title">User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account details and for all activities that occur under your
              account. You agree to provide accurate information and update it
              as needed.
            </p>
          </section>

          <section id="userContent">
            <h2 className="section-title">User-Generated Content</h2>
            <p>
              CineNiche allows you to leave reviews for movies and share your
              opinions. By submitting reviews or other content, you grant us a
              non-exclusive license to use, display, and distribute your content
              on our platform.
            </p>
          </section>

          <section id="reviewPolicy">
            <h2 className="section-title">Review Policies</h2>
            <p>
              We encourage honest, constructive reviews. However, CineNiche
              reserves the right to remove content that is found to be abusive,
              defamatory, or in violation of any applicable laws or guidelines.
            </p>
          </section>

          <section id="prohibited">
            <h2 className="section-title">Prohibited Activities</h2>
            <p>Users are prohibited from:</p>
            <ul>
              <li>Using CineNiche for any unlawful purposes.</li>
              <li>Posting offensive, misleading, or deceptive content.</li>
              <li>
                Engaging in activities that could harm or exploit other users.
              </li>
            </ul>
          </section>

          <section id="intellectualProperty">
            <h2 className="section-title">Intellectual Property</h2>
            <p>
              All content on CineNiche, including design, text, logos, images,
              and graphics, is protected by intellectual property laws.
              Unauthorized use of any materials may violate these laws.
            </p>
          </section>

          <section id="limitation">
            <h2 className="section-title">
              Disclaimer & Limitation of Liability
            </h2>
            <p>
              CineNiche is provided "as is" without warranties of any kind. We
              do not guarantee uninterrupted service or freedom from errors. In
              no event shall CineNiche or its contributors be liable for any
              damages arising out of your use of the service.
            </p>
          </section>

          <section id="modifications">
            <h2 className="section-title">Modifications to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms at any time
              without prior notice. Your continued use of the service after such
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section id="contact">
            <h2 className="section-title">How to Contact Us</h2>
            <p>
              For any questions or concerns regarding these Terms of Service,
              please contact us at:
            </p>
            <p>
              Phone: <span className="highlight">(760) 828-8405</span>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:help@cineniche.org" className="highlight-link">
                help@cineniche.org
              </a>
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default TermsPage;
