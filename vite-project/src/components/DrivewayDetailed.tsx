import { useEffect, useRef, useState } from 'react';
import '../style/DrivewayDetailed.css';
import { Link, useNavigate, useParams } from 'react-router';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
import { useContext } from "react";
import { UserContext } from '../userContext'
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





interface Driveway {
  address: string;
  imageUrl: string;
  walk: string;
  price: string;
  description: string;
}

type Coords = {
  lat: number;
  lng: number;
};


export function DrivewayDetailed() {
  const [driveway, setDriveway] = useState<Driveway | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  function sendHome() {
    navigate('/Home');
  }

  async function getDrivewayDetailed() {
    const response = await axios(`http://localhost:4000/api/driveways/${id}`);
    const data = response.data
    console.log(data)
    console.log(data.driveway)
    setDriveway(data.driveway);
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

  return (
    <div>
      <div className="top">
        <img
          src="/assets/logo.png"
          alt="logo"
          className='logoDash'
          onClick={sendHome}
        />
      </div>

      <div className="containor22">
        <section className="imagesArea">
        <div className="leftSide">
           {coords && (
             <LoadScriptNext googleMapsApiKey="AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg">
               <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={coords}
                  zoom={15}
                >
                <Marker position={coords} />
               </GoogleMap>
             </LoadScriptNext>
            )}
      </div>


          <div className="rightSide">
            <img
              src="https://www.bing.com/th/id/OIP.jvY78OZ04uIJJVeUg4NgPgHaEC?w=283&h=211&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3&pid=3.1&rm=2"
              alt=""
              className="topImage"
            />
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.KfZRliBlBQ2eWo4e2w2BVgHaFj?w=260&h=195&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt=""
              className="bottomImage"
            />
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
            <MdAttachMoney className='moneyIcon' />
            {driveway?.price} (USA)
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

           <button>Check Availablity</button>
           </section>
 


            </section>


              <div className="line2"></div>
             <p className='describe'>{driveway?.description}</p>
        

       


          
          
           
            </div>
          

                          

        
    
      </div>
    
  );
}
