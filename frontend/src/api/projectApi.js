import axiosInstance from "./axiosInstance.js";

export const getProjectsApi = () =>
  axiosInstance.get("/api/projects").then((res) => res.data);