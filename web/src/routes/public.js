import { useNavigate } from "react-router-dom";
import useAuthToken from "src/hooks/token";

const Public = ({ children }) => {
  const jwtToken = useAuthToken();
  const navigate = useNavigate();

  if (jwtToken) {
    // User is authenticated, redirect to home
    navigate("/", { replace: true });
    return null; // Render nothing, since we're redirecting
  }

  return children;
};

export default Public;
