import {dashboardApi} from "../api/dashboardApi"

export class DashboardService {

  async getAllDriveways() {
    const response  = await dashboardApi.getAllDriveways();
    return response.data
  }
}

export const dashboardService = new DashboardService();
