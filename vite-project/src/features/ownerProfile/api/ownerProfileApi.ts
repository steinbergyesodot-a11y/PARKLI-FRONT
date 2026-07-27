import api from "../../../lib/axiosClient";

export const ownerProfileApi = {

  checkBookings: function(userId:string){
    return api.get(`/api/bookings/checkIfUserHasBookings/${userId}`);
  },

  fetchDrivewaysByUserId: function(userId:string){
    return api.get(`/api/driveways/getAllDrivewaysByUserId/${userId}`);
  },

  fetchDrivewayById: function(drivewayId: string) {
    return api.get(`/api/driveways/${drivewayId}`);
  },

  updateDriveway: function(drivewayId: string, data: FormData) {
    return api.put(`/api/driveways/${drivewayId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  checkStripeVerification: function(userId:string){
    return api.get(`/api/users/${userId}/stripe/check-verification`);
  },

  fetchGames: function(drivewayId:string){
    return api.get(`/api/driveways/getGames/${drivewayId}`);
  },

  updateFirstName: function(userId?:string, firstName?:string){
    return api.put(`/api/users/${userId}/firstName/${firstName}`);
  },

  updateLastName: function(userId?:string, lastName?:string){
    return api.put(`/api/users/${userId}/lastName/${lastName}`);
  },

  updateEmail: function(userId?:string, email?:string){
    return api.put(`/api/users/${userId}/email/${email}`);
  },

  blockGame: function(drivewayId: string, gameDate:string){
    return api.put(`/api/driveways/${drivewayId}/block/${gameDate}`);
  },

  unblockGame: function(drivewayId: string, gameDate:string){
    return api.put(`/api/driveways/${drivewayId}/unblock/${gameDate}`);
  },



  

};
