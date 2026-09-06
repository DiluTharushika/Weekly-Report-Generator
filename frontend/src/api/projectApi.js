import axiosInstance from "./axiosInstance.js";

export const getProjectsApi = () =>
  axiosInstance.get("/api/projects").then((res) => res.data);

export const createProjectApi = (payload) =>
  axiosInstance.post("/api/projects", payload).then((res) => res.data);

export const updateProjectApi = (id, payload) =>
  axiosInstance.put(`/api/projects/${id}`, payload).then((res) => res.data);

export const deleteProjectApi = (id) =>
  axiosInstance.delete(`/api/projects/${id}`).then((res) => res.data);