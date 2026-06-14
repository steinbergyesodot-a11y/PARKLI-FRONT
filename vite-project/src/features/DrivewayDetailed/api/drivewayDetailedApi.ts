import api from "../../../lib/axiosClient";

export const drivewayDetailedApi = {
  getDrivewayById: function (drivewayId: string) {
    return api.get(`/api/driveways/${drivewayId}`);
  },

  

};
