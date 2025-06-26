function applicationReducer(state, action) {
  switch (action.type) {
    case "APPLICATION_LOADING":
      return { ...state, loading: true, error: null };

    case "APPLICATION_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "SET_USER_APPLICATIONS":
      return { ...state, userApplications: action.payload, loading: false, error: null };

    case "SET_JOB_APPLICATIONS":
      return { ...state, jobApplications: action.payload, loading: false, error: null };

    case "CREATE_APPLICATION":
      return {
        ...state,
        userApplications: [action.payload, ...state.userApplications],
        loading: false,
        error: null,
      };

    case "UPDATE_APPLICATION_STATUS":
      return {
        ...state,
        jobApplications: state.jobApplications.map((application) =>
          application._id === action.payload._id ? action.payload : application
        ),
        loading: false,
        error: null,
      };

    case "WITHDRAW_APPLICATION":
      return {
        ...state,
        userApplications: state.userApplications.filter(
          (application) => application._id !== action.payload
        ),
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}

export default applicationReducer;