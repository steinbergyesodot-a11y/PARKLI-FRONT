import '../style/DrivewayCard.css'

type DrivewayCard = {
    imageUrl: string,
    address: string,
    distance: number,
    stadium: string,
    price: number
}


export function DrivewayCard({imageUrl,address,distance,stadium,price}:DrivewayCard){


    return(
        <div>
            <div className='AddContainer'>
                <img src={imageUrl}alt="driveway" />
                <div className='carData'>
                    <h3 className='address'>{address}</h3>
                    <p className='distance'>{distance} Min walk to stadium</p>
                    <p className='tag'>{stadium}</p>
                </div>
                <h2 className='price'>{price}$ per game</h2>
                

            </div>
        </div>
    )
}