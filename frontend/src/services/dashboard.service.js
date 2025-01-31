// services/dashboard.service.js
import instance from "@/config/axios";

export const dashboardService = {
  getStatistics: async () => {
    const response = await instance.get('/dashboard/statistics');
    return response.data;
  }
};