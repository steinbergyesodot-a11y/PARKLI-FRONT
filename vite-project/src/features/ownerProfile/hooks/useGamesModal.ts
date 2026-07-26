import { useCallback, useEffect, useState } from "react"
import { ownerProfileService } from "../services/ownerProfileService";

export type Game = {
  visiting_team: string;
  game_time: string;
  date: string;
  booked: boolean;
  blocked: boolean
};

function extractGames(payload: unknown): Game[] {
  if (Array.isArray(payload)) {
    return payload as Game[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: Game[] }).data;
  }

  return [];
}

export function useGamesWindow(drivewayId: string){
   const [games, setGames] = useState<Game[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [actionError, setActionError] = useState<string | null>(null);
   const [loadingGameDate, setLoadingGameDate] = useState<string | null>(null);

   const getGames = useCallback(async () => {
      if (!drivewayId) {
        setGames([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await ownerProfileService.fetchGames(drivewayId);
        setGames(extractGames(response));
      } catch (fetchError) {
        console.log(fetchError);
        setError("Failed to load games. Please try again.");
      } finally {
        setIsLoading(false);
      }
   }, [drivewayId]);

   useEffect(() => {
       getGames();
   }, [getGames]);

   async function toggleGameAvailability(game: Game) {
      if (game.booked || !drivewayId || loadingGameDate) {
        return;
      }

      setActionError(null);
      setLoadingGameDate(game.date);

      try {
        if (game.blocked) {
          await ownerProfileService.unblockGame(drivewayId, game.date);
        } else {
          await ownerProfileService.blockGame(drivewayId, game.date);
        }

        await getGames();
      } catch (toggleError) {
        console.log(toggleError);
        setActionError("Could not update this game right now. Please try again.");
      } finally {
        setLoadingGameDate(null);
      }
   }

   return {
    games,
    isLoading,
    error,
    actionError,
    loadingGameDate,
    retryFetchGames: getGames,
    toggleGameAvailability,
   };
}