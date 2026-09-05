import axiosInstance from "./axiosInstance.js";

export const getMyReportsApi = (params = {}) =>
  axiosInstance.get("/api/reports/my", { params }).then((res) => res.data);

export const getReportByIdApi = (id) =>
  axiosInstance.get(`/api/reports/${id}`).then((res) => res.data);

export const createReportApi = (payload) =>
  axiosInstance.post("/api/reports", payload).then((res) => res.data);

export const updateReportApi = (id, payload) =>
  axiosInstance.put(`/api/reports/${id}`, payload).then((res) => res.data);

export const submitReportApi = (id) =>
  axiosInstance.put(`/api/reports/${id}/submit`).then((res) => res.data);

export const getReportVersionsApi = (id) =>
  axiosInstance.get(`/api/reports/${id}/versions`).then((res) => res.data);