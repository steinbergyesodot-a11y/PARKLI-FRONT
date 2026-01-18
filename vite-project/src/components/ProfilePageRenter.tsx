import '../style/profilePage.css'
import { act, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BookingDash } from "./BookingsDash";
import { useNavigate } from "react-router";
import { ProfileDropdown } from "./ProfileDropdown";



interface MyTokenPayload {
  _id: string;
  name: string;
  role: string;
  userType: string;
  email: string
}






export function ProfilePageRenter(){
    const [active, setActive] = useState("My Bookings");
    const token = localStorage.getItem("authToken");
    if (!token) return; 
    const decoded = jwtDecode<MyTokenPayload>(token);
    const userId = decoded._id;
    const userName = decoded.name
    const userEmail = decoded.email

    const navigate = useNavigate();



    function sendHome(){
    navigate('/Home')
  }



 
    

    return(
        <>
         <div className="topAddDriveway">
              <img
                src="/logo.png"
                alt="logo"
                className="logo"
                onClick={sendHome}
              />
              <ProfileDropdown/>
        
          </div>

        <div className="topLineProfile">
          <img src="/assets/avatar.png" className="profileAvatar"
          alt="avatar"
           />
           
           <div className="namemail">
                <p className="name">{userName}</p>
                <p className="email">{userEmail}</p>
           </div>
        </div>

        
        <section className="navs">
            <button
            className={`navsBtn ${active === "Profile Info" ? "active" : ""}`}
            onClick={() => setActive("Profile Info")}
            >Profile Info
            </button>

            <button 
             className={`navsBtn ${active === "My Bookings" ? "active" : ""}`}
             onClick={() => setActive("My Bookings")}
             >
            My Bookings
            </button>


            <button
            className={`navsBtn ${active === "Payment Methods" ? "active" : ""}`}
            onClick={() => setActive("Payment Methods")}
            >Payment Methods
            </button>


            <button
            className={`navsBtn ${active === "Settings" ? "active" : ""}`}
            onClick={() => setActive("Settings")}
            >Settings
            </button>
        </section>

            {active === "My Bookings" &&
            <div>
            
            <BookingDash renterId={userId} />
            </div>
            }

            {active === "Profile Info" && 
            <div>
              <p>My profile info</p>
            </div>
            }

               {active === "Payment Methods" && 
            <div>
              <p>My payment methods</p>
            </div>
            }
          

             {active === "Settings" && 
            <div>
              <p>My settings</p>
            </div>
            }          

        </>
    )
}