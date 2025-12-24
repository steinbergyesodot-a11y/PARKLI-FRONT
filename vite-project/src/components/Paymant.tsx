import { data, useLocation, useNavigate } from "react-router-dom";
import '../style/Paymant.css'
import axios from "axios";
import { use, useContext } from "react";
import { UserContext } from "../userContext";




 
type PaymentState = {
  driveway_id: string;
  owner_id: string;
  address: string;
  price: number;
  visiting_team: string;
  gameDate: string;
};




export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentState | null;
  
  const context = useContext(UserContext);
  const user = context?.user;
  const userId = user?._id
  
  function sendHome() {
    navigate('/Home');
  }
    // Guard for refresh / direct access
    if (!state) {
    return (
        <div className="payment-fallback">
        <p>Loading checkout details...</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const {
    driveway_id,
    owner_id,
    address,
    price,
    visiting_team,
    gameDate
  } = state;

    async function handlePay(){
       
        try{
            const response = await axios.post('http://localhost:4000/api/bookings', {
                renterId: userId,
                ownerId: owner_id,
                drivewayId: driveway_id,
                address: address,
                price: price,
                visiting_team: visiting_team,
                gameDate: gameDate 
    
            })
            console.log("Payment response:", response.data);
            
            const response2 = await axios.put(`http://localhost:4000/api/driveways/${driveway_id}/${gameDate}`)
            alert("Payment successful! Your spot is booked.");
            sendHome();

        }catch(error:any){
            console.log(error.response?.data);
        }
    }

  return (
    <div className="payment-page">
       
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-layout">
        {/* LEFT – PAYMENT FORM */}
        <div className="payment-form">
          <h2>Payment Details</h2>

          <label>
            Cardholder Name
            <input type="text" placeholder="John Doe" />
          </label>

          <label>
            Card Number
            <input type="text" placeholder="•••• •••• •••• 1234" />
          </label>

          <div className="card-row">
            <label>
              Expiry
              <input type="text" placeholder="MM / YY" />
            </label>

            <label>
              CVV
              <input type="text" placeholder="123" />
            </label>
          </div>

          <p className="secure-text">🔒 Secure payment</p>

          <button className="pay-button" onClick={handlePay}>
            Pay ${price}
          </button>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-item">
            <p className="summary-label">Address</p>
            <p>{address}</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Game Date</p>
            <p>{gameDate}</p>
          </div>

          <div className="summary-item">
            <p className="summary-label">Visiting Team</p>
            <p>{visiting_team}</p>
          </div>

          <hr />

          <div className="total-row">
            <p>Total</p>
            <p className="total-price">${price}</p>
          </div>

          {/* Hidden for later backend use */}
          <small className="ids-note">
            Driveway ID: {driveway_id} · Owner ID: {owner_id}
          </small>
        </div>
      </div>
    </div>
  );
}
