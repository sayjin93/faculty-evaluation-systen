import axios from "axios";
import constants from "../constants";
import auth from "src/constants/auth";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = constants.API_URL;
axios.defaults.headers.common["Authorization"] = auth["auth-token"];
axios.defaults.headers.post["Content-Type"] = auth["Content-Type"];

axiosClient.defaults.headers = constants.headers;

// To share cookies to cross site domain, change to true.
axiosClient.defaults.withCredentials = false;

export function getRequest(URL) {
  return axiosClient.get(`/${URL}`).then((response) => response);
}

export function postRequest(URL, payload) {
  return axiosClient.post(`/${URL}`, payload).then((response) => response);
}

export function patchRequest(URL, payload) {
  return axiosClient.patch(`/${URL}`, payload).then((response) => response);
}

export function deleteRequest(URL) {
  return axiosClient.delete(`/${URL}`).then((response) => response);
}
