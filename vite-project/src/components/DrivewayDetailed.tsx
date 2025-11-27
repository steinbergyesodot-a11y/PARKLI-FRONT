import { useEffect, useState } from 'react'
import '../style/DrivewayDetailed.css'
import { useNavigate, useParams } from 'react-router';



export function DrivewayDetailed(){
    const[imageUrl,setImageUrl] = useState('')
    const[address,setAddress] = useState('')
    const[walk, setWalk] = useState('')
    const[price,setPrice] = useState('')
    const[stadium,setStadium] = useState('')
    const[description,setDescription] = useState('')
    const { id } = useParams();
    
    const navigate = useNavigate();

    function sendHome(){
        navigate('/Home')
    }

    async function getDrivewayDetailed(){
      const response = await fetch(`http://localhost:4000/spots/getSpot/${id}`)
      const data = await response.json()
      const spot = data.spot
      setAddress(spot.address)
      setImageUrl(spot.imageUrl)
      setWalk(spot.walk)
      setStadium(spot.stadium)
      setDescription(spot.description)
      setPrice(spot.price)
    }

    
    useEffect(() => {
          getDrivewayDetailed();
    },[])
    

    return(
        <div>
             <div className="top">
               <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo" onClick={sendHome} />
             </div>


           <div className='containor22'>    
                       
            <section className='imagesArea'>
               <div className='leftSide'>
                    <img src={imageUrl} alt="" className='leftImage' />
               </div>
               <div className='rightSide'>
                <img src="https://www.bing.com/th/id/OIP.jvY78OZ04uIJJVeUg4NgPgHaEC?w=283&h=211&c=8&rs=1&qlt=90&r=0&o=6&dpr=1.3&pid=3.1&rm=2" alt="" className='topImage' />
                <img src="https://tse3.mm.bing.net/th/id/OIP.KfZRliBlBQ2eWo4e2w2BVgHaFj?w=260&h=195&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" alt="" className='bottomImage' />
               </div>

            </section>

            <section className='firstLine'>
            <p className='address'>{address}</p>
            <p className='price1'>{price}$ per game</p>
            </section>


            <div className='secondLine'>
            <section className='infoBox'>
              <div className='walking'>
                <img src="https://tse2.mm.bing.net/th/id/OIP._uYZ_A6Ui3YnJLbEMWP_cwHaHa?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" alt="" className='walkIcon'/>
                <p>7 min</p>
              </div>
              <p className='distance1'>0.8 mi</p>
              <p className='stadium'>Marlins Park</p>
              <div className='ratings'>
                <p>4.5</p>
                <img src="https://tse1.mm.bing.net/th/id/OIP.Qrq7XBSs71OgklY--yU_uQHaHa?w=169&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" alt="" className='starIcon' />
              </div>
            </section>
            <p className='bookNow'>Book Now</p>
            </div>


            <h3 className='moreInfo'>More information</h3>
            <p className='description'>Spacious private driveway located on a quiet residential street, just a short walk from the main bus line. Suitable for cars or small vans, with easy access in and out. Well-lit at night and available 24/7. Perfect for commuters or visitors looking for secure, hassle-free parking.</p>
            
            </div>

        </div>
    )
}