import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);

  const runVulnerabilityScan = () => {
    setScanning(true);
    setScanResults(null);
    setTimeout(() => {
      setScanning(false);
      setScanResults([
        { id: 1, type: 'SQL Injection Attempt Blocked', ip: '192.168.1.45', severity: 'high', status: 'Mitigated' },
        { id: 2, type: 'Brute Force Login on /admin', ip: '45.33.22.11', severity: 'high', status: 'Blocked (Auto-Ban)' },
        { id: 3, type: 'Outdated JWT Token Signature', detail: 'User ID 8912', severity: 'low', status: 'Logged' }
      ]);
    }, 2000);
  };

  return (
    <div className="admin-layout">
      <Sidebar isAdmin={true} />

      <main className="main-content">
        <div className="header-actions">
          <div className="greeting">
            <h1>System Command Center</h1>
            <p>Monitor platform health, subscription tiers, and user vulnerabilities.</p>
          </div>
          <button onClick={logout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Terminate Session
          </button>
        </div>

        <div className="stats-grid admin-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}><i className="fas fa-users"></i></div>
            <div className="stat-value">14,029</div>
            <div className="stat-label">Total Free Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}><i className="fas fa-crown"></i></div>
            <div className="stat-value">3,492</div>
            <div className="stat-label">Premium Subscriptions</div>
          </div>
          <div className="stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <div className="stat-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}><i className="fas fa-exclamation-triangle"></i></div>
            <div className="stat-value">{scanResults ? scanResults.length : 2}</div>
            <div className="stat-label" style={{ color: '#ef4444' }}>Active Threats</div>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="panel admin-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Active Threat Monitoring</h3>
              <p style={{ color: 'var(--text-muted)' }}>Scan infrastructure for SQLi, XSS, and unauthorized JWT manipulation.</p>
            </div>
            <button className="btn btn-primary" onClick={runVulnerabilityScan} disabled={scanning} style={{ background: '#ef4444', color: 'white', padding: '1rem 2rem' }}>
              {scanning ? <><i className="fas fa-circle-notch fa-spin"></i> Scanning Infrastructure...</> : <><i className="fas fa-shield-virus"></i> Run Vulnerability Scan</>}
            </button>
          </div>

          {scanResults && (
            <div className="panel fade-in">
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Scan Report (Latest)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scanResults.map((res) => (
                  <div key={res.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', borderLeft: `4px solid ${res.severity === 'high' ? '#ef4444' : '#f59e0b'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>{res.type}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{res.ip || res.detail}</p>
                    </div>
                    <span style={{ padding: '0.5rem 1rem', background: res.status === 'Mitigated' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: res.status === 'Mitigated' ? '#10b981' : '#ef4444', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

