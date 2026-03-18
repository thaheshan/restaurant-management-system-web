'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Login.scss';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === 'admin@dinesmart.com' && password === 'admin123') {
        localStorage.setItem(
          'adminSession',
          JSON.stringify({
            id: 'admin-001',
            email,
            name: 'Chef Michael',
            restaurantId: 'rest-001',
          })
        );
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-page__image-panel">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1200&fit=crop"
          alt="Delicious food spread"
          className="login-page__hero-image"
        />
        <div className="login-page__image-overlay" />
      </div>

      <div className="login-page__form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-form__title">Welcome!</h1>
          <p className="login-form__subtitle">
            Enter your Credentials to access your account
          </p>

          <div className="login-form__field">
            <label htmlFor="email" className="login-form__label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="login-form__input"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-form__field">
            <label htmlFor="password" className="login-form__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="login-form__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '12px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-form__button"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;