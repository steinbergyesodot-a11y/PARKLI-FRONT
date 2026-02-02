import { useNavigate } from 'react-router';
import '../style/DrivewayCard.css'
import { DrivewayDetailed } from './DrivewayDetailed';
import { FaPersonWalkingArrowRight } from "react-icons/fa6";



type DrivewayCard = {
    drivewayCardId: string,
    address: string,
    name:string,
    distance: number,
    price: number,
    images: string[]
}



export function DrivewayCard({drivewayCardId,name,address,distance,price,images}:DrivewayCard){

    const navigate = useNavigate();

    function drivewayDetailed(){
        navigate(`/DrivewayDetailed/${drivewayCardId}`)
    }


    return(
        <div>
            <div className='AddContainer'>
                <img src={images[0]}alt="driveway" />

                <div className='carData'>
                    <h3>{name}</h3>
                    <h3 className='address'>{address}</h3>
                        <section className='walkk'>
                        <p>{distance} min</p>
                        <FaPersonWalkingArrowRight className='walkIcon' />
                        <p className='tag'>Wrigley Field</p>
                        </section>
                </div>

                <section className='rightSide'>
                    <p className='price'>
                    <span className='smallerText'>$</span>
                    {price} Per Game
                    </p>
                    <button className='moreDetails' onClick={drivewayDetailed}>More Details</button>
                </section>
                
               
            </div>
        </div>
    )
}