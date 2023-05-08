export const API_URL = process.env.REACT_APP_API_URL;

export const token = localStorage.getItem("jwt_token");

export const headers = {
  "auth-token": token,
  "Content-Type": "application/json",
};
