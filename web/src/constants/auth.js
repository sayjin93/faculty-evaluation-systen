const token = localStorage.getItem("jwt_token");

const headers = {
  "auth-token": token,
  "Content-Type": "application/json",
};

export default headers;
