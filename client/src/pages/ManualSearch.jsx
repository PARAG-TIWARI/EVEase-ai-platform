import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import CustomSelect from '../components/CustomSelect';
import './ManualSearch.css';

export default function ManualSearch() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('EV Charging Stations');
  const [connector, setConnector] = useState('All');
  const [power, setPower] = useState('All');

  // We use the basic Google Maps embed URL which doesn't require an API key for simple query searches.
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div className="header-actions">
          <div className="greeting">
            <h1>Manual Station Search</h1>
            <p>Explore real-time global charging infrastructure via Google Maps.</p>
          </div>
        </div>

        <div className="search-controls-grid">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city, zip code, or station network..."
            />
          </div>
          
          <div style={{ zIndex: 60 }}>
            <CustomSelect 
              options={[
                { value: 'All', label: 'Any Connector' },
                { value: 'Type 2', label: 'Type 2' },
                { value: 'CCS2', label: 'CCS2' },
                { value: 'CHAdeMO', label: 'CHAdeMO' }
              ]}
              value={connector}
              onChange={setConnector}
              icon="fas fa-plug"
            />
          </div>

          <div style={{ zIndex: 59 }}>
            <CustomSelect 
              options={[
                { value: 'All', label: 'Any Speed' },
                { value: 'Fast', label: 'Fast (50kW+)' },
                { value: 'Ultra', label: 'Ultra-Fast (150kW+)' }
              ]}
              value={power}
              onChange={setPower}
              icon="fas fa-bolt"
            />
          </div>
        </div>

        <div className="map-container fade-in">
          <div className="map-overlay-badge">
            <i className="fas fa-satellite-dish"></i> Live Google Maps Feed
          </div>
          <iframe 
            src={mapSrc}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="nearby-stations">
          <h3 style={{ marginBottom: '1rem' }}><i className="fas fa-map-pin"></i> Stations found near "{searchQuery}"</h3>
          <div className="stations-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="station-card">
                <div className="station-card-header">
                  <div>
                    <h4>EVEase Superhub {item}</h4>
                    <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <i className="fas fa-star"></i>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>4.{9 - item}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({85 + (item * 12)} reviews)</span>
                    </div>
                  </div>
                  <span className="badge-success">Available</span>
                </div>
                <p><i className="fas fa-bolt"></i> 150 kW • {connector === 'All' ? 'CCS2' : connector}</p>
                <p><i className="fas fa-rupee-sign"></i> ₹18/kWh</p>
                <button className="btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                  <i className="fas fa-external-link-alt"></i> View on Map
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

