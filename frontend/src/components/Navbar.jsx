import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "./Button";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`dfm-navbar-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container dfm-navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="dfm-brand-logo" id="brand-logo">
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

        {/* Desktop Navigation Links */}
        <nav className="dfm-nav-desktop" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
            Home
          </NavLink>
          <NavLink to="/vehicles" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Vehicles
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Contact
          </NavLink>
        </nav>

        {/* Desktop CTAs */}
        <div className="dfm-nav-actions">
          <Button to="/test-drive" variant="primary" size="sm" id="nav-btn-test-drive">
            Book Test Drive
          </Button>
          <Button to="/login" variant="outline" size="sm" id="nav-btn-login">
            Login
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            className={`mobile-toggle-btn ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-nav-toggle"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`dfm-mobile-drawer ${mobileMenuOpen ? "is-active" : ""}`}>
        <nav className="mobile-nav-links">
          <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`} end>
            Home
          </NavLink>
          <NavLink to="/vehicles" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
            Vehicles
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
            Contact
          </NavLink>
          <div className="mobile-actions-divider"></div>
          <div className="mobile-action-buttons">
            <Button to="/test-drive" variant="primary" size="md" className="w-full">
              Book Test Drive
            </Button>
            <Button to="/login" variant="outline" size="md" className="w-full">
              Login
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
