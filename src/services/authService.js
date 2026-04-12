import api from "../api/axiosInstance";

// Login Auth Api
export const login = (data) => {
  return api.post("/users/signin", data);
};

// Signup Auth Api
export const signup = (data) => {
  return api.post("/users/signup", data);
};