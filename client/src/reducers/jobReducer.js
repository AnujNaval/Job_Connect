function jobReducer(state, action) {
  switch (action.type) {
    case "JOB_LOADING":
      return { ...state, loading: true, error: null };

    case "JOB_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "SET_ALL_JOBS":
      return { ...state, jobs: action.payload, loading: false, error: null };

    case "SET_MY_JOBS":
      return { ...state, myJobs: action.payload, loading: false, error: null };

    case "SET_SELECTED_JOB":
      return { ...state, selectedJob: action.payload, loading: false, error: null };

    case "CREATE_JOB":
      return {
        ...state,
        myJobs: [action.payload, ...state.myJobs],
        loading: false,
        error: null,
      };

    case "UPDATE_JOB":
      return {
        ...state,
        myJobs: state.myJobs.map((job) =>
          job._id === action.payload._id ? action.payload : job
        ),
        loading: false,
        error: null,
      };

    case "DELETE_JOB":
      return {
        ...state,
        myJobs: state.myJobs.filter((job) => job._id !== action.payload),
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}

export default jobReducer;
