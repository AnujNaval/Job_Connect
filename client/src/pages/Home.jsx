import '../styles/Home.css';
import { useAuth } from '../context/AuthContext';

function Home() {
  const {user} = useAuth();

  return (
    // Hero Section Start
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          {/* Left: Text */}
          <div className="hero-text">
            <div className="hero-content">
              <h1 className="hero-title">
                Connect with{' '}
                <span className="gradient-text">opportunities</span>{' '}
                that match your potential
              </h1>
              <p className="hero-description">
                Whether you're seeking your next career opportunity or searching for the perfect candidate,
                JobConnect brings together talented professionals and innovative companies. Build meaningful
                connections that drive mutual success.
              </p>
            </div>
            
            <div className="hero-buttons">
              {user?.role === 'jobseeker' && (
                <>
                  <button className="btn-primary">
                  Find Your Dream Job
                </button>
                </>
              )}
              {user?.role === 'employer' && (
                <>
                  <button className="btn-primary">
                  Post a Job
                </button>
                </>
              )}
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Job Seekers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5K+</div>
                <div className="stat-label">Companies</div>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="hero-image">
            <div className="hero-image-container">
              <img 
                src="/images/jobPortal.webp" 
                alt="Job Portal" 
              />
            </div>
            
            {/* Decorative elements */}
            <div className="decoration-circle-1"></div>
            <div className="decoration-circle-2"></div>
            
            {/* Floating cards */}
            <div className="floating-card floating-card-1">
              <div className="card-content">
                <div className="status-dot status-green"></div>
                <span className="card-text">New Job Alert</span>
              </div>
            </div>
            
            <div className="floating-card floating-card-2">
              <div className="card-content">
                <div className="status-dot status-blue"></div>
                <span className="card-text">Profile Viewed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    // Hero Section End
  );
}

export default Home;