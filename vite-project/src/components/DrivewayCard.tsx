import { useNavigate } from 'react-router';
import '../style/DrivewayCard.css'
import { DrivewayDetailed } from './DrivewayDetailed';

type DrivewayCard = {
    drivewayCardId: string,
    imageUrl: string,
    address: string,
    distance: number,
    stadium: string,
    price: number
}


export function DrivewayCard({drivewayCardId,imageUrl,address,distance,stadium,price}:DrivewayCard){

    const navigate = useNavigate();

    function drivewayDetailed(){
        navigate(`/DrivewayDetailed/${drivewayCardId}`)
    }


    return(
        <div>
            <div className='AddContainer'>
                <img src={imageUrl}alt="driveway" />

                <div className='carData'>
                    <h3 className='address'>{address}</h3>
                    <p className='distance'>{distance} Min walk to stadium</p>
                    <p className='tag'>{stadium}</p>
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