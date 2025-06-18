import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">JobConnect</Navbar.Brand>

        {/* Hamburger toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {user?.role === 'Job Seeker' && (
              <>
                <Nav.Link as={Link} to="/jobs">Browse Jobs</Nav.Link>
                <Nav.Link as={Link} to="/applications">My Applications</Nav.Link>
                <Nav.Link as={Link} to="/jobseeker/dashboard">Dashboard</Nav.Link>
              </>
            )}

            {user?.role === 'Employer' && (
              <>
                <Nav.Link as={Link} to="/post-job">Post a Job</Nav.Link>
                <Nav.Link as={Link} to="/my-jobs">My Jobs</Nav.Link>
                <Nav.Link as={Link} to="/employer/applications">Applications</Nav.Link>
                <Nav.Link as={Link} to="/employer/dashboard">Dashboard</Nav.Link>
              </>
            )}
          </Nav>

          {/* Profile and Logout */}
          {user ? (
            <Nav className="ms-auto d-flex align-items-center">
              <Nav.Link className="text-white d-flex align-items-center" as={Link} to="/profile">
                <i className="fas fa-user-circle fa-2x me-2"></i>
                {user.name || 'Profile'}
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
