import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './ActiveCharging.css';

export default function ActiveCharging() {
  const navigate = useNavigate();
  const location = useLocation();
  const stationName = location.state?.station || "EVEase Superhub";
  
  const [soc, setSoc] = useState(14); // State of Charge (%)
  const [kwh, setKwh] = useState(0.0); // Energy delivered
  const [cost, setCost] = useState(0.0); // Session cost
  const [power, setPower] = useState(148); // Current charging speed (kW)
  const [time, setTime] = useState(0); // Elapsed time in seconds
  const [isCharging, setIsCharging] = useState(true);

  // Simulation logic
  useEffect(() => {
    if (!isCharging) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
      
      // Simulate power curve (slows down as battery fills)
      setPower(prev => {
        if (soc > 80) return Math.max(30, prev - 2);
        return prev;
      });

      // Add energy (rough simulation: 150kW = ~0.04 kWh per second)
      const energyDelta = (power / 3600);
      setKwh(prev => prev + energyDelta);
      
      // Add cost (₹18 per kWh)
      setCost(prev => prev + (energyDelta * 18));

      // Increase SoC (assuming 75kWh battery)
      setSoc(prev => {
        const newSoc = prev + ((energyDelta / 75) * 100);
        if (newSoc >= 100) {
          setIsCharging(false);
          return 100;
        }
        return newSoc;
      });
      
    }, 1000);

    return () => clearInterval(interval);
  }, [isCharging, power, soc]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsCharging(false);
    setTimeout(() => {
      alert(`Session Completed.\nTotal Energy: ${kwh.toFixed(2)} kWh\nTotal Cost: ₹${cost.toFixed(2)}\nPayment auto-deducted from wallet.`);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="charging-layout">
      <div className="charging-header">
        <div>
          <h2><i className="fas fa-bolt" style={{color: 'var(--primary)'}}></i> Active Session</h2>
          <p>{stationName} • Port 2 (CCS2)</p>
        </div>
        <div className="session-time">
          <i className="fas fa-stopwatch"></i> {formatTime(time)}
        </div>
      </div>

      <div className="battery-visualization">
        <div className="car-wrapper">
          <i className="fas fa-car-side" style={{fontSize: '4rem', color: 'rgba(255,255,255,0.8)'}}></i>
        </div>
        
        <div className="battery-container">
          <div className="battery-fill" style={{ width: `${soc}%`, background: soc > 80 ? '#10b981' : '#f59e0b' }}>
            <div className="charge-waves"></div>
          </div>
          <div className="soc-text">{soc.toFixed(1)}%</div>
        </div>
      </div>

      <div className="telemetry-grid">
        <div className="telemetry-card">
          <div className="icon"><i className="fas fa-tachometer-alt"></i></div>
          <div className="value">{power.toFixed(0)} <span>kW</span></div>
          <div className="label">Delivery Rate</div>
        </div>
        <div className="telemetry-card">
          <div className="icon" style={{color: '#3b82f6'}}><i className="fas fa-charging-station"></i></div>
          <div className="value">{kwh.toFixed(2)} <span>kWh</span></div>
          <div className="label">Energy Delivered</div>
        </div>
        <div className="telemetry-card">
          <div className="icon" style={{color: '#ef4444'}}><i className="fas fa-rupee-sign"></i></div>
          <div className="value">{cost.toFixed(2)}</div>
          <div className="label">Accumulated Cost</div>
        </div>
      </div>

      <div className="charging-actions">
        {isCharging ? (
          <button className="btn-stop-charge" onClick={handleStop}>
            <i className="fas fa-power-off"></i> Stop Charging
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{width: '100%', padding: '1.2rem', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 600}}>
            <i className="fas fa-check-circle"></i> View Receipt
          </button>
        )}
      </div>
    </div>
  );
}
