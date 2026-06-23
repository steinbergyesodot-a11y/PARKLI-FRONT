import { useNavigate, useParams } from "react-router-dom"
import { useDrivewayDetailed } from "../hooks/useDrivewayDetailed"
import { CiLocationOn } from "react-icons/ci"
import { useState } from "react";

type Game = {
  visiting_team: string;
  game_time: string;
  parkingBegins: string;
  date: string;
  booked: boolean;
  blocked:boolean
};
export function DrivewayDates(){

    const { drivewayId} = useParams()
    const {driveway,games} = useDrivewayDetailed(drivewayId)
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const handleGameClick = (game: Game) => {
        const token = localStorage.getItem("authToken");
        if(!token){
          setMessage("Please log in to continue.");
          setTimeout(() => setMessage(""), 3000);
          return;
        }
        navigate(`/DrivewayDetailed/${drivewayId}/Payment`, { state: {game} });
    };
    
    return(
<>
    <div className='showSchedual'>
    
            <section className='topLineSchedual'>
              <CiLocationOn className='locationIcon2'/>
                <h3>{driveway?.address}</h3> 
            </section>
          {message && <p className="error-message">{message}</p>}
          <p className='line'></p>
    
             
        <section className='games'>
            <p>Future Games</p>
    
             {games.length === 0 ? (
               <p>No games available</p>
              ) : (
                games.map((game, index) => (
                <div key={index}>
                  <>
                  <section className='gameRow'>
                  <div className='gameRow2'>
                  <span className="game-date">{game.date}</span>
                  <span className="game-vs">vs</span>
                  <span className="game-team">{game.visiting_team}</span>
                  <span className="game-date">@ {game.game_time}</span>
                  <span className="game-date">Parking begans: {game.parkingBegins}</span>
    
                    </div>
                  <span className={`game-status ${game.booked || game.blocked ? 'booked' : 'available'}`} 
                  onClick={game.booked || game.blocked ? undefined : () => handleGameClick(game)}
                  >
                {game.booked ? 'Booked' :  
                game.blocked ? 
                'Booked':
                 'Available'
                 }
                 </span>  
                  </section>
                  
                </>
                </div>
              ))
            )}
        </section>
      </div>
          </>
    )
}