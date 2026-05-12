import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-bolt"></i> EVEase <span>SaaS</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Platform</Link>
          <Link to="/contact" style={{ color: 'var(--primary)' }}>Contact</Link>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 10px' }}></div>
          <Link to="/login" className="btn-outline">Sign In</Link>
        </div>
      </nav>

      <div className="contact-page">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions about our Premium AI routing or Enterprise solutions? Our team is ready to help.</p>
            
            <div className="info-block">
              <i className="fas fa-user-tie"></i>
              <div>
                <h4>Lead Developer</h4>
                <p>Parag Tiwari</p>
              </div>
            </div>
            <div className="info-block">
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>paragt2005@gmail.com</p>
              </div>
            </div>
            <div className="info-block">
              <i className="fas fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>+91 7489 833 453</p>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            <h3>Send a Message</h3>
            <form>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" className="form-control" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <textarea className="form-control" rows="5" placeholder="How can we help you?" required style={{ resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
