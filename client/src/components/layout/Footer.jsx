import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

function Footer() {
  return (
    <footer className="modern-footer">
      <Container>
        <Row className="footer-main">
          {/* Brand Section */}
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand">
              <h3 className="brand-title">JobConnect</h3>
              <p className="brand-tagline">Where careers take flight</p>
              <p className="brand-description">
                Connecting ambitious professionals with innovative companies. 
                Transform your career journey with us.
              </p>
            </div>
          </Col>

          {/* Quick Info */}
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-section">
              <h5 className="section-title">Get In Touch</h5>
              <div className="contact-list">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Email</span>
                    <a href="mailto:navalanuj@gmail.com" className="contact-value">navalanuj@gmail.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Phone</span>
                    <a href="tel:+919823394889" className="contact-value">+91 98233 94889</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-details">
                    <span className="contact-label">Location</span>
                    <span className="contact-value">New Delhi, India</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Newsletter & Social */}
          <Col lg={4} md={12} className="mb-4">
            <div className="footer-section">
              <h5 className="section-title">Stay Updated</h5>
              <p className="newsletter-text">
                Subscribe to get the latest job opportunities and career insights.
              </p>
              <div className="newsletter-wrapper">
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="email-input"
                  />
                  <button className="subscribe-btn">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              
              <div className="social-section">
                <h6 className="social-title">Follow Us</h6>
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Facebook">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <Row className="align-items-center">
            <Col md={8}>
              <p className="copyright-text">
                © {new Date().getFullYear()} JobConnect. All rights reserved.
              </p>
            </Col>
            <Col md={4}>
              <div className="legal-links">
                <Link to="/privacy" className="legal-link">Privacy</Link>
                <Link to="/terms" className="legal-link">Terms</Link>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;