import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"
import ProtectedRoute from "./components/common/ProtectedRoute";
import AllJobs from "./components/jobseeker/AllJobs";
import JobList from "./components/employer/JobList";
import JobDetails from "./components/jobseeker/JobDetails";
import JobPostForm from "./components/employer/JobPostForm";
import "./styles/App.css"

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/my-jobs" element={<JobList />} />
        <Route path="/post-job" element={<JobPostForm />} />
        {/* Add other protected routes here */}
      </Route>
    </Routes>
  );
}

export default App;