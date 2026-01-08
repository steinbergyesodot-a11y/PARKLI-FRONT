import { FaUserEdit } from "react-icons/fa";
import '../style/profilePage.css'
import { useEffect, useState } from "react";
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



export function ProfilePage(){
    const [active, setActive] = useState("Profile Info");
    const token = localStorage.getItem("authToken");
    if (!token) return; 
    const decoded = jwtDecode<MyTokenPayload>(token);
    const userId = decoded._id;
    const userType = decoded.userType
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
                src="assets/logo.png"
                alt="logo"
                className="logo"
                onClick={sendHome}
              />
              <ProfileDropdown/>
        
            </div>
        <div className="topLineProfile">
           <img src="data:image/webp;base64,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" alt="avatar" className="profileAvatar"/>
           
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

        <h2 className="upcoming">Upcoming Bookings</h2>
            {userId && <BookingDash renterId={userId} />}

        </>
    )
}