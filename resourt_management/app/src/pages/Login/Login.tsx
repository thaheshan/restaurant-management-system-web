import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/menu');
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
          <h1 className="login-form__title">Welcome !</h1>
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
            />
          </div>

          <button type="submit" className="login-form__button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
