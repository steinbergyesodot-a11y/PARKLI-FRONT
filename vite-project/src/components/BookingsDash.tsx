import axios from "axios";
import { map } from "framer-motion/client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import '../style/BookingDash.css'
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

interface BookingDashProps { 
    renterId: string;
}

interface MyTokenPayload {
  _id: string;
  name: string;
  role: string;
  userType: string
}


interface Booking{
    _id: string;
    drivewayId: string;
    ownerId: string;
    renterId: string;
    address : string;
    gameDate: string;
    parkingTime: string;
    price: number;
    visiting_team : string;
    bookedAt: string
}


export function BookingDash({ renterId }: BookingDashProps){
    const [upcomingBookings,setUpcomingBookings] = useState<Booking[] | null>(null);

    const token = localStorage.getItem("authToken");
    if (!token) return; 
    const decoded = jwtDecode<MyTokenPayload>(token);
    const userId = decoded._id;


        async function fetchBookings() {
          try {
                const response = await axios.get(`http://localhost:4000/api/bookings/${userId}`);
                setUpcomingBookings(response.data.bookings)
            } catch (err) {
            console.error("Failed to fetch driveways:", err);
            }
        }

  useEffect(() => {
    fetchBookings();
  }, []);

    function formatPrettyDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

   

    return(
        <>
        
            {upcomingBookings?.map((booking) => (
                <div key={booking._id}>


                <div className="contain">
                    <section className="leftSide">
                    <span className="addressLine"><FaLocationDot size={25} />{booking.address}</span>
                    <div>
                       <span className="dateLine">
                        <FaCalendarAlt size={25} />
                        {formatPrettyDate(booking.gameDate)}
                        <GoDotFill size={12}/>
                       {booking.parkingTime} PM
                       </span>
                    </div>
                    </section>

                    <section className="rightSide">
                        <button className="detailsBtn">View Details</button>
                    </section>
                </div>



                </div>
            ))}




        </>
    )
}