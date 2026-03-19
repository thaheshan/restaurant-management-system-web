import React, { useState } from 'react';
import './Login.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-left__overlay" />
        <div className="login-left__brand">
          <span className="brand-icon">🍽</span>
          <span className="brand-name">DineSmart</span>
        </div>
        <div className="login-left__tagline">
          <h2>Smart Kitchen.<br />Zero Waste.<br />Full Compliance.</h2>
          <p>Your all-in-one restaurant management platform.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card__header">
            <div className="login-card__logo">
              <span>DS</span>
            </div>
            <h1>Welcome Back!</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
                <a href="#" className="forgot-link">Forgot password?</a>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className={`btn-login ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Log In</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <a href="#">Contact your admin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
