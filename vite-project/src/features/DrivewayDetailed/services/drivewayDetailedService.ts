import {drivewayDetailedApi} from "../api/drivewayDetailedApi"
export class DrivewayDetailedService {

  async getDrivewayById(drivewayId: string) {
    const response  = await drivewayDetailedApi.getDrivewayById(drivewayId);
    return response.data.data; 
  }

  async createPaymentIntent(data: any) {
    const response  = await drivewayDetailedApi.createPaymentIntent(data);
    return response.data; 
  }

  async createBooking(data: any) {
    const response  = await drivewayDetailedApi.createBooking(data);
    return response.data; 
  }

  async getDrivewayRules(drivewayId: string) {
    const response  = await drivewayDetailedApi.getDrivewayRules(drivewayId);
    const apiResponse = response.data
    return apiResponse
  }

  async updateDrivewayDate(drivewayId:string, gameDate:string){
    const response  = await drivewayDetailedApi.updateDrivewayDate(drivewayId,gameDate);
    return response.data
  }


}

export const drivewayDetailedService = new DrivewayDetailedService();
