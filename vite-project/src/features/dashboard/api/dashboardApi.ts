import api from "../../../lib/axiosClient";

export const dashboardApi = {
  getAllDriveways: function () {
    return api.get('/api/driveways');
  },
};
