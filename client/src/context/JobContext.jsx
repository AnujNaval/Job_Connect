import { createContext, useContext, useReducer, useCallback } from "react";
import jobReducer from "../reducers/jobReducer";
import API from "../utils/api";
import { useAuth } from "./AuthContext";

const JobContext = createContext();

const initialState = {
  jobs: [],
  myJobs: [],
  selectedJob: null,
  loading: false,
  error: null,
};

export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);
  const { user } = useAuth();

  const fetchAllJobs = async (filters = {}) => {
    dispatch({ type: "JOB_LOADING" });
    try {
      const response = await API.get("/jobs", { params: filters });
      dispatch({ type: "SET_ALL_JOBS", payload: response.data });
    } catch (error) {
      dispatch({
        type: "JOB_ERROR",
        payload: error.response?.data?.message || "Failed to fetch jobs",
      });
    }
  };

  const fetchJobById = useCallback(
    async (jobId) => {
      dispatch({ type: "JOB_LOADING" });
      try {
        const response = await API.get(`/jobs/${jobId}`);
        dispatch({ type: "SET_SELECTED_JOB", payload: response.data });
      } catch (error) {
        dispatch({ type: "JOB_ERROR", payload: error.message });
      }
    },
    [dispatch]
  );

  const fetchMyJobs = async () => {
    if (!user || user.role !== "Employer") {
      dispatch({
        type: "JOB_ERROR",
        payload: "Access denied. Employer access required.",
      });
      return;
    }

    dispatch({ type: "JOB_LOADING" });
    try {
      const response = await API.get("/jobs/employer");
      dispatch({ type: "SET_MY_JOBS", payload: response.data });
    } catch (error) {
      dispatch({
        type: "JOB_ERROR",
        payload: error.response?.data?.message || "Failed to fetch your jobs",
      });
    }
  };

  const createJob = async (jobData) => {
    dispatch({ type: "JOB_LOADING" });
    try {
      const response = await API.post("/jobs", jobData);
      dispatch({ type: "CREATE_JOB", payload: response.data.job });
    } catch (error) {
      dispatch({
        type: "JOB_ERROR",
        payload: error.response?.data?.message || "Failed to create job",
      });
    }
  };

  const updateJob = async (jobId, updates) => {
    dispatch({ type: "JOB_LOADING" });
    try {
      const response = await API.put(`/jobs/${jobId}`, updates);
      dispatch({ type: "UPDATE_JOB", payload: response.data.job });
    } catch (error) {
      dispatch({
        type: "JOB_ERROR",
        payload: error.response?.data?.message || "Failed to update job",
      });
    }
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: "JOB_LOADING" });
    try {
      await API.delete(`/jobs/${jobId}`);
      dispatch({ type: "DELETE_JOB", payload: jobId });
    } catch (error) {
      dispatch({
        type: "JOB_ERROR",
        payload: error.response?.data?.message || "Failed to delete job",
      });
    }
  };

  // Clear errors function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <JobContext.Provider
      value={{
        ...state,
        fetchAllJobs,
        fetchJobById,
        fetchMyJobs,
        createJob,
        updateJob,
        deleteJob,
        clearError,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
