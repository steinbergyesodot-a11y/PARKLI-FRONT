import { ownerProfileApi } from "../api/ownerProfileApi";

export class OwnerProfileService {
    async checkBookings(userId: string) {
        try{
            const response  = await ownerProfileApi.checkBookings(userId);
            return response.data
        }catch(error:any){
            console.log(error);
        }
    }

    async fetchDrivewaysByUserId(userId: string) {
        try{
            const response  = await ownerProfileApi.fetchDrivewaysByUserId(userId);
            const apiResponse = response.data
            return apiResponse
        }catch(error:any){
            console.log(error);
        }
    }

    async fetchDrivewayById(drivewayId: string) {
        try {
            const response = await ownerProfileApi.fetchDrivewayById(drivewayId);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateDriveway(drivewayId: string, data: FormData) {
        try {
            const response = await ownerProfileApi.updateDriveway(drivewayId, data);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async checkStripeVerification(userId:string){
        try{
            const response  = await ownerProfileApi.checkStripeVerification(userId);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
        }
    }

    async fetchGames(drivewayId:string){
        try{
            const response  = await ownerProfileApi.fetchGames(drivewayId);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async updateFirstName(userId?:string, firstName?:string){
        try{
            const response  = await ownerProfileApi.updateFirstName(userId, firstName);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async updateLastName(userId?:string, lastName?:string){
        try{
            const response  = await ownerProfileApi.updateLastName(userId, lastName);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async updateEmail(userId?:string, email?:string){
        try{
            const response  = await ownerProfileApi.updateEmail(userId, email);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async blockGame(drivewayId: string, gameDate:string){
        try{
            const response  = await ownerProfileApi.blockGame(drivewayId, gameDate);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async unblockGame(drivewayId: string, gameDate:string){
        try{
            const response  = await ownerProfileApi.unblockGame(drivewayId, gameDate);
            const apiResponse = response.data
            return apiResponse
        }catch(error){
            console.log(error);
            throw error;
        }
    }
}

export const ownerProfileService = new OwnerProfileService();
