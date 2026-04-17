import api from "./baseUrl";

export class DrivewayService {
  async fetchAllDriveways(){
    try{
        const response = await api.get('/api/driveways')
        const apiResponse = response.data
        if(apiResponse.success){
            return apiResponse.data
        }
    }catch(err:any){
        const backendError = err?.response?.data?.error || err?.message || String(err);
        return backendError
    }
  }

  async fetchDrivewayById(id: string){
    try{
        const response = await api.get(`/api/driveways/${id}`)
        const apiResponse = response.data
        if(apiResponse.success){
            return apiResponse.data
        }
    }catch(err:any){
        const backendError = err?.response?.data?.error || err?.message || String(err);
        return backendError
    }
  }
}

export const drivewayService = new DrivewayService();
