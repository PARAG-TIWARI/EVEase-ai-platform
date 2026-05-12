import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomSelect from '../components/CustomSelect';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('free');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      login(username, role); 
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const roleOptions = [
    { value: 'free', label: 'Standard User (Free)' },
    { value: 'premium', label: 'Elite Orchestrator (Premium)' },
    { value: 'admin', label: 'System Administrator' }
  ];

  return (
    <div className="login-page">
      <Link to="/" className="home-link">
        <i className="fas fa-arrow-left"></i> Back to Platform
      </Link>

      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-left-content">
            <div className="brand"><i className="fas fa-bolt"></i> EVEase <span>SaaS</span></div>
            <h1>Welcome <br/>Back</h1>
            <p>Sign in to orchestrate your EV fleet, access AI routing, and manage your instantaneous charging slots.</p>
            
            <ul className="feature-list">
              <li className="feature-item"><i className="fas fa-robot"></i> Agentic AI Recommendations</li>
              <li className="feature-item"><i className="fas fa-bolt"></i> Live Port Availability</li>
              <li className="feature-item"><i className="fas fa-chart-line"></i> Advanced Analytics</li>
            </ul>
          </div>
        </div>

        <div className="login-right">
          <div className="login-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ zIndex: 60 }}>
              <CustomSelect 
                options={roleOptions}
                value={role}
                onChange={setRole}
                icon="fas fa-user-tag"
              />
            </div>

            <div className="form-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
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

            <button type="submit" className="btn-submit">Sign In to Dashboard</button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
