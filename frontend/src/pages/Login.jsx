import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackMsg("");

    const res = await api.login({ email, password });
    setLoading(false);

    if (res.success) {
      setAuthenticatedUser({
        name: isRegister ? name || "VIP Member" : "Executive Client",
        email: email || "client@drivingforcemotors.com"
      });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setFeedbackMsg("Password reset protocol initiated. An encrypted token has been dispatched to your email address.");
  };

  return (
    <div className="login-page" id="login-view">
      <div className="login-backdrop">
        <div className="login-glow-orb"></div>
      </div>

      <div className="container login-container">
        <div className="login-card glass-panel-glow">
          {/* Card Brand Header */}
          <div className="login-header">
            <Link to="/" className="dfm-brand-logo login-logo">
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

            <h2 className="login-title">
              {isRegister ? "Create VIP Account" : "Client Portal Sign In"}
            </h2>
            <p className="login-subtitle">
              {isRegister
                ? "Gain priority allocations, bespoke pricing quotes, and private trackday invitations."
                : "Access your test drive reservations, vehicle orders, and concierge messaging."}
            </p>
          </div>

          {/* Prototype Notice Banner */}
          <div className="demo-notice-banner">
            <span className="notice-icon">ℹ️</span>
            <span>Client Authentication UI preview. No backend credentials required to test.</span>
          </div>

          {feedbackMsg && (
            <div className="login-feedback-alert">
              <span>{feedbackMsg}</span>
            </div>
          )}

          {authenticatedUser ? (
            <div className="auth-success-screen">
              <div className="auth-check-icon">✓</div>
              <h3>Welcome, {authenticatedUser.name}</h3>
              <p>You have signed in to the DrivingForce VIP Client Portal.</p>
              <div className="auth-user-tag">{authenticatedUser.email}</div>
              <div className="auth-redirect-actions">
                <Button to="/vehicles" variant="primary" size="md">
                  View Available Inventory
                </Button>
                <Button to="/test-drive" variant="outline" size="md">
                  Book A Test Drive
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAuthenticatedUser(null);
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              {/* Name if register */}
              {isRegister && (
                <div className="form-group">
                  <label htmlFor="auth-name">Full Name *</label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="e.g. Sterling Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label htmlFor="auth-email">Email Address *</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="auth-password">Password *</label>
                  {!isRegister && (
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="password-input-wrap">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="remember-me-row">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Remember this secure workstation for 30 days</span>
                </label>
              </div>

              {/* Primary Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
                id="btn-auth-submit"
              >
                {loading
                  ? "Authenticating..."
                  : isRegister
                  ? "Create VIP Account"
                  : "Sign In to Portal"}
              </Button>

              {/* Toggle Register / Sign In */}
              <div className="auth-toggle-footer">
                {isRegister ? (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="switch-mode-btn"
                      onClick={() => setIsRegister(false)}
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p>
                    New to DrivingForce Motors?{" "}
                    <button
                      type="button"
                      className="switch-mode-btn"
                      onClick={() => setIsRegister(true)}
                    >
                      Create Account
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
