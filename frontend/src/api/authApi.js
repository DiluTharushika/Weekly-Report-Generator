import axiosInstance from "./axiosInstance";

export const registerApi = (payload) =>
  axiosInstance.post("/api/auth/register", payload).then((res) => res.data);

export const loginApi = (payload) =>
  axiosInstance.post("/api/auth/login", payload).then((res) => res.data);

export const meApi = () =>
  axiosInstance.get("/api/auth/me").then((res) => res.data);