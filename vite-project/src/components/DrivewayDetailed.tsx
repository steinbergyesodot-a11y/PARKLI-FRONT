import { useEffect, useRef, useState,useContext } from 'react';
import '../style/DrivewayDetailed.css';
import { Link, useNavigate, useParams } from 'react-router';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
import axios from 'axios';
import { FaLocationDot } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiWalkFill } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
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










interface Driveway {
  address: string;
  ownerId: string;
  images: string[];
  walk: string;
  price: string;
  description: string;
  games?: Game[];
}

type Game = {
  visiting_team: string;
  game_time: string;
  date: string;
  booked: boolean;
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
  
  
  const token = localStorage.getItem("authToken")  
  


  const { id } = useParams();
  const navigate = useNavigate();

  function paymentPage(game:any) {
        navigate(`/DrivewayDetailed/${id}/Payment`,{
          state: {
            driveway_id: id,
            owner_id: driveway?.ownerId,
            address: driveway?.address,
            price: driveway?.price,
            visiting_team: game.visiting_team,
            gameDate: game.date,
            parkingTime : "7:00"
            
          }
        });
  }
         
  function sendHome() {
    navigate('/Home');
  }

function handleCurImage() {
  setCurImage(prev =>
    prev === images.length - 1 ? 0 : prev + 1
  );
}

function handleCurImageBack() {
  setCurImage(prev =>
    prev === 0 ? images.length - 1 : prev - 1
  );
}


  function handleSchedual(){
    
    if(!token){
      alert("Please Login or Sign up to continue!")
      return
    }
      setShowSchedual(!showSchedual)
  }

  async function getDrivewayDetailed() {
  const response = await axios.get(
    `http://localhost:4000/api/driveways/${id}`
  );
  const driveway = response.data.driveway;
  const images = response.data.driveway.images
  console.log(images)
  setImages(images)
  setGames(response.data.driveway.games || []);
  setDriveway(driveway);
  
}

useEffect(() => {
  if (!driveway?.address) return;

  const geocodeAddress = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(driveway.address)}&key=AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg`

    );
    const data = await response.json();
    if (data.results[0]) {
      const location = data.results[0].geometry.location;
      setCoords({ lat: location.lat, lng: location.lng });
    }
  };

  geocodeAddress();
}, [driveway?.address]);



  useEffect(() => {
    getDrivewayDetailed();
  }, [id]);

 useEffect(() => {
}, [games]);


  return (
    <div>
     
      <div className="top">
        <img
          src="/logo.png"
          alt="logo"
          className='logoDash'
          onClick={sendHome}
          />
      </div>

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
                </div>
              <span className={`game-status ${game.booked ? 'booked' : 'available'}`} 
              onClick={game.booked ? undefined : () => paymentPage(game)}>
            {game.booked ? 'Booked' : 'Available'}
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
      
      <div className="containor22">


        <section className="imagesArea">
        <div className="map">
           {coords && (
             <LoadScriptNext googleMapsApiKey="AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg">
               <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={coords} zoom={15} options={{ zoomControl: true, scrollwheel: true, draggable: true, disableDoubleClickZoom: false, fullscreenControl: true, mapTypeControl: true, streetViewControl: true, gestureHandling: "greedy" }} >
        <Marker position={coords} />
      </GoogleMap>

             </LoadScriptNext>
            )}
      </div>

            <div className="image-wrapper">
                <MdArrowCircleLeft className="arrowLeft" onClick={handleCurImageBack}/>
                <img
                key={curImage}  
                  src={images[curImage]}
                  alt=""
                  className='pictures fade'
                />
                <MdArrowCircleRight className="arrowRight" onClick={handleCurImage}/>

                <div className="image-index">
                  {curImage + 1} / {images.length} 
                </div>
            </div>

        
        </section>

            

            <section className='middleArea'>
           <div className='details'>


           <p className='locationInfo'>
            <FaMapMarkerAlt className="locationIcon" />
            {driveway?.address}
           </p>

           <p className='walkInfo'>
            <RiWalkFill className='walkIcon' />
            {driveway?.walk} 
          </p>

          <p className='priceInfo'>
            <GrMoney className='moneyIcon' />
           <div><MdAttachMoney /> {driveway?.price} (USD)</div>
          </p> 

              <p className='ratingInfo'>
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.Qrq7XBSs71OgklY--yU_uQHaHa?w=169&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt=""
                className="starIcon"
              />
              4.5
              </p>
            </div>

              
              <section className='middleRight'>
             <div className='cancelBox'>
                  <p className='rowCancel'>
                      <FaRegCheckSquare/>
                      Free Cancelation
                      <CiCircleInfo />
                  </p> 

                <p className='rowCancel'>
                   <FaRegCheckSquare/>
                  Guaranteed parking
                  <CiCircleInfo />
                </p> 
           </div>

           <div className='paymantIcons'>
            <FaApplePay />
            <RiVisaFill className='visa'/>
            <img src="https://tse2.mm.bing.net/th/id/OIP.ugrhTJ4gxQKWstWBQkLYyQHaHa?o=7&cb=ucfimg2&rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" className='googlePay'/>
            <LiaCcAmex className='amex'/>
            <FcGoogle className='google'/>
            <BsPaypal className='paypal'/>
            <img src="https://i.pinimg.com/originals/56/fd/48/56fd486a48ff235156b8773c238f8da9.png" alt="" className='master'/>
            <p className='more'>+more</p>
           </div>

           <button onClick={handleSchedual} className='availBtn'>Reserve Now</button>
           </section>
 


            </section>


              <div className="line4"></div>
             <p className='describe'>{driveway?.description}</p>
        </div>
  }
    </div>
    
  );
}
