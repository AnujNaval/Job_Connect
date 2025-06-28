import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext.jsx';
import { ApplicationProvider } from './context/ApplicationContext'; // Add this import
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <ApplicationProvider>
            <App />
          </ApplicationProvider>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)