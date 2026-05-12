import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // We can reuse Login.css since the layout is identical

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (username && password && email) {
      // Auto-login the user after registration
      login(username); 
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <Link to="/" className="home-link">
        <i className="fas fa-arrow-left"></i> Back to Platform
      </Link>

      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-left-content">
            <div className="brand"><i className="fas fa-bolt"></i> EVEase <span>SaaS</span></div>
            <h1 style={{ fontSize: '3rem' }}>Join the <br/>Network</h1>
            <p>Create an account to discover high-speed chargers and unlock agentic routing capabilities.</p>
            
            <ul className="feature-list">
              <li className="feature-item"><i className="fas fa-map-marked-alt"></i> Nationwide Discovery</li>
              <li className="feature-item"><i className="fas fa-bolt"></i> Instant Reservations</li>
              <li className="feature-item"><i className="fas fa-robot"></i> AI-Powered Assistance</li>
            </ul>
          </div>
        </div>

        <div className="login-right">
          <div className="login-header">
            <h2>Create Account</h2>
            <p>Enter your details to get started</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <i className="fas fa-envelope form-icon"></i>
            </div>

            <div className="form-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                autocomplete="off"
              />
              <i className="fas fa-user form-icon"></i>
            </div>

            <div className="form-group">
              <input 
                type="password" 
                className="form-control" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <i className="fas fa-lock form-icon"></i>
            </div>

            <button type="submit" className="btn-submit">Create Free Account</button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
