import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login({ role });            // set the user role in context
    navigate('/', { replace: true }); // redirect to home
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <button onClick={() => handleLogin('jobseeker')}>
        Login as Job Seeker
      </button>
      <button onClick={() => handleLogin('employer')}>
        Login as Employer
      </button>
    </div>
  );
}

export default Login;
