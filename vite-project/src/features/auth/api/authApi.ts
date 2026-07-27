import api from "../../../lib/axiosClient";

export const authApi = {
  signup: function (data:any) {
    return api.post('/api/users/addUser', data);
  },

  login: function (data:any) {
    return api.post('/api/users/login', data);
  },

  googleLogin: function (accessToken: string) {
    return api.post('/api/users/google-login', { accessToken });
  },
  
  forgotPassword: function (email:string) {
    return api.post('/api/users/forgotPassword', { email: email });
  },

  resetPassword: function (data:any, token:string) {
    return api.post('/api/users/resetPassword/' + token, data);
  }
};
