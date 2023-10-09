import { useNavigate } from "react-router-dom";

import useAuthToken from "src/hooks/token";

const Private = ({ children }) => {
  const navigate = useNavigate();
  const jwtToken = useAuthToken();

  if (!jwtToken) {
    // User is not authenticated, redirect to login
    navigate("/login", { replace: true });
    return null; // Render nothing, since we're redirecting
  }

  return children;
};

export default Private;
