import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import './AIPlanner.css';

export default function AIPlanner() {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [battery, setBattery] = useState('20');
  const [connector, setConnector] = useState('Type 2');
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeRecommendation, setActiveRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSource(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
          setIsLocating(false);
        },
        (error) => {
          alert('Unable to retrieve your location. Please check browser permissions.');
          setIsLocating(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveRecommendation(null);

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          current_location: source, 
          destination: destination,
          battery_percentage: parseFloat(battery),
          connector_type: connector
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      setResult(data);
      if (data.best_charger) {
        setActiveRecommendation(data.best_charger);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/dashboard" className="navbar-brand">
          <i className="fas fa-bolt"></i> EVEase <span>SaaS</span>
        </Link>
        <Link to="/dashboard" className="btn-outline">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </nav>

      <div className="planner-container">
        <div className="planner-header">
          <div className="ai-badge"><i className="fas fa-robot"></i> AI Recommender Active</div>
          <h1>Intelligent Route <span>Orchestration</span></h1>
          <p>Enter your journey details and let our agentic AI analyze battery drain, topography, and live port availability to find your perfect charging stop.</p>
        </div>

        <div className="planner-grid">
          <div className="glass-panel">
            <h3><i className="fas fa-route"></i> Journey Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>Current Location</label>
                  <button type="button" onClick={getLocation} disabled={isLocating} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>
                    {isLocating ? <><i className="fas fa-spinner fa-spin"></i> Locating...</> : <><i className="fas fa-location-arrow"></i> Use My Location</>}
                  </button>
                </div>
                <div className="input-icon-wrapper">
                  <i className="fas fa-map-marker-alt"></i>
                  <input 
                    type="text" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Indore, MP or Lat, Lng" 
                    required 
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Destination</label>
                <div className="input-icon-wrapper">
                  <i className="fas fa-flag-checkered"></i>
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Los Angeles, CA" 
                    required 
                  />
                </div>
              </div>

              {/* Added Inputs for Step 4 */}
              <div className="input-group">
                <label>Current Battery Level (%)</label>
                <div className="input-icon-wrapper">
                  <i className="fas fa-battery-half"></i>
                  <input 
                    type="number" 
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    placeholder="e.g. 20" 
                    min="1" max="100"
                    required 
                  />
                </div>
              </div>
              <div className="input-group" style={{ zIndex: 60 }}>
                <label>Connector Type</label>
                <CustomSelect 
                  options={[
                    { value: 'Type 2', label: 'Type 2' },
                    { value: 'CCS2', label: 'CCS2' },
                    { value: 'CHAdeMO', label: 'CHAdeMO' }
                  ]}
                  value={connector}
                  onChange={setConnector}
                  icon="fas fa-plug"
                />
              </div>

              <button type="submit" className="btn btn-primary glitch-hover" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} disabled={loading}>
                {loading ? (
                  <><i className="fas fa-circle-notch fa-spin"></i> Analyzing Route...</>
                ) : (
                  <><i className="fas fa-magic"></i> Generate AI Recommendation</>
                )}
              </button>
            </form>
          </div>

          <div className="glass-panel results-panel">
            {!loading && !result && !error && (
              <div className="empty-state">
                <i className="fas fa-compass"></i>
                <p>Your AI-orchestrated charging plan will appear here.</p>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="pulse-ring"></div>
                <p>AI Agent is currently analyzing route topography and station availability...</p>
              </div>
            )}

            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px' }}>
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            {result && activeRecommendation && (
              <div className="result-card fade-in">
                <div className="result-header">
                  <div>
                    <h4>{activeRecommendation.name === result.best_charger.name ? "Best Recommended Station" : "Selected Station"}</h4>
                    <h2 style={{ color: 'var(--primary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {activeRecommendation.name} 
                    </h2>
                    <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <i className="fas fa-star"></i>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{activeRecommendation.station_rating || "4.8"}</span>
                      <span style={{ color: 'var(--text-muted)' }}>(124 reviews)</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      {activeRecommendation.power_kw} kW • {activeRecommendation.connector_type} • {activeRecommendation.charger_type}
                    </p>
                  </div>
                  <div className="score-badge">{(activeRecommendation.final_score * 100).toFixed(1)}% Match</div>
                </div>

                <div className="metrics-grid">
                  <div className="metric">
                    <i className="fas fa-plug"></i>
                    <span>Availability</span>
                    <strong style={{ color: activeRecommendation.available_slots > 0 ? '#10b981' : '#ef4444' }}>
                      {activeRecommendation.available_slots}/{activeRecommendation.total_slots} Slots
                    </strong>
                  </div>
                  <div className="metric">
                    <i className="fas fa-hourglass-half"></i>
                    <span>Wait Time</span>
                    <strong>{activeRecommendation.wait_time} mins</strong>
                  </div>
                  <div className="metric">
                    <i className="fas fa-rupee-sign"></i>
                    <span>Price</span>
                    <strong>₹{activeRecommendation.price_per_kwh}/kWh</strong>
                  </div>
                  <div className="metric">
                    <i className="fas fa-route"></i>
                    <span>Detour</span>
                    <strong>{activeRecommendation.distance_from_route_km} km</strong>
                  </div>
                </div>

                <div className="ai-explanation">
                  <h5><i className="fas fa-robot"></i> Agentic Reasoning</h5>
                  <p>{activeRecommendation.name === result.best_charger.name ? result.explanation : `User overrode AI recommendation. Selected ${activeRecommendation.name} as preferred stop.`}</p>
                  
                  {activeRecommendation.score_breakdown && (
                    <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Availability Score:</span>
                        <span style={{ color: '#10b981' }}>+{activeRecommendation.score_breakdown.availability_score?.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Speed Score:</span>
                        <span style={{ color: '#10b981' }}>+{activeRecommendation.score_breakdown.charging_speed_score?.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Detour Penalty:</span>
                        <span style={{ color: '#ef4444' }}>-{activeRecommendation.score_breakdown.distance_penalty?.toFixed(2)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Wait Penalty:</span>
                        <span style={{ color: '#ef4444' }}>-{activeRecommendation.score_breakdown.wait_time_penalty?.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {result.ranked_chargers && result.ranked_chargers.length > 1 && (
                  <div className="alt-chargers" style={{ marginTop: '1.5rem' }}>
                    <h5 style={{ marginBottom: '0.75rem', color: 'var(--text-main)' }}>Alternative Options</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.ranked_chargers.filter(c => c.name !== activeRecommendation.name).slice(0, 3).map((charger, idx) => (
                        <div key={idx} style={{ background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)' }}>{charger.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{charger.wait_time}m wait • {charger.distance_from_route_km}km detour</div>
                          </div>
                          <button 
                            onClick={() => setActiveRecommendation(charger)}
                            style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  className="btn btn-primary glitch-hover" 
                  style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}
                  onClick={() => navigate('/live-navigation', { state: { station: activeRecommendation.name, route: result.route_info }})}
                >
                  <i className="fas fa-location-arrow"></i> Let's Go!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
