import { useEffect, useRef, useState,useContext } from 'react';
import '../style/DrivewayDetailed.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
// import { drivewayService } from '../services/drivewayService';
import { FaLocationDot } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiWalkFill } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { FaGooglePay } from "react-icons/fa";
import { FaCcApplePay } from "react-icons/fa";
import { RiVisaFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaApplePay } from "react-icons/fa6";
import { BsPaypal } from "react-icons/bs";
import { LiaCcAmex } from "react-icons/lia";
import { FaCcMastercard } from "react-icons/fa";
import { address, h2, p } from 'framer-motion/client';
import { BsCurrencyDollar } from "react-icons/bs";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { MdArrowCircleRight } from "react-icons/md";
import { MdArrowCircleLeft } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineCheck } from "react-icons/md";

interface Driveway {
  address: string;
  ownerId: string;
  images: string[];
  walk: string;
  price: string;
  publicDisplay: string;
  description: string;
  games?: Game[];
  rules: string[]
}

type Game = {
  visiting_team: string;
  game_time: string;
  parkingBegins: string;
  date: string;
  booked: boolean;
  blocked:boolean
};

type Coords = {
  lat: number;
  lng: number;
};

export function DrivewayDetailed() {
  const [driveway, setDriveway] = useState<Driveway | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [showSchedual, setShowSchedual] = useState(false)
  const [games, setGames] = useState<Game[]>([]);
  const [images,setImages] = useState([])
  const [curImage,setCurImage] = useState(0)
  const [message,setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [showRentalRules, setShowRentalRules] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  function paymentPage(game:any) {
        const token = localStorage.getItem("authToken");
        if(!token){
          setMessage("Please log in to continue.");
          setTimeout(() => setMessage(""), 3000);
          return;
        }
        navigate(`/DrivewayDetailed/${id}/Payment`,{
          state: {
            driveway_id: id,
            owner_id: driveway?.ownerId,
            address: driveway?.publicDisplay,
            fullAddress: driveway?.address,
            price: driveway?.price,
            visiting_team: game.visiting_team,
            parkingBegins: game.parkingBegins,
            gameDate: game.date,
          }
        });
  }
         

  return (
    <>
    
      {showSchedual ? 
      <>
      <div className='showSchedual'>

        <section className='topLineSchedual'>
          <CiLocationOn className='locationIcon2'/>
            <h3>{driveway?.address}</h3> 
        </section>
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
              onClick={game.booked || game.blocked ? undefined : () => paymentPage(game)}>
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
      : 
      
      <div className="detailPageContainer">

        
     




        </div>
      }
    </>
    
  );
}
