import { useNavigate } from 'react-router';
import '../style/DrivewayCard.css'
import { DrivewayDetailed } from './DrivewayDetailed';


type DrivewayCard = {
    drivewayCardId: string,
    address: string,
    distance: number,
    price: number,
    images: string[]
}



export function DrivewayCard({drivewayCardId,address,distance,price,images}:DrivewayCard){

    const navigate = useNavigate();

    function drivewayDetailed(){
        navigate(`/DrivewayDetailed/${drivewayCardId}`)
    }


    return(
        <div>
            <div className='AddContainer'>
                <img src={images[0]}alt="driveway" />

                <div className='carData'>
                    <h3 className='address'>{address}</h3>
                    <p className='distance'>{distance}  walk to stadium</p>
                    <p className='tag'>Wrigley Field</p>
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