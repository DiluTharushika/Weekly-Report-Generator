import axiosInstance from "./axiosInstance.js";

export const getDashboardSummaryApi = (params) =>
  axiosInstance.get("/api/dashboard/summary", { params }).then((res) => res.data);