import axiosInstance from "./axiosInstance.js";

export const chatApi = (payload) =>
  axiosInstance.post("/api/chat", payload).then((res) => res.data);