import axiosInstance from "./axiosInstance.js";

export const getUsersApi = (params = {}) =>
  axiosInstance.get("/api/users", { params }).then((res) => res.data);

export const getUserByIdApi = (id) =>
  axiosInstance.get(`/api/users/${id}`).then((res) => res.data);

export const createUserApi = (payload) =>
  axiosInstance.post("/api/users", payload).then((res) => res.data);

export const updateUserRoleApi = (id, payload) =>
  axiosInstance.put(`/api/users/${id}/role`, payload).then((res) => res.data);

export const updateUserStatusApi = (id, payload) =>
  axiosInstance.patch(`/api/users/${id}/status`, payload).then((res) => res.data);
