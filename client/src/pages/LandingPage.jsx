import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './LandingPage.css';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  
  // Parallax state for 3D Map
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to 10 deg
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ perspective: '1200px' }}>
      <nav className="navbar fade-in">
        <div className="navbar-brand">
          <i className="fas fa-bolt" style={{ color: 'var(--primary)' }}></i>
          EVEase <span>SaaS</span>
        </div>
        <div className="nav-links">
          <Link to="/">Platform</Link>
          <Link to="/subscription">Enterprise</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-primary glitch-hover">Access Dashboard</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </nav>

      <section className="hero split-hero">
        <div className="hero-text-content">
          <div className="ai-badge">
            <i className="fas fa-sparkles"></i> The #1 Network for EV Drivers
          </div>
          <h1>Smart EV Charging <span>Infrastructure</span></h1>
          <p>The premium SaaS platform for discovering nearby stations, predicting availability, and reserving your charging slots instantly.</p>
          
          <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
            <Link to="/login" className="btn btn-main">
              Start Free Trial <i className="fas fa-arrow-right"></i>
            </Link>
            <Link to="/contact" className="btn btn-ai">
              <i className="fas fa-headset"></i> Contact Sales
            </Link>
          </div>
        </div>

        <div className="hero-3d-visual">
          <div 
            className="iso-grid-container"
            style={{
              transform: `rotateX(${60 + mousePos.y}deg) rotateZ(${-45 + mousePos.x}deg)`
            }}
          >
            <div className="iso-grid"></div>
            
            {/* 3D Pillars / Nodes */}
            <div className="iso-node n1" style={{ top: '20%', left: '20%' }}>
              <div className="node-pulse"></div>
              <div className="node-pillar"></div>
              <div className="node-label">Alpha Hub</div>
            </div>
            
            <div className="iso-node n2" style={{ top: '70%', left: '30%' }}>
              <div className="node-pulse"></div>
              <div className="node-pillar"></div>
              <div className="node-label">Nexus Port</div>
            </div>

            <div className="iso-node n3 active" style={{ top: '40%', left: '80%' }}>
              <div className="node-pulse active"></div>
              <div className="node-pillar active"></div>
              <div className="node-label active">Target 150kW</div>
            </div>

            {/* Simulated SVG Route Lines */}
            <svg className="iso-route-lines" viewBox="0 0 400 400">
              <path d="M 80,80 L 120,280 L 320,160" className="route-path" />
              <circle cx="80" cy="80" r="4" className="route-point" />
              <circle cx="120" cy="280" r="4" className="route-point" />
              <circle cx="320" cy="160" r="4" className="route-point active" />
              
              {/* Traveling Car Dot */}
              <circle cx="0" cy="0" r="6" className="travel-dot">
                <animateMotion dur="4s" repeatCount="indefinite" path="M 80,80 L 120,280 L 320,160" />
              </circle>
            </svg>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Enterprise-Grade Features</h2>
          <p>Everything you need to orchestrate and manage your EV charging experience efficiently.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-map-marked-alt"></i></div>
            <h3>Precision Mapping</h3>
            <p>Discover high-power charging stations with real-time mapping integration and ultra-accurate distance calculation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ color: 'var(--secondary)', background: 'var(--glass-light)' }}><i className="fas fa-robot"></i></div>
            <h3>Agentic AI Routing</h3>
            <p>Unlock our intelligent agent (Premium Feature) to analyze your battery, traffic, and station loads for the perfect charging stop.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fas fa-calendar-check"></i></div>
            <h3>Instant Reservations</h3>
            <p>Secure your charging slot before you arrive. Guarantee availability and avoid wait times with 1-click bookings.</p>
          </div>
        </div>
      </section>

      <section className="demo-showcase">
        <div className="section-header">
          <h2>The Complete EV Ecosystem</h2>
          <p>Experience the power of real-time telematics and intelligent orchestration.</p>
        </div>
        
        <div className="showcase-bento-grid">
          <div className="bento-card col-span-2 row-span-2 main-bento">
             <div className="bento-content">
               <div className="bento-badge"><i className="fas fa-robot"></i> Agentic AI Planner</div>
               <h3>Intelligent Route Orchestration</h3>
               <p>Our AI analyzes topography, traffic, and charger wait times to build the perfect route. It dynamically scores stations based on real-time hardware availability.</p>
               <Link to="/login" className="btn-outline" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Try AI Planner <i className="fas fa-arrow-right"></i></Link>
             </div>
             
             {/* Rich Abstract Graphic to fill the empty space */}
             <div className="bento-visual-large">
               <div className="mock-route-card fade-up">
                 <div className="route-header">
                   <div className="dot current"></div>
                   <div className="line"></div>
                   <div className="dot destination"></div>
                 </div>
                 <div className="route-details">
                   <div>
                     <small>Current SoC</small>
                     <strong>42%</strong>
                   </div>
                   <div>
                     <small>Target Station</small>
                     <strong style={{color: 'var(--primary)'}}>EV Power Hub</strong>
                   </div>
                 </div>
               </div>
               
               <div className="mock-score-card floating">
                  <div className="score-circle">98</div>
                  <div className="score-text">AI Match Score</div>
               </div>
             </div>
          </div>

          <div className="bento-card telematics-bento">
             <div className="bento-badge"><i className="fas fa-satellite"></i> Live Telematics</div>
             <h3>Real-Time Dashboard</h3>
             <div className="mock-eta">
                <h2>14 <span>min</span></h2>
                <div className="pulse-indicator">
                  <div className="live-dot"></div>
                  <p>Battery Preconditioning Active</p>
                </div>
             </div>
             <i className="fas fa-car-side bg-icon-top"></i>
          </div>

          <div className="bento-card charging-bento">
             <div className="bento-badge"><i className="fas fa-battery-three-quarters"></i> Session Tracking</div>
             <h3>Active Charging</h3>
             <div className="mock-battery-container">
               <div className="mock-battery">
                  <div className="fill"></div>
                  <span className="soc">84%</span>
               </div>
               <div className="charging-stats">
                 <span><i className="fas fa-bolt"></i> 148 kW</span>
                 <span><i className="fas fa-rupee-sign"></i> 450</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Supercharge Your EV Experience?</h2>
          <p>Join thousands of drivers who have eliminated range anxiety with EVEase.</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Create Free Account</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-grid">
          <div className="footer-brand-col">
            <h4><i className="fas fa-bolt" style={{ color: 'var(--primary)' }}></i> EVEase SaaS</h4>
            <p>The enterprise-grade orchestration platform for modern EV drivers and fleet managers.</p>
            <div className="social-links">
              <a href="https://github.com/PARAG-TIWARI" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
              <a href="https://www.linkedin.com/in/parag-tiwari" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div className="footer-links-col">
            <h5>Product</h5>
            <Link to="/login">Agentic AI Planner</Link>
            <Link to="/login">Live Mapping</Link>
            <Link to="/login">Telematics Dashboard</Link>
            <Link to="/login">Session Tracking</Link>
          </div>
          <div className="footer-links-col">
            <h5>Company</h5>
            <Link to="/contact">About Us</Link>
            <Link to="/subscription">Enterprise Solutions</Link>
            <Link to="/contact">Contact Sales</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 EVEase AI Platform. Lead Developer: Parag Tiwari.</p>
        </div>
      </footer>
    </div>
  );
}
