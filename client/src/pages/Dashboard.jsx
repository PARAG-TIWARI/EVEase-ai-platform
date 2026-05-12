import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isPremium = user?.isPremium || user?.role === 'admin';

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="header-actions">
          <div className="greeting">
            <h1>Welcome back, {user?.username}</h1>
            <p>System status: <span style={{color: 'var(--primary)'}}>All nodes nominal</span></p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={toggleTheme} className="icon-btn" style={{ width: '40px', height: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50%', color: 'var(--text-main)' }}>
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-charging-station"></i></div>
            <div className="stat-value">1,204</div>
            <div className="stat-label">Network Stations</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: 'var(--secondary)', background: 'rgba(99, 102, 241, 0.1)' }}><i className="fas fa-calendar-check"></i></div>
            <div className="stat-value">12</div>
            <div className="stat-label">Total Orchestrations</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}><i className="fas fa-bolt"></i></div>
            <div className="stat-value">99.9%</div>
            <div className="stat-label">System Uptime</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>Recent Orchestrations</h3>
              <Link to="/dashboard" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>View All</Link>
            </div>

            <div className="booking-item">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="booking-icon">
                  <i className="fas fa-plug"></i>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>ABC Charging Station</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <i className="fas fa-map-marker-alt"></i> Thiruvananthapuram
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge-success" style={{ marginBottom: '0.5rem' }}>Confirmed</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Oct 26, 2024 at 14:48</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Quick Actions</h3>
            </div>
            
            {isPremium ? (
              <Link to="/ai-planner" className="action-btn">
                <span><i className="fas fa-robot"></i> Agentic AI Recommender</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            ) : (
              <div className="action-btn" style={{ background: 'rgba(15, 23, 42, 0.8)', color: 'var(--text-muted)', border: '1px dashed var(--border)', cursor: 'default' }}>
                <span><i className="fas fa-lock"></i> Agentic AI Recommender (Premium)</span>
              </div>
            )}

            <button className="action-btn action-nearby">
              <span><i className="fas fa-location-arrow"></i> Nearby Live Chargers</span>
              <i className="fas fa-arrow-right"></i>
            </button>

            <Link to="/manual-search" className="action-btn secondary">
              <span><i className="fas fa-search"></i> Manual Search</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

