import { createContext, useContext, useReducer, useCallback } from "react";
import applicationReducer from "../reducers/applicationReducer";
import API from "../utils/api";
import { useAuth } from "./AuthContext";

const ApplicationContext = createContext();

const initialState = {
  userApplications: [], // Applications submitted by the logged-in job seeker
  jobApplications: [], // Applications for a specific job (employer view)
  selectedApplication: null, // Single application for detailed view
  loading: false,
  error: null,
};

export const ApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(applicationReducer, initialState);
  const { user } = useAuth();

  // Apply for a job (Job Seeker only)
  const applyForJob = async (jobId, applicationData) => {
    if (!user || user.role !== "Job Seeker") {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: "Access denied. Job Seeker access required.",
      });
      return;
    }

    dispatch({ type: "APPLICATION_LOADING" });
    try {
      const response = await API.post(`/applications/${jobId}`, applicationData);
      dispatch({
        type: "CREATE_APPLICATION",
        payload: response.data.application,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: error.response?.data?.message || "Failed to submit application",
      });
      throw error;
    }
  };

  // Get all applications submitted by the logged-in user (Job Seeker only)
  const getUserApplications = useCallback(async () => {
    if (!user || user.role !== "Job Seeker") {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: "Access denied. Job Seeker access required.",
      });
      return;
    }

    dispatch({ type: "APPLICATION_LOADING" });
    try {
      const response = await API.get("/applications/user");
      dispatch({
        type: "SET_USER_APPLICATIONS",
        payload: response.data.applications,
      });
    } catch (error) {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: error.response?.data?.message || "Failed to fetch your applications",
      });
    }
  }, [dispatch, user]);

  // Get all applications for a specific job (Employer only)
  const getJobApplications = async (jobId) => {
    if (!user || user.role !== "Employer") {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: "Access denied. Employer access required.",
      });
      return;
    }

    dispatch({ type: "APPLICATION_LOADING" });
    try {
      const response = await API.get(`/applications/job/${jobId}`);
      dispatch({
        type: "SET_JOB_APPLICATIONS",
        payload: response.data.applications,
      });
    } catch (error) {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: error.response?.data?.message || "Failed to fetch job applications",
      });
    }
  };

  // Get a single application by ID (with proper authorization)
  const getApplicationById = useCallback(async (applicationId) => {
    dispatch({ type: "APPLICATION_LOADING" });
    try {
      const response = await API.get(`/applications/${applicationId}`);
      dispatch({
        type: "SET_SELECTED_APPLICATION",
        payload: response.data.application,
      });
      return response.data.application;
    } catch (error) {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: error.response?.data?.message || "Failed to fetch application",
      });
      throw error;
    }
  }, [dispatch]);

  // Update application status (Employer only)
  const updateApplicationStatus = async (applicationId, status) => {
    if (!user || user.role !== "Employer") {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: "Access denied. Employer access required.",
      });
      return;
    }

    dispatch({ type: "APPLICATION_LOADING" });
    try {
      const response = await API.put(`/applications/${applicationId}`, { status });
      dispatch({
        type: "UPDATE_APPLICATION_STATUS",
        payload: response.data.application,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: error.response?.data?.message || "Failed to update application status",
      });
      throw error;
    }
  };

  // Withdraw application (Job Seeker only)
  const withdrawApplication = async (applicationId) => {
    if (!user || user.role !== "Job Seeker") {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: "Access denied. Job Seeker access required.",
      });
      return;
    }

    dispatch({ type: "APPLICATION_LOADING" });
    try {
      await API.delete(`/applications/${applicationId}`);
      dispatch({ type: "WITHDRAW_APPLICATION", payload: applicationId });
    } catch (error) {
      dispatch({
        type: "APPLICATION_ERROR",
        payload: error.response?.data?.message || "Failed to withdraw application",
      });
      throw error;
    }
  };

  // Clear selected application
  const clearSelectedApplication = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTED_APPLICATION" });
  }, [dispatch]);

  // Clear errors function
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, [dispatch]);

  return (
    <ApplicationContext.Provider
      value={{
        ...state,
        applyForJob,
        getUserApplications,
        getJobApplications,
        getApplicationById,
        updateApplicationStatus,
        withdrawApplication,
        clearSelectedApplication,
        clearError,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};