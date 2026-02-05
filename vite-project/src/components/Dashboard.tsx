import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { DrivewayCard } from "./DrivewayCard"
import '../style/Dashboard.css'
import { useContext } from "react";
import { UserContext } from '../userContext'
import { Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";
import { ProfileDropdown } from "./ProfileDropdown";



interface Spot {
  _id: string;
  address: string;
  walk: number;
  name: string;
  stadium: string;
  price: number;
  images: string[];
  PostedAt: string;
}


export function Dashboard() {
  const [cards, setCards] = useState<Spot[]>([]);
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:4000/api/driveways/");
      setCards(res.data.driveways);
    } catch (err) {
      console.error("Failed to fetch driveways:", err);
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

      {/* FLEX ROW WRAPPER ADDED HERE */}
      <section className="dashboard-wrapper">
        {/* LEFT SIDE — SCROLLABLE LIST */}
        <section className="dashboard">
          {cards.map((driveway) => (
            <DrivewayCard
              key={driveway._id}
              name={driveway.name}
              drivewayCardId={driveway._id}
              address={driveway.address}
              distance={driveway.walk}
              images={driveway.images}
              price={driveway.price}
            />
          ))}
        </section>

        {/* RIGHT SIDE — TEXT */}
        <div className="rightPanel">
          <h2 className="rulesTitle">Booking Rules</h2>
          <ul className="rulesList"> 
            <li>Arrive up to 30 minutes before the start of the game or event.</li>
            <li>Park only in the assigned driveway or spot.</li>
            <li>Respect the booking time and leave on schedule.</li>
            <li>Follow any instructions provided by the host.</li> 
            <li>Keep noise to a minimum when arriving or leaving.</li> 
            <li>Use only the registered vehicle for your booking.</li> 
            <li>No overnight parking unless the listing allows it.</li> 
            <li>Do not leave trash or belongings behind.</li> 
            <li>Report any issues immediately through the app.</li> 
            <li>No illegal or unsafe activities on the property.</li> 
            <li>Cancellations must follow the platform policy.</li> 
          </ul>
        </div>
      </section>
    </div>
  );
}
