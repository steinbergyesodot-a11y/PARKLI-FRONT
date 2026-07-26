import { useEffect, useState } from "react"
import { ownerProfileService } from "../services/ownerProfileService";

type Game = {
  visiting_team: string;
  game_time: string;
  date: string;
  booked: boolean;
  blocked: boolean
};

export function useGamesWindow(drivewayId: string){
   const [games, setGames] = useState<Game[]>([]);

   useEffect(() => {
       async function getGames() {
         try {
           const response = await ownerProfileService.fetchGames(drivewayId);
           setGames(response.data);
         } catch (error: any) {
           console.log(error);
         }
       }

       if (!drivewayId) {
         return;
       }
   
       getGames();
     }, [drivewayId]);

   return { games };
}