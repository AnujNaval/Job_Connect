import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Job Seeker'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Floating Geometric Shapes */}
      <div className="floating-shapes">
        {/* Circles */}
        <div className="shape circle circle-1"></div>
        <div className="shape circle circle-2"></div>
        <div className="shape circle circle-3"></div>
        <div className="shape circle circle-4"></div>
        <div className="shape circle circle-5"></div>
        
        {/* Triangles */}
        <div className="shape triangle triangle-1"></div>
        <div className="shape triangle triangle-2"></div>
        <div className="shape triangle triangle-3"></div>
        <div className="shape triangle triangle-4"></div>
        
        {/* Squares/Diamonds */}
        <div className="shape square square-1"></div>
        <div className="shape square square-2"></div>
        <div className="shape square square-3"></div>
        <div className="shape square square-4"></div>
        
        {/* Hexagons */}
        <div className="shape hexagon hexagon-1"></div>
        <div className="shape hexagon hexagon-2"></div>
        <div className="shape hexagon hexagon-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create Account</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="role">Register as:</label>
          <select 
            id="role" 
            name="role"
            value={formData.role} 
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="Job Seeker">Job Seeker</option>
            <option value="Employer">Employer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            required
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            required
            onChange={handleChange}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            required
            onChange={handleChange}
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            required
            onChange={handleChange}
            placeholder="Create a password (min. 6 characters)"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            required
            onChange={handleChange}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-register"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="login-link">
          <p>Already have an account? <a href="/login">Sign in here</a></p>
        </div>
      </form>
    </div>
  );
}

export default Register;