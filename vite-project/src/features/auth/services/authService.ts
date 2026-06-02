import { authApi } from "../api/authApi";

export class AuthService {

  async signup(data: any) {
    const response  = await authApi.signup(data);
    return response.data
  }
  async forgotPassword(email:string) {
    try{
        const response = await authApi.forgotPassword(email);
        if(response){
            return response.data
        }
    }catch(err:any){
        return err
    }
  }

  async resetPassword(data: any, token: string){
    try{
      const response = await authApi.resetPassword(data, token);
      return response.data
    }catch(error){
      return error
    }
  }
}

export const authService = new AuthService();
