import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState("Job Seeker");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, role);
      // navigation is handled in AuthContext after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Floating Geometric Shapes */}
      <div className="floating-shapes">
        {/* Circles */}
        <div className="shape circle circle-1"></div>
        <div className="shape circle circle-2"></div>
        <div className="shape circle circle-3"></div>
        <div className="shape circle circle-4"></div>
        
        {/* Triangles */}
        <div className="shape triangle triangle-1"></div>
        <div className="shape triangle triangle-2"></div>
        <div className="shape triangle triangle-3"></div>
        
        {/* Squares/Diamonds */}
        <div className="shape square square-1"></div>
        <div className="shape square square-2"></div>
        <div className="shape square square-3"></div>
        
        {/* Hexagons */}
        <div className="shape hexagon hexagon-1"></div>
        <div className="shape hexagon hexagon-2"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {/* Company Branding Section */}
        <div className="company-branding">
          <div className="company-logo">
            JC
          </div>
          <div className="company-name">JobConnect</div>
          <div className="company-tagline">Connect. Grow. Succeed.</div>
        </div>

        <h2>Welcome Back</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="role">Login as:</label>
          <select 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="Job Seeker">Job Seeker</option>
            <option value="Employer">Employer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            id="email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-login"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="register-link">
          <p>Don't have an account? <a href="/register">Create one here</a></p>
        </div>
      </form>
    </div>
  );
}

export default Login;