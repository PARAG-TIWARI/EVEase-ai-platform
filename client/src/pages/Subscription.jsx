import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Subscription.css';

export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // In a real app, this would integrate Stripe/Checkout
    alert("This would redirect to Stripe Checkout. Try logging in with the username 'premium' to test Premium features!");
    navigate('/dashboard');
  };

  return (
    <>
      <nav className="navbar fade-in">
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand">
          <i className="fas fa-bolt" style={{ color: 'var(--primary)' }}></i> EVEase <span>SaaS</span>
        </Link>
        <Link to={user ? "/dashboard" : "/"} className="btn-outline">
          <i className="fas fa-arrow-left"></i> Back to {user ? "Dashboard" : "Platform"}
        </Link>
      </nav>

      <div className="pricing-container fade-in">
        <div className="pricing-header">
          <div className="ai-badge"><i className="fas fa-crown"></i> Upgrade Your Ride</div>
          <h1>Unlock Agentic <span>Intelligence</span></h1>
          <p>Supercharge your EV experience with real-time AI routing, predictive load analysis, and 24/7 dedicated vehicle assistance.</p>
        </div>

        <div className="pricing-grid">
          {/* FREE TIER */}
          <div className="pricing-card">
            <h3>Standard Driver</h3>
            <div className="price">
              <h2>$0</h2>
              <span>/month</span>
            </div>
            <p className="tier-desc">Basic tools for everyday charging.</p>
            
            <ul className="tier-features">
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> Standard Map Access</li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> Manual Station Search</li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> Basic Dashboard</li>
              <li className="disabled"><i className="fas fa-lock"></i> Agentic AI Routing</li>
              <li className="disabled"><i className="fas fa-lock"></i> Priority Reservations</li>
              <li className="disabled"><i className="fas fa-lock"></i> EV.ai Consultant</li>
            </ul>
            
            <button className="btn-tier secondary-tier" disabled>Current Plan</button>
          </div>

          {/* PREMIUM TIER */}
          <div className="pricing-card premium-card">
            <div className="popular-badge glitch-hover">Most Popular</div>
            <h3>Premium Orchestrator</h3>
            <div className="price">
              <h2>$14<span style={{fontSize: '1rem'}}>.99</span></h2>
              <span>/month</span>
            </div>
            <p className="tier-desc">Full access to the EV.ai engine.</p>
            
            <ul className="tier-features">
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> Standard Map Access</li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> Manual Station Search</li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> Advanced Analytics Dashboard</li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> <strong>Agentic AI Routing</strong></li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> 1-Click Priority Reservations</li>
              <li><i className="fas fa-check" style={{color: 'var(--primary)'}}></i> <strong>24/7 EV.ai Consultant Access</strong></li>
            </ul>
            
            <button className="btn-tier primary-tier" onClick={handleUpgrade}>
              Upgrade to Premium
            </button>
          </div>

          {/* ELITE TIER */}
          <div className="pricing-card">
            <h3 style={{color: '#fbbf24'}}><i className="fas fa-crown"></i> Elite Fleet</h3>
            <div className="price">
              <h2>$49<span style={{fontSize: '1rem'}}>.99</span></h2>
              <span>/month</span>
            </div>
            <p className="tier-desc">Enterprise solutions & fleet management.</p>
            
            <ul className="tier-features">
              <li><i className="fas fa-check" style={{color: '#fbbf24'}}></i> All Premium Features</li>
              <li><i className="fas fa-check" style={{color: '#fbbf24'}}></i> Fleet Tracking (Up to 10 vehicles)</li>
              <li><i className="fas fa-check" style={{color: '#fbbf24'}}></i> Custom API Access</li>
              <li><i className="fas fa-check" style={{color: '#fbbf24'}}></i> Dedicated Account Manager</li>
              <li><i className="fas fa-check" style={{color: '#fbbf24'}}></i> Hardware Integration</li>
              <li><i className="fas fa-check" style={{color: '#fbbf24'}}></i> White-glove Onboarding</li>
            </ul>
            
            <button className="btn-tier secondary-tier" onClick={() => alert("Elite tier coming soon!")}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
