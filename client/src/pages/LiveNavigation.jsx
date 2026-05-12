import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './LiveNavigation.css';

export default function LiveNavigation() {
  const location = useLocation();
  const recommendedStation = location.state?.station || "EVEase Supercharger HQ";
  
  const [eta, setEta] = useState(14); // Mock 14 mins
  const [distance, setDistance] = useState(4.2); // Mock 4.2 km
  const [isReserved, setIsReserved] = useState(false);
  const navigate = useNavigate();

  // Simulate active driving countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => prev > 0 ? prev - 1 : 0);
      setDistance(prev => prev > 0 ? (prev - 0.3).toFixed(1) : 0);
    }, 60000); // every minute
    return () => clearInterval(timer);
  }, []);

  const handleReservation = () => {
    setIsReserved(true);
    alert(`Port 2 successfully reserved at ${recommendedStation}! Priority slot held for 30 minutes.`);
  };

  return (
    <div className="live-nav-layout">
      {/* Absolute Header Overlay */}
      <div className="nav-header-overlay">
        <Link to="/ai-planner" className="btn btn-outline" style={{ background: 'var(--bg-dark)' }}>
          <i className="fas fa-times"></i> End Route
        </Link>
        <div className="nav-status-badge glitch-hover">
          <div className="live-dot"></div> Live Telematics Active
        </div>
      </div>

      {/* Real Live Google Map Dashboard Background */}
      <div className="map-background" style={{ zIndex: 0 }}>
        <iframe 
          src={`https://maps.google.com/maps?q=${encodeURIComponent(recommendedStation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          width="100%" 
          height="100%" 
          style={{ border: 0, filter: 'brightness(0.8) contrast(1.2)' }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(11, 15, 25, 0.4)', pointerEvents: 'none' }}></div>
      </div>

      {/* Navigation Dashboard Panel */}
      <div className="nav-dashboard-panel fade-in">
        <div className="nav-primary-stats">
          <div className="nav-eta">
            <h1>{eta} <span>min</span></h1>
            <p>{distance} km remaining</p>
          </div>
          <div className="nav-destination-info">
            <h3><i className="fas fa-flag-checkered" style={{color: 'var(--primary)'}}></i> {recommendedStation}</h3>
            <p>Arriving at 14:30 • {isReserved ? <span style={{color:'#10b981', fontWeight: 600}}><i className="fas fa-check-circle"></i> Slot Reserved</span> : '4 Ultra-Fast Ports Available'}</p>
          </div>
        </div>

        <div className="nav-secondary-stats">
          <div className="nav-stat">
            <i className="fas fa-battery-half"></i>
            <div>
              <p>Predicted SoC on Arrival</p>
              <h4>14%</h4>
            </div>
          </div>
          <div className="nav-stat">
            <i className="fas fa-temperature-low"></i>
            <div>
              <p>Battery Preconditioning</p>
              <h4 style={{color: 'var(--secondary)'}}>Active</h4>
            </div>
          </div>
          <div className="nav-stat">
            <i className="fas fa-bolt"></i>
            <div>
              <p>Auto-Pay Authorized</p>
              <h4>Yes</h4>
            </div>
          </div>
        </div>
        
        {!isReserved ? (
          <button className="btn btn-primary" onClick={handleReservation} style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.1rem' }}>
            <i className="fas fa-parking"></i> Auto-Reserve Port 2 Now
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate('/active-charging', { state: { station: recommendedStation }})} style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.1rem', background: '#3b82f6', color: 'white' }}>
            <i className="fas fa-plug"></i> Arrived? Start Charging Session
          </button>
        )}
      </div>
    </div>
  );
}
