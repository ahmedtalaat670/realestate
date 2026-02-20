import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:8800",
  withCredentials: true,
});

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      window.dispatchEvent(new Event("auth-cookie-lost"));
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
