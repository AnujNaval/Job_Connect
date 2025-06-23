import '../styles/Home.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const {user} = useAuth();

  return (
    <>
      {/* Hero Section Start */}
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
                {user?.role === 'Job Seeker' && (
                  <>
                    <Link className="btn-primary" to="/jobs">
                      Find Your Dream Job
                    </Link>
                  </>
                )}
                {user?.role === 'Employer' && (
                  <>
                    <Link className="btn-primary" to="/post-job">
                      Post a Job
                    </Link>
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
                  <div className="stat-label">Employers</div>
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
              
              {/* Floating Cards */}
              <div className="hero-floating-card hero-floating-card-1">
                <div className="card-content">
                  <div className="status-dot status-green"></div>
                  <span className="card-text">New Job Alert</span>
                </div>
              </div>
              <div className="hero-floating-card hero-floating-card-2">
                <div className="card-content">
                  <div className="status-dot status-blue"></div>
                  <span className="card-text">Profile Viewed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Hero Section End */}

      {/* How JobConnect Works Section Start */}
      <section className="works-section">
        <div className='works-container'>
          <div className="works-header">
            <h2 className="works-title">
              How <span className="gradient-text">JobConnect</span> Works!
            </h2>
            <p className="works-subtitle">
              Get started with JobConnect in three simple steps. Whether you're looking for talent or opportunities, our platform makes the process seamless and efficient.
            </p>
          </div>

          <div className="works-grid">
            {/* Card 1: Create Account */}
            <div className="works-card">
              <div className="card-step">1</div>
              <div className="card-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3 className="card-title">Create an Account</h3>
              <p className="card-description">
                Sign up and create your professional profile in minutes. Choose your role and customize your experience.
              </p>
              <ul className="card-features">
                <li>
                  <div className="feature-check"></div>
                  Quick registration process
                </li>
                <li>
                  <div className="feature-check"></div>
                  Profile customization
                </li>
                <li>
                  <div className="feature-check"></div>
                  Secure & verified accounts
                </li>
                <li>
                  <div className="feature-check"></div>
                  Role-based dashboard
                </li>
              </ul>
            </div>

            {/* Card 2: Find/Post Jobs */}
            <div className="works-card">
              <div className="card-step">2</div>
              <div className="card-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="card-title">Find Jobs / Post Jobs</h3>
              <p className="card-description">
                Job seekers can browse thousands of opportunities while employers can post jobs and reach top talent.
              </p>
              <ul className="card-features">
                <li>
                  <div className="feature-check"></div>
                  Advanced search filters
                </li>
                <li>
                  <div className="feature-check"></div>
                  Smart job recommendations
                </li>
                <li>
                  <div className="feature-check"></div>
                  Easy job posting tools
                </li>
                <li>
                  <div className="feature-check"></div>
                  Real-time notifications
                </li>
              </ul>
            </div>

            {/* Card 3: Apply/Hire */}
            <div className="works-card">
              <div className="card-step">3</div>
              <div className="card-icon">
                <i className="fas fa-crosshairs"></i>
              </div>
              <h3 className="card-title">Apply / Hire Candidates</h3>
              <p className="card-description">
                Apply for positions with one click or review applications and hire the perfect candidate for your team.
              </p>
              <ul className="card-features">
                <li>
                  <div className="feature-check"></div>
                  One-click applications
                </li>
                <li>
                  <div className="feature-check"></div>
                  Application tracking
                </li>
                <li>
                  <div className="feature-check"></div>
                  Candidate screening tools
                </li>
                <li>
                  <div className="feature-check"></div>
                  Interview scheduling
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* How JobConnect Works Section End */}

      {/* Popular Job Categories Section Start */}
      <section className="categories-section">
        <div className="categories-container">
          <div className="categories-header">
            <h2 className="categories-title">
              Popular Job <span className="gradient-text">Categories</span>
            </h2>
            <p className="categories-subtitle">
              Explore thousands of job opportunities across various industries and find your perfect career match.
            </p>
          </div>

          <div className="categories-grid">
            {/* Technology Category */}
            <div className="category-card">
              <div className="category-badge">Hot</div>
              <div className="category-icon">
                <i className="fas fa-laptop-code"></i>
              </div>
              <h3 className="category-title">Technology</h3>
              <p className="category-count">2,845 Jobs Available</p>
            </div>

            {/* Healthcare Category */}
            <div className="category-card">
              <div className="category-badge">Growing</div>
              <div className="category-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3 className="category-title">Healthcare</h3>
              <p className="category-count">1,923 Jobs Available</p>
            </div>

            {/* Finance Category */}
            <div className="category-card">
              <div className="category-badge">High Pay</div>
              <div className="category-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="category-title">Finance</h3>
              <p className="category-count">1,456 Jobs Available</p>
            </div>

            {/* Education Category */}
            <div className="category-card">
              <div className="category-badge">Stable</div>
              <div className="category-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="category-title">Education</h3>
              <p className="category-count">987 Jobs Available</p>
            </div>

            {/* Marketing Category */}
            <div className="category-card">
              <div className="category-badge">Creative</div>
              <div className="category-icon">
                <i className="fas fa-bullhorn"></i>
              </div>
              <h3 className="category-title">Marketing</h3>
              <p className="category-count">1,234 Jobs Available</p>
            </div>

            {/* Design Category */}
            <div className="category-card">
              <div className="category-badge">Remote</div>
              <div className="category-icon">
                <i className="fas fa-palette"></i>
              </div>
              <h3 className="category-title">Design</h3>
              <p className="category-count">756 Jobs Available</p>
            </div>

            {/* Engineering Category */}
            <div className="category-card">
              <div className="category-badge">In Demand</div>
              <div className="category-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3 className="category-title">Engineering</h3>
              <p className="category-count">1,567 Jobs Available</p>
            </div>

            {/* Sales Category */}
            <div className="category-card">
              <div className="category-badge">Commission</div>
              <div className="category-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="category-title">Sales</h3>
              <p className="category-count">2,123 Jobs Available</p>
            </div>
          </div>

          <div className="categories-cta">
              {user?.role === "Job Seeker" && (
                <>
                  <p className="categories-cta-text">
                    Opportunities await — start your search now!
                  </p>
                  <Link className="categories-cta-button" to="/jobs">
                    Browse Jobs
                    <span>→</span>
                  </Link>
                </>
              )}
              {user?.role === "Employer" && (
                <>
                  <p className="categories-cta-text">
                    Have a role to fill? Post a job and hire smarter.
                  </p>
                  <Link className="categories-cta-button" as={Link} to="/post-job">
                    Post a Job
                    <span>→</span>
                  </Link>
                </>
              )}
          </div>
        </div>
      </section>
      {/* Popular Job Categories Section End */}
    </>
  );
}

export default Home;