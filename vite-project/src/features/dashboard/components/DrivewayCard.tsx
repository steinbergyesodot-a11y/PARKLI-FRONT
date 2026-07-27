import { useNavigate } from 'react-router-dom'
import '../style/DrivewayCard.css'
import { FaPersonWalkingArrowRight } from "react-icons/fa6"

type DrivewayCardProps = {
  drivewayCardId: string
  address: string
  name: string
  distance: number
  price: number
  images: string[]
}

export function DrivewayCard({
  drivewayCardId,
  name,
  address,
  distance,
  price,
  images
}: DrivewayCardProps) {

  const navigate = useNavigate()

  function drivewayDetailed() {
    navigate(`/DrivewayDetailed/${drivewayCardId}`)
  }

  return (
    <div className="drivewayCard">

      <img
        src={images[0]}
        alt="driveway"
        className="drivewayImage"
      />

      <div className="carData">

        <div className="textBlock">
          <h3 className="name">{name}</h3>
          <p className="address">{address}</p>

          <div className="walkInfo">
            <span>{distance} min</span>
            <FaPersonWalkingArrowRight className="walkIcon" />
            <span className="tag">Wrigley Field</span>
          </div>
        </div>

      </div>

      <div className="rightSide">
        <p className="price">
          <span className="dollar">$</span>{price}
          <span className="perGame"> / game</span>
        </p>

        <button
          className="moreDetails"
          onClick={drivewayDetailed}
        >
          More Details
        </button>
      </div>

    </div>
  )
}
