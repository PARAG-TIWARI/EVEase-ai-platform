import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  
  // User Info State
  const [userInfo, setUserInfo] = useState({
    fullName: user?.username || '',
    email: user?.username ? `${user.username}@evease.com` : '',
    phone: '+1 (555) 000-0000',
    address: '123 EV Street, Tech City'
  });

  // Vehicles State
  const [vehicles, setVehicles] = useState([
    { id: 1, make: 'Tesla', model: 'Model 3', battery: 82, connector: 'CCS2' },
    { id: 2, make: 'Nissan', model: 'Leaf', battery: 40, connector: 'CHAdeMO' }
  ]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const addVehicle = () => {
    const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
    setVehicles([...vehicles, { id: newId, make: 'New Make', model: 'New Model', battery: 50, connector: 'Type 2' }]);
  };

  const updateVehicle = (id, field, value) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const saveProfile = (e) => {
    e.preventDefault();
    alert("Profile Credentials Saved Successfully!");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content profile-main">
        <div className="profile-container fade-in">
          <div className="profile-header-banner">
            <div className="profile-avatar-large">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
          </div>

          <div className="profile-details-card">
            <div className="profile-title">
              <h2>{userInfo.fullName || 'User'}</h2>
              <div className={`role-badge ${user?.isPremium ? 'badge-premium' : 'badge-free'}`}>
                {user?.isPremium ? 'Premium Member' : 'Free Member'}
              </div>
            </div>

            <form className="profile-form" onSubmit={saveProfile}>
              <div className="profile-section">
                <h3 style={{marginBottom: '1.5rem', color: 'var(--primary)'}}><i className="fas fa-id-card"></i> Personal Credentials</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" className="form-control" value={userInfo.fullName} onChange={handleInfoChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" className="form-control" value={userInfo.email} onChange={handleInfoChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" className="form-control" value={userInfo.phone} onChange={handleInfoChange} />
                  </div>
                  <div className="form-group">
                    <label>Home Address</label>
                    <input type="text" name="address" className="form-control" value={userInfo.address} onChange={handleInfoChange} />
                  </div>
                </div>
              </div>

              <div className="profile-section" style={{marginTop: '3rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <h3 style={{color: 'var(--primary)'}}><i className="fas fa-car"></i> Registered Vehicles</h3>
                  <button type="button" className="btn btn-outline" onClick={addVehicle} style={{padding: '0.5rem 1rem'}}>
                    <i className="fas fa-plus"></i> Add Vehicle
                  </button>
                </div>
                
                {vehicles.map((vehicle, index) => (
                  <div className="vehicle-card" key={vehicle.id} style={{marginTop: index > 0 ? '1.5rem' : '0'}}>
                    <div className="vehicle-header">
                      <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={vehicle.make} 
                          onChange={(e) => updateVehicle(vehicle.id, 'make', e.target.value)}
                          placeholder="Make (e.g. Tesla)"
                          style={{background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, padding: '0.5rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)'}}
                        />
                        <input 
                          type="text" 
                          className="form-control" 
                          value={vehicle.model} 
                          onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                          placeholder="Model (e.g. Model 3)"
                          style={{background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, padding: '0.5rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)'}}
                        />
                      </div>
                      <div className="vehicle-actions">
                        <button type="button" onClick={() => deleteVehicle(vehicle.id)} className="icon-btn text-danger" title="Remove Vehicle"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                    <div className="form-row" style={{marginTop: '1rem'}}>
                      <div className="form-group">
                        <label>Battery Capacity (kWh)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={vehicle.battery} 
                          onChange={(e) => updateVehicle(vehicle.id, 'battery', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Primary Connector Type</label>
                        <select 
                          className="form-control" 
                          style={{appearance: 'none'}} 
                          value={vehicle.connector}
                          onChange={(e) => updateVehicle(vehicle.id, 'connector', e.target.value)}
                        >
                          <option value="Type 2">Type 2</option>
                          <option value="CCS2">CCS2</option>
                          <option value="CHAdeMO">CHAdeMO</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {vehicles.length === 0 && <p style={{color: 'var(--text-muted)'}}>No vehicles registered. Add a vehicle to get started.</p>}
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                  <i className="fas fa-save" style={{marginRight: '0.5rem'}}></i> Save Profile Credentials
                </button>
                {!user?.isPremium && user?.role !== 'admin' && (
                  <Link to="/subscription" className="btn btn-outline glitch-hover" style={{ display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
                    <i className="fas fa-crown" style={{marginRight: '0.5rem'}}></i> Upgrade to Premium
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

