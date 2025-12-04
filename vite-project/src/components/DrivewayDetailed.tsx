import { useEffect, useRef, useState } from 'react';
import '../style/DrivewayDetailed.css';
import { Link, useNavigate, useParams } from 'react-router';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
import { useContext } from "react";
import { UserContext } from '../userContext'


interface Spot {
  address: string;
  imageUrl: string;
  walk: string;
  price: string;
  stadium: string;
  description: string;
}

type Coords = {
  lat: number;
  lng: number;
};


export function DrivewayDetailed() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  function sendHome() {
    navigate('/Home');
  }

  async function getDrivewayDetailed() {
    const response = await fetch(`http://localhost:4000/spots/getSpot/${id}`);
    const data: { spot: Spot } = await response.json();
    setSpot(data.spot);
  }

useEffect(() => {
  if (!spot?.address) return;

  const geocodeAddress = async () => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(spot.address)}&key=AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg`

    );
    const data = await response.json();
    if (data.results[0]) {
      const location = data.results[0].geometry.location;
      setCoords({ lat: location.lat, lng: location.lng });
    }
  };

  geocodeAddress();
}, [spot?.address]);



  useEffect(() => {
    getDrivewayDetailed();
  }, [id]);

  return (
    <div>
      <div className="top">
        <img
          src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png"
          alt="logo"
          className="logo"
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

        <section className="firstLine">
          <p className="address">{spot?.address}</p>
          <p className="price1">{spot?.price}$ per game</p>
        </section>

        <div className="secondLine">
          <section className="infoBox">
            <div className="walking">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP._uYZ_A6Ui3YnJLbEMWP_cwHaHa?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt=""
                className="walkIcon"
              />
              <p>{spot?.walk}</p>
            </div>
            <p className="stadium">{spot?.stadium}</p>
            <div className="ratings">
              <p>4.5</p>
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.Qrq7XBSs71OgklY--yU_uQHaHa?w=169&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                alt=""
                className="starIcon"
              />
            </div>
          </section>

          <Link to="/Booking" className="bookNow">Book Now</Link>
                          

        </div>

        <h3 className="moreInfo">More information</h3>
        <p className="description">{spot?.description}</p>
      </div>
    </div>
  );
}
