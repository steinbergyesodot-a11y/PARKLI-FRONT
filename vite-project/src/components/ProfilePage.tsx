import { FaUserEdit } from "react-icons/fa";
import '../style/profilePage.css'
import { useState } from "react";


export function ProfilePage(){
    const [active, setActive] = useState("Profile Info");
    return(
        <>
        <div className="topLineProfile">
           <img src="/assets/avatar.png" alt="avatar" className="profileAvatar"/>
           
           <div className="namemail">
                <p className="name">Yosef Steinberg</p>
                <p className="email">yosef@gmail.com</p>
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
        </>
    )
}