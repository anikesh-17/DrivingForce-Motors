import { Link } from "react-router-dom";
import { dealershipInfo } from "../data/mockVehicles";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dfm-footer">
      <div className="container footer-content-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="dfm-brand-logo footer-logo">
            <div className="logo-icon-wrap">
              <svg viewBox="0 0 24 24" className="logo-svg" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
                <circle cx="7.5" cy="14.5" r="1.5" />
                <circle cx="16.5" cy="14.5" r="1.5" />
              </svg>
              <span className="logo-accent-dot"></span>
            </div>
            <div className="logo-text-group">
              <span className="logo-title">DrivingForce</span>
              <span className="logo-sub">MOTORS</span>
            </div>
          </Link>
          <p className="footer-tagline">
            Curating the world’s most formidable automotive machinery. Precision, provenance, and uncompromising performance.
          </p>
          <div className="social-links-row">
            <a href="#instagram" aria-label="Instagram" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#youtube" aria-label="YouTube" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="#twitter" aria-label="X / Twitter" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
            </a>
            <a href="#linkedin" aria-label="LinkedIn" className="social-icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        {/* Quick Navigation Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/vehicles">Vehicle Inventory</Link></li>
            <li><Link to="/about">About DrivingForce</Link></li>
            <li><Link to="/test-drive">Schedule Test Drive</Link></li>
            <li><Link to="/contact">Contact & Showrooms</Link></li>
            <li><Link to="/login">VIP Client Portal</Link></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Vehicle Classes</h4>
          <ul className="footer-links-list">
            <li><Link to="/vehicles?category=Electric">All-Electric Vehicles</Link></li>
            <li><Link to="/vehicles?category=Coupe">High-Performance Coupes</Link></li>
            <li><Link to="/vehicles?category=Sedan">Executive Sports Sedans</Link></li>
            <li><Link to="/vehicles?category=SUV">Luxury All-Terrain SUVs</Link></li>
            <li><Link to="/vehicles?category=Hybrid">High-Performance Hybrids</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-col">
          <h4 className="footer-col-title">Concierge & Hub</h4>
          <div className="footer-contact-items">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span className="contact-text">{dealershipInfo.address}</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span className="contact-text">{dealershipInfo.phoneFormatted}</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <span className="contact-text">{dealershipInfo.email}</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">⏱️</span>
              <span className="contact-text">Mon–Sat: 9AM – 8PM | Sun: 11AM – 5PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-inner">
          <p className="copyright-text">
            © {currentYear} DrivingForce Motors LLC. All rights reserved. Precision Automotive Architecture.
          </p>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="dot-divider">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="dot-divider">•</span>
            <a href="#salesforce">Salesforce CRM Integration Ready</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
