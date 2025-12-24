import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { DrivewayCard } from "./DrivewayCard"
import '../style/Dashboard.css'
import { useContext } from "react";
import { UserContext } from '../userContext'
import { Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";



interface Spot {
  _id: string;
  address: string;
  walk: number;
  stadium: string;
  price: number;
  image: string;
  PostedAt: string;
}


export function Dashboard(){
    const [cards, setCards] = useState<Spot[]>([]);

    const userContext = useContext(UserContext)
    const user = userContext?.user

    const navigate = useNavigate();

    
    async function fetchData(){ 
      try{ 
      const res = await axios.get("http://localhost:4000/api/driveways/");
       setCards(res.data.driveways);
       console.log(res.data.drivways)
      }
      catch (err){
        console.error("Failed to fetch driveways:", err); 
      } 
    }
    
    useEffect(() => {
        fetchData();
    },[])

   function sendHome(){
        navigate('/Home')
    }


    return(
        <div className='app-container'>
          
            <div className="topDashboard">
               <img src="assets/logo.png" alt="logo" className="logoDash" onClick={sendHome} />
              <Nav className="topRightCornerDashboard">
              {user && (
              <NavDropdown
                title={
                    <img
                      src="https://copilot.microsoft.com/th/id/BCO.ac148c78-7814-4bb5-ad6e-a5b326076eab.png"
                      alt="User avatar"
                      className="avatar"
                    />
                  
                }
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile" className="linkChoice">
                  Profile
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={Link} to="/settings" className="linkChoice">
                  Settings
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item as={Link} to="/logout" className="linkChoice">
                  Log Out
                </NavDropdown.Item>


              </NavDropdown>
            )}
          </Nav>
         
                
            </div>

<div className="dashboard-panel">
            <section className="dashboard">
               
                {cards.map((driveway) => (

                    <DrivewayCard
                    
                    key={driveway._id}
                    drivewayCardId={driveway._id}
                    imageUrl={driveway.image}
                    address={driveway.address}
                    distance={driveway.walk}           
                    stadium={driveway.stadium}
                    price={driveway.price} 
                    />

                ))}

            </section>
            </div>
        </div>
    )
}