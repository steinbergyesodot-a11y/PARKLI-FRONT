import {drivewayDetailedApi} from "../api/drivewayDetailedApi"
export class DrivewayDetailedService {

  async getDrivewayById(drivewayId: string) {
    const response  = await drivewayDetailedApi.getDrivewayById(drivewayId);
    return response.data.data; 
  }
}

export const drivewayDetailedService = new DrivewayDetailedService();
