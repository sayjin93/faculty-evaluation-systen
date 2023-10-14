// Importing necessary modules from external libraries
import { useState, useEffect } from "react";
import axios from "axios";

// Set the base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Custom React Hook for managing authentication token
const useAuthToken = () => {
  // State to hold the JWT token
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwt_token"));

  // Effect to listen for changes in localStorage (storage event)
  useEffect(() => {
    // Listener function for the storage event
    const tokenListener = (event) => {
      if (event.key === "jwt_token") {
        // Update the token if it changes in localStorage
        setJwtToken(event.newValue);
      }
    };

    // Adding the event listener when the component mounts
    window.addEventListener("storage", tokenListener);

    // Removing the event listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", tokenListener);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect to update Axios headers based on the token
  useEffect(() => {
    if (jwtToken) {
      // Set the authentication token and Content-Type header for requests
      axios.defaults.headers.common["Authorization"] = jwtToken;
      axios.defaults.headers.post["Content-Type"] = "application/json";
    } else {
      // Remove the authentication token and Content-Type header for requests
      delete axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.post["Content-Type"];
    }
  }, [jwtToken]); // Run this effect whenever jwtToken changes

  // Return the current JWT token
  return jwtToken;
};

export default useAuthToken;
