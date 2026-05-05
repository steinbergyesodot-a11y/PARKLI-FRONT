import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DrivewayCard } from "./DrivewayCard"
import '../style/Dashboard.css'
import { useContext } from "react";
import { UserContext } from '../userContext'
import { Nav, NavDropdown } from "react-bootstrap";
import { ProfileDropdown } from "./ProfileDropdown";
import { drivewayService } from "../services/drivewayService";
import { DrivewayMap } from "./DrivewayMap";
import '../style/DrivewayMap.css';


interface Spot {
  _id: string;
  address: string;
  publicDisplay: string;
  walk: number;
  name: string;
  stadium: string;
  price: number;
  images: string[];
  PostedAt: string;
}


export function Dashboard() {
  const [cards, setCards] = useState<Spot[]>([]);
  const [message,setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();

  async function fetchData() {
    setIsLoading(true);
    try {
      const result = await drivewayService.fetchAllDriveways();
      if(typeof result === 'string') {
        setMessage(result);
        setCards([]);
      } else {
        setCards(result);
        setMessage("");
      }
    } finally {
      setIsLoading(false);
    }
  }
   useEffect(() => {
    fetchData();
  }, []);

  
  function sendHome() {
    navigate("/Home");
  }

  return (
    <div className="app-container">
      <div className="topDashboard">
        <img
          src="/logo.png"
          alt="logo"
          className="logoDash"
          onClick={sendHome}
        />
        <Nav className="topRightCornerDashboard">
          {user && <ProfileDropdown />}
        </Nav>
      </div>

{message && (
        <div className="dashboard-error-alert">
          <span className="alert-icon">⚠️</span>
          <span>{message}</span>
        </div>
      )}

      {/* FLEX ROW WRAPPER ADDED HERE */}
      <section className="dashboard-wrapper">
        {/* LEFT SIDE — SCROLLABLE LIST */}
        <div className="dashboard-section">
          <h2 className="dashboard-title">Available Driveways</h2>
          <section className="dashboard">
          {isLoading ? (
            <div className="dashboard-loading-state">
              <div className="dashboard-spinner" aria-hidden="true"></div>
              <div>Loading driveways…</div>
            </div>
          ) : (
            cards.map((driveway) => (
              <DrivewayCard
                key={driveway._id}
                name={driveway.name}
                drivewayCardId={driveway._id}
                address={driveway.publicDisplay}
                distance={driveway.walk}
                images={driveway.images}
                price={driveway.price}
              />
            ))
          )}
          </section>
        </div>

        {/* RIGHT SIDE — MAP */}
        <div className="map-section">
          <h2 className="mapTitle">Driveway Locations</h2>
          <DrivewayMap driveways={cards} />
        </div>
      </section>
    </div>
  );
}
