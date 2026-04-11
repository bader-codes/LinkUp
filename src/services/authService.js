import api from "../api/axiosInstance";

export const login = (data) => {
  return api.post("/users/signin", data);
};