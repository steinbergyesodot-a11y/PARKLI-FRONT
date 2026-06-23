import api from "../../../lib/axiosClient";

export const drivewayDetailedApi = {
  getDrivewayById: function (drivewayId: string) {
    return api.get(`/api/driveways/${drivewayId}`);
  },

  createPaymentIntent: function (data: any) {
    return api.post("/api/bookings/createPaymentIntent",data);
  },

  createBooking: function(data:any){
    return api.post("/api/bookings/",data);
  },

  updateDrivewayDate: function(drivewayId:string, gameDate:string){
    return api.put(`/api/driveways/${drivewayId}/${gameDate}`);
  },

  getDrivewayRules: function(drivewayId: string){
    return api.get(`/api/driveways/rules/${drivewayId}`);
  }

  

};
