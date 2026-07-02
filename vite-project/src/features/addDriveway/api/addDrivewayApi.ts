import api from "../../../lib/axiosClient";

export const addDrivewayApi = {
  addDriveway: function (data:any) {
    return api.post('/api/driveways', data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};
