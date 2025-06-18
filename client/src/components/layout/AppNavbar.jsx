import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">JobConnect</Navbar.Brand>
        
        {/* Hamburger toggle button - only shows on small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Collapsible content - hides on small screens until toggle is clicked */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>

            {user?.role === 'jobseeker' && (
              <>
                <Nav.Link as={Link} to="/jobs">Browse Jobs</Nav.Link>
                <Nav.Link as={Link} to="/applications">My Applications</Nav.Link>
                <Nav.Link as={Link} to="/jobseeker/dashboard">Dashboard</Nav.Link>
              </>
            )}

            {user?.role === 'employer' && (
              <>
                <Nav.Link as={Link} to="/post-job">Post a Job</Nav.Link>
                <Nav.Link as={Link} to="/my-jobs">My Jobs</Nav.Link>
                <Nav.Link as={Link} to="/employer/applications">Applications</Nav.Link>
                <Nav.Link as={Link} to="/employer/dashboard">Dashboard</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;