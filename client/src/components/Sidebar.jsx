import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isAdmin = false }) {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const isPremium = user?.isPremium;

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  if (isAdmin) {
    return (
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
        </button>
        <Link to="/dashboard" className="brand">
          <i className="fas fa-shield-alt" style={{color: '#ef4444'}}></i> {!isCollapsed && <span>Admin <span>Portal</span></span>}
        </Link>
        <ul className="nav-menu">
          <li className={`nav-item ${path === '/admin' ? 'active' : ''}`} title="Platform Health">
            <Link to="/admin"><i className="fas fa-server"></i> {!isCollapsed && "Platform Health"}</Link>
          </li>
          <li className="nav-item" title="Exit Admin">
            <Link to="/dashboard"><i className="fas fa-arrow-left"></i> {!isCollapsed && "Exit Admin"}</Link>
          </li>
        </ul>
      </aside>
    );
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
      </button>
      <Link to="/dashboard" className="brand">
        <i className="fas fa-bolt"></i> {!isCollapsed && <span>EVEase <span>SaaS</span></span>}
      </Link>
      <ul className="nav-menu">
        <li className={`nav-item ${path === '/dashboard' ? 'active' : ''}`} title="Overview">
          <Link to="/dashboard"><i className="fas fa-home"></i> {!isCollapsed && "Overview"}</Link>
        </li>
        {isPremium || user?.role === 'admin' ? (
          <li className={`nav-item ${path === '/ai-planner' ? 'active' : ''}`} title="AI Recommender">
            <Link to="/ai-planner"><i className="fas fa-robot"></i> {!isCollapsed && "AI Recommender"}</Link>
          </li>
        ) : (
          <li className="nav-item" title="AI Recommender (Premium)">
            <Link to="/subscription" style={{opacity: 0.7}}><i className="fas fa-lock"></i> {!isCollapsed && "AI Recommender"}</Link>
          </li>
        )}
        {isPremium ? (
          <li className={`nav-item ${path === '/assistant' ? 'active' : ''}`} title="EV.ai Consultant">
            <Link to="/assistant"><i className="fas fa-headset"></i> {!isCollapsed && "EV.ai Consultant"}</Link>
          </li>
        ) : (
          <li className="nav-item" title="EV.ai Consultant (Premium)">
            <Link to="/subscription" style={{opacity: 0.7}}><i className="fas fa-lock"></i> {!isCollapsed && "EV.ai Consultant"}</Link>
          </li>
        )}
        <li className={`nav-item ${path === '/manual-search' ? 'active' : ''}`} title="Manual Charger Search">
          <Link to="/manual-search"><i className="fas fa-search"></i> {!isCollapsed && "Manual Charger Search"}</Link>
        </li>
        <li className={`nav-item ${path === '/subscription' ? 'active' : ''}`} title="Subscription">
          <Link to="/subscription"><i className="fas fa-crown"></i> {!isCollapsed && "Subscription"}</Link>
        </li>
        <li className={`nav-item ${path === '/profile' ? 'active' : ''}`} title="Profile Credentials">
          <Link to="/profile"><i className="fas fa-user-circle"></i> {!isCollapsed && "Profile Credentials"}</Link>
        </li>
      </ul>
      
      {user && (
        <div className="user-profile">
          <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
          {!isCollapsed && (
            <div className="user-info-text fade-in">
              <p style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)'}}>{user.username}</p>
              <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{isPremium ? 'Premium Plan' : 'Free Plan'}</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
