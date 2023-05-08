import { useState, useEffect } from "react";
import axios from "axios";

const useAuthToken = () => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwt_token"));

  useEffect(() => {
    const tokenListener = (event) => {
      if (event.key === "jwt_token") {
        setJwtToken(event.newValue);
      }
    };

    window.addEventListener("storage", tokenListener);

    return () => {
      window.removeEventListener("storage", tokenListener);
    };
  }, []);

  useEffect(() => {
    if (jwtToken) {
      axios.defaults.headers.common["auth-token"] = jwtToken;
      axios.defaults.headers.common["Content-Type"] = "application/json";
    } else {
      delete axios.defaults.headers.common["auth-token"];
      delete axios.defaults.headers.common["Content-Type"];
    }
  }, [jwtToken]);

  return jwtToken;
};

export default useAuthToken;
