import api from "../../../lib/axiosClient";

export const authApi = {
  signup: function (data:any) {
    return api.post('/api/users/addUser', data);
  },

  forgotPassword: function (email:string) {
    return api.post('/api/users/forgotPassword', { email: email });
  },

  resetPassword: function (data:any, token:string) {
    return api.post('/api/users/resetPassword/' + token, data);
  }
};
