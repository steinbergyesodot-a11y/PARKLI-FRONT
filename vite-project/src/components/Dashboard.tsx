import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { DrivewayCard } from "./DrivewayCard"
import '../style/Dashboard.css'



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

    const navigate = useNavigate();

    

    function fetchData(){
        fetch('http://localhost:4000/spots/getAllSpots')
        .then(response => response.json())
        .then(data => setCards(data))
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
               <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo" onClick={sendHome} />
            
            
            </div>
            <section className="dashboard">
               
                {cards.map((driveway, index) => (

                    <DrivewayCard
                    
                    key={index}
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
    )
}