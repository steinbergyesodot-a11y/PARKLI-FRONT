import api from "./baseUrl";

export class AuthService {
  async forgotPassword(email:string) {
    try{
        const response = await api.post(`/api/users/forgotPassword`,{email});
        if(response){
            return response.data
        }
    }catch(err:any){
        return err
    }
  }

  async resetPassword(data: any, token: string){
    try{
      const response = await api.post(
        `/api/users/resetPassword/${token}`,
        data
      )
      return response.data
    }catch(error){
      return error
    }
  }
}

export const authService = new AuthService();
