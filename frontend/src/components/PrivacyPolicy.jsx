import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const pageStyle = {
    backgroundColor: "#27001a",
    color: "white",
    minHeight: "100vh",
    padding: "50px 8vw",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    lineHeight: "1.8",
  };

  const containerStyle = {
    maxWidth: "960px",
    margin: "0 auto",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(173,149,81,0.3)",
    borderRadius: "12px",
    padding: "50px 55px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  };

  const titleStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "34px",
    color: "#d4be82",
    marginBottom: "8px",
    textAlign: "center",
    letterSpacing: "1px",
  };

  const subTitleStyle = {
    fontSize: "14px",
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginBottom: "35px",
    borderBottom: "1px solid rgba(212,190,130,0.2)",
    paddingBottom: "20px",
  };

  const sectionHeading = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "18px",
    color: "#ad9551",
    marginTop: "30px",
    marginBottom: "10px",
  };

  const subHeading = {
    fontSize: "15px",
    color: "#d4be82",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: "600",
  };

  const para = {
    fontSize: "14px",
    color: "rgba(255,255,255,0.82)",
    marginBottom: "14px",
    textAlign: "justify",
  };

  const listStyle = {
    fontSize: "14px",
    color: "rgba(255,255,255,0.82)",
    marginBottom: "14px",
    paddingLeft: "20px",
    lineHeight: "1.9",
  };

  const divider = {
    borderColor: "rgba(173,149,81,0.2)",
    margin: "25px 0",
  };

  const backTop = {
    display: "inline-block",
    fontSize: "12px",
    color: "#d4be82",
    cursor: "pointer",
    marginTop: "6px",
    marginBottom: "20px",
    letterSpacing: "0.3px",
  };

  const callout = {
    backgroundColor: "rgba(173,149,81,0.08)",
    border: "1px solid rgba(173,149,81,0.3)",
    borderRadius: "6px",
    padding: "14px 18px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
    marginBottom: "18px",
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>

        <h1 style={titleStyle}>Privacy Policy</h1>
        <p style={subTitleStyle}>
          Bencham Jewellers understands that our users care about their personal data and how it is collected, used, shared, and protected.
          <br />
          <span style={{ fontSize: "12px" }}>Last Updated: August 2026</span>
        </p>

        <div style={callout}>
          PLEASE READ THIS PRIVACY POLICY CAREFULLY. BY CREATING AN ACCOUNT OR USING THIS SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THE TERMS OF THIS PRIVACY POLICY AND THAT YOU AGREE AND CONSENT TO THE COLLECTION, USE, DISCLOSURE, STORAGE, AND PROCESSING OF YOUR PERSONAL DATA AS DESCRIBED HEREIN.
        </div>

        {/* 1 */}
        <h2 style={sectionHeading}>1. INTRODUCTION</h2>
        <p style={para}>
          Data protection is a matter of trust and your privacy is important to us. This Privacy Policy explains how <strong>Bencham Jewellers</strong> ("we", "us", "our", or "Bencham") collects, uses, shares, and protects information in connection with your use of our website and services (the "Platform"). This Privacy Policy applies regardless of the device type you use to access our Services.
        </p>

        <p style={para}>
          We may update this Privacy Policy from time to time in response to changing legal, technical, or business developments. We will notify you of significant changes by posting an amended Privacy Policy on the Platform. Your continued use of the Platform following such updates constitutes your acceptance of the revised policy.
        </p>

        <hr style={divider} />

        {/* 2 */}
        <h2 style={sectionHeading}>2. PERSONAL DATA WE COLLECT</h2>

        <h3 style={subHeading}>A. DATA YOU PROVIDE TO US</h3>
        <p style={para}>Depending on your use of our Platform, we may collect the following categories of personal data:</p>
        <ul style={listStyle}>
          <li><strong>Identity &amp; Profile Data:</strong> Your name, username, password, email address, telephone number, and country.</li>
          <li><strong>Account &amp; Transaction Data:</strong> Delivery/billing address, payment details, order history, product purchases, and payment confirmations.</li>
          <li><strong>Marketing &amp; Communication Data:</strong> Your preferences, survey responses, feedback, and communication history with our support team.</li>
          <li><strong>Location Data:</strong> Used for delivery tracking and estimating delivery timelines.</li>
          <li><strong>Review &amp; Feedback Content:</strong> Star ratings and written reviews you submit for delivered gemstone products.</li>
        </ul>

        <h3 style={subHeading}>B. DATA COLLECTED AUTOMATICALLY</h3>
        <p style={para}>
          When you access our Platform, our servers automatically record data including your IP address, browser type, device type, operating system, pages visited, session duration, and interaction patterns. This data is used to improve our website performance and personalize your experience.
        </p>
        <p style={para}>
          We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze site traffic. You may manage cookie settings through your browser; however, disabling certain cookies may limit the functionality of the Platform.
        </p>

        <hr style={divider} />

        {/* 3 */}
        <h2 style={sectionHeading}>3. HOW WE USE YOUR PERSONAL DATA</h2>

        <h3 style={subHeading}>A. ORDER FULFILLMENT &amp; ACCOUNT MANAGEMENT</h3>
        <ul style={listStyle}>
          <li>To process and confirm your gemstone jewelry orders.</li>
          <li>To arrange delivery of purchased products to your provided address.</li>
          <li>To send order status updates, dispatch notifications, and delivery confirmations via email or SMS.</li>
          <li>To manage your account, handle returns, and resolve customer support queries.</li>
        </ul>

        <h3 style={subHeading}>B. COMMUNICATIONS &amp; MARKETING</h3>
        <ul style={listStyle}>
          <li>To send promotional offers, new collection announcements, and exclusive gemstone deals.</li>
          <li>To respond to your queries, complaints, and feedback submitted through the Platform.</li>
          <li>To conduct customer satisfaction surveys to improve our services.</li>
        </ul>
        <p style={para}>You may unsubscribe from marketing communications at any time via your account settings or the unsubscribe link in any marketing email.</p>

        <h3 style={subHeading}>C. LEGAL &amp; COMPLIANCE PURPOSES</h3>
        <ul style={listStyle}>
          <li>To verify your identity and detect fraud or unauthorized account activity.</li>
          <li>To comply with applicable Sri Lankan laws, regulations, and lawful government requests.</li>
          <li>To maintain records as required by law.</li>
        </ul>

        <h3 style={subHeading}>D. ANALYTICS &amp; PLATFORM IMPROVEMENT</h3>
        <ul style={listStyle}>
          <li>To analyze user behavior and preferences to improve our gemstone product listings and website experience.</li>
          <li>To conduct research, testing, and performance monitoring of the Platform.</li>
        </ul>

        <hr style={divider} />

        {/* 4 */}
        <h2 style={sectionHeading}>4. WHO WE SHARE YOUR DATA WITH</h2>
        <p style={para}>We may share your personal data with the following parties for the purposes described in this policy:</p>
        <ul style={listStyle}>
          <li><strong>Delivery &amp; Logistics Partners:</strong> To arrange shipping and delivery of your purchased jewelry.</li>
          <li><strong>Payment Service Providers:</strong> To securely process payment transactions.</li>
          <li><strong>Email &amp; SMS Service Providers:</strong> To send order confirmations, shipping notifications, and promotional communications.</li>
          <li><strong>Law Enforcement &amp; Regulatory Authorities:</strong> When required by applicable Sri Lankan law or court order.</li>
          <li><strong>IT &amp; Hosting Service Providers:</strong> For website hosting, data storage, and technical support.</li>
        </ul>
        <p style={para}>
          We require all third parties to respect the security of your personal data and to treat it in accordance with applicable data protection laws. We do not sell your personal data to third parties.
        </p>

        <hr style={divider} />

        {/* 5 */}
        <h2 style={sectionHeading}>5. SECURITY OF YOUR PERSONAL DATA</h2>
        <p style={para}>
          To safeguard your personal data from unauthorized access, use, or disclosure, Bencham Jewellers implements appropriate administrative, physical, and technical security measures including:
        </p>
        <ul style={listStyle}>
          <li>Restricting access to personal data to authorized personnel only.</li>
          <li>Using TLS encryption technology for all payment and financial transactions.</li>
          <li>Implementing regular security audits and system monitoring.</li>
          <li>Securely hashing all user passwords — they are never stored in plain text.</li>
        </ul>
        <p style={para}>
          While we take every reasonable step to protect your data, no transmission over the Internet is completely secure. You are also responsible for keeping your account password confidential and not sharing it with any third party.
        </p>

        <hr style={divider} />

        {/* 6 */}
        <h2 style={sectionHeading}>6. RETENTION OF PERSONAL DATA</h2>
        <p style={para}>
          We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the satisfaction of any legal, accounting, or reporting requirements. When your personal data is no longer needed, we will securely dispose of it or anonymize it.
        </p>
        <span style={backTop} onClick={scrollToTop}>&#8593; Back to Top</span>

        <hr style={divider} />

        {/* 7 */}
        <h2 style={sectionHeading}>7. YOUR RIGHTS</h2>
        <p style={para}>Under applicable Sri Lankan data protection laws, you have the right to:</p>
        <ul style={listStyle}>
          <li><strong>Access</strong> the personal data we hold about you.</li>
          <li><strong>Correct</strong> any inaccurate or incomplete personal data.</li>
          <li><strong>Withdraw consent</strong> to our processing of your personal data (subject to legal limitations).</li>
          <li><strong>Request deletion</strong> of your personal data, where applicable by law.</li>
        </ul>
        <p style={para}>
          To exercise any of these rights, please visit your account settings or contact us at our{" "}
          <Link to="/contact" style={{ color: "#d4be82", textDecoration: "underline" }}>Contact Us</Link> page.
        </p>

        <hr style={divider} />

        {/* 8 */}
        <h2 style={sectionHeading}>8. MINORS</h2>
        <p style={para}>
          Bencham Jewellers does not knowingly collect personal data from individuals under the age of 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can take appropriate action.
        </p>

        <hr style={divider} />

        {/* 9 */}
        <h2 style={sectionHeading}>9. THIRD PARTY LINKS</h2>
        <p style={para}>
          Our Platform may contain links to external websites, social media pages, or payment gateways. We are not responsible for the privacy practices of those third-party websites. We encourage you to review their privacy policies before providing any personal information.
        </p>
        <span style={backTop} onClick={scrollToTop}>&#8593; Back to Top</span>

        <hr style={divider} />

        {/* 10 */}
        <h2 style={sectionHeading}>10. CONTACT US</h2>
        <p style={para}>
          If you have questions, concerns, or complaints about our privacy practices, or wish to exercise your rights, please contact us via our{" "}
          <Link to="/contact" style={{ color: "#d4be82", textDecoration: "underline" }}>Contact Us</Link> page. We will respond to your request within a reasonable timeframe.
        </p>

        <div style={{ textAlign: "center", marginTop: "35px", paddingTop: "20px", borderTop: "1px solid rgba(173,149,81,0.2)", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
          &copy; 2026 Bencham Jewellers. All Rights Reserved. &nbsp;|&nbsp;
          <Link to="/terms" style={{ color: "rgba(173,149,81,0.6)", textDecoration: "none" }}>Terms &amp; Conditions</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

