import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PrivacyPage.css";

const PrivacyPage = () => {
  const navigate = useNavigate();

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "dataCollection", title: "What Data Do We Collect?" },
    { id: "dataCollectionMethod", title: "How Do We Collect Your Data?" },
    { id: "dataUsage", title: "How Will We Use Your Data?" },
    { id: "dataStorage", title: "How Do We Store Your Data?" },
    { id: "marketing", title: "Marketing" },
    { id: "dataRights", title: "What Are Your Data Protection Rights?" },
    { id: "cookies", title: "What Are Cookies?" },
    { id: "cookiesUsage", title: "How Do We Use Cookies?" },
    { id: "cookieTypes", title: "What Types of Cookies Do We Use?" },
    { id: "cookieManagement", title: "How to Manage Cookies" },
    { id: "thirdParty", title: "Privacy Policies of Other Websites" },
    { id: "policyChanges", title: "Changes to Our Privacy Policy" },
    { id: "contact", title: "How to Contact Us" },
    { id: "authority", title: "How to Contact the Appropriate Authority" },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Adjust this value to match your header height
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
      <div className="privacy-container">
        <button className="back-button" onClick={handleBack}>
          &#8592; Back
        </button>

        {/* Sidebar! */}
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

        {/* Content of the Privacy Policy! */}
        <main className="privacy-main">
          <h1 className="policy-title">CineNiche Privacy Policy</h1>

          <section id="introduction">
            <h2 className="section-title">Introduction</h2>
            <p>
              Welcome to CineNiche! This privacy policy outlines how we collect,
              use, store, and protect your personal{" "}
              <span className="highlight">data</span> when you interact with our
              platform. As part of a university capstone project, CineNiche is
              committed to upholding the highest standards of user data
              protection and transparency, aligned with applicable data
              protection regulations including{" "}
              <span className="highlight">GDPR principles</span>.
            </p>
          </section>

          <section id="dataCollection">
            <h2 className="section-title">What Data Do We Collect?</h2>
            <p>CineNiche collects the following types of personal data:</p>
            <ul>
              <li>
                <span className="highlight">Email address:</span> For account
                access and communication.
              </li>
              <li>
                <span className="highlight">Password:</span> Stored using
                industry-standard hashing techniques.
              </li>
              <li>
                <span className="highlight">Phone number:</span> Only if used
                for optional two-factor authentication.
              </li>
              <li>
                <span className="highlight">
                  Ratings and interaction history:
                </span>{" "}
                For personalized recommendations.
              </li>
              <li>
                <span className="highlight">
                  Device/browser info via cookies:
                </span>{" "}
                For usage analytics.
              </li>
            </ul>
          </section>

          <section id="dataCollectionMethod">
            <h2 className="section-title">How Do We Collect Your Data?</h2>
            <p>We collect data directly from you when you:</p>
            <ul>
              <li>Register for an account on CineNiche.</li>
              <li>Log in or update your profile.</li>
              <li>Rate or review a movie.</li>
              <li>Use or interact with features on the website.</li>
              <li>Opt in to communications or enable 2FA.</li>
            </ul>
            <p>
              We may also use cookies to passively collect usage data when you
              browse or use the CineNiche platform. We do not receive data from
              third-party sources or external marketing agencies.
            </p>
          </section>

          <section id="dataUsage">
            <h2 className="section-title">How Will We Use Your Data?</h2>
            <p>We use your data to:</p>
            <ul>
              <li>
                Authenticate your login and maintain secure access to your
                account.
              </li>
              <li>
                Personalize movie recommendations using machine learning
                algorithms.
              </li>
              <li>Enable rating, search, and filtering features.</li>
              <li>Improve and optimize platform performance.</li>
              <li>
                Notify you of account activity or optional feature changes.
              </li>
              <li>
                (Optional) Provide two-factor authentication via phone number.
              </li>
            </ul>
            <p>
              We do not share your personal data with any partner companies or
              third parties.
            </p>
          </section>

          <section id="dataStorage">
            <h2 className="section-title">How Do We Store Your Data?</h2>
            <p>
              Your data is securely stored in encrypted databases hosted on
              industry-standard cloud infrastructure. All passwords are hashed
              using ASP.NET Identity's recommended configuration, and sensitive
              operations are protected with HTTPS.
            </p>
            <p>
              We store user data for the duration of your active account. If
              your account becomes inactive for 12 months, or upon request, your
              personal data may be deleted within 30 days.
            </p>
          </section>

          <section id="marketing">
            <h2 className="section-title">Marketing</h2>
            <p>
              CineNiche does not currently engage in marketing communications or
              share your data for marketing purposes. If this ever changes in
              the future, we will request your explicit consent first.
            </p>
          </section>

          <section id="dataRights">
            <h2 className="section-title">
              What Are Your Data Protection Rights?
            </h2>
            <p>Every user is entitled to the following:</p>
            <ul>
              <li>
                <span className="highlight">Right to Access:</span> You can
                request copies of your personal data.
              </li>
              <li>
                <span className="highlight">Right to Rectification:</span> You
                can request correction of inaccurate or incomplete information.
              </li>
              <li>
                <span className="highlight">Right to Erasure:</span> You can
                request deletion of your personal data under certain conditions.
              </li>
              <li>
                <span className="highlight">Right to Restrict Processing:</span>{" "}
                You can request limitations on how we process your data.
              </li>
              <li>
                <span className="highlight">
                  Right to Object to Processing:
                </span>{" "}
                You can object to how your data is used under certain
                conditions.
              </li>
              <li>
                <span className="highlight">Right to Data Portability:</span>{" "}
                You can request a copy of your data transferred to another
                organization or to you.
              </li>
            </ul>
            <p>We have one month to respond to such requests.</p>
          </section>

          <section id="cookies">
            <h2 className="section-title">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device to collect
              standard internet log and visitor behavior information. When you
              visit CineNiche, we may collect information from you automatically
              through cookies. More info at:{" "}
              <a
                href="https://allaboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="highlight-link"
              >
                allaboutcookies.org
              </a>
            </p>
          </section>

          <section id="cookiesUsage">
            <h2 className="section-title">How Do We Use Cookies?</h2>
            <p>We use cookies to:</p>
            <ul>
              <li>Keep you signed in.</li>
              <li>Remember your preferences.</li>
              <li>Analyze usage to improve functionality.</li>
            </ul>
          </section>

          <section id="cookieTypes">
            <h2 className="section-title">What Types of Cookies Do We Use?</h2>
            <p>We use:</p>
            <ul>
              <li>
                <span className="highlight">Functionality Cookies:</span> Help
                recognize you and remember your settings.
              </li>
              <li>
                <span className="highlight">Analytics Cookies:</span> Help us
                understand how users interact with the site.
              </li>
            </ul>
            <p>We do not use advertising or third-party tracking cookies.</p>
          </section>

          <section id="cookieManagement">
            <h2 className="section-title">How to Manage Cookies</h2>
            <p>
              You can set your browser to not accept cookies. However, some
              features of the CineNiche site may not function properly as a
              result.
            </p>
          </section>

          <section id="thirdParty">
            <h2 className="section-title">
              Privacy Policies of Other Websites
            </h2>
            <p>
              CineNiche may link to third-party websites (e.g., IMDb or
              streaming platforms). Our policy applies only to CineNiche. If you
              click a link to another website, you should read their privacy
              policy.
            </p>
          </section>

          <section id="policyChanges">
            <h2 className="section-title">Changes to Our Privacy Policy</h2>
            <p>
              We keep this policy under regular review. This version was last
              updated on <span className="highlight">April 7, 2025</span>.
            </p>
          </section>

          <section id="contact">
            <h2 className="section-title">How to Contact Us</h2>
            <p>For any questions or data requests, please contact:</p>
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

          <section id="authority">
            <h2 className="section-title">
              How to Contact the Appropriate Authority
            </h2>
            <p>
              If you feel your data rights have not been addressed
              appropriately, you may file a complaint with a data protection
              authority in your jurisdiction.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

// Explore the PrivacyPage class
export default PrivacyPage;
