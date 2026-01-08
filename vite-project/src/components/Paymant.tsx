import { data, useLocation, useNavigate } from "react-router-dom";
import '../style/Paymant.css'
import axios from "axios";
import { use, useContext, useState } from "react";
import { UserContext } from "../userContext";
import { jwtDecode } from "jwt-decode";



interface MyTokenPayload {
  _id: string;
  name: string;
  role: string;
}

interface Confirmation {
  address: string;
  gameDate: string;
  parkingTime: string;
  visiting_team: string;
}


 
type PaymentState = {
  driveway_id: string;
  owner_id: string;
  address: string;
  price: number;
  visiting_team: string;
  gameDate: string;
  parkingTime: string
};





export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentState | null;
  const [loading,setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  
  const token = localStorage.getItem("authToken");
  if (!token) return; 
  const decoded = jwtDecode<MyTokenPayload>(token);
  const userId = decoded._id;
  const userName = decoded.name

  function sendHome() {
    navigate('/Home');
  }


    
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
    parkingTime,
    visiting_team,
    gameDate
  } = state;



    async function handlePay(){
      setLoading(true)
      
      try{
            const response = await axios.post('http://localhost:4000/api/bookings', { // add to bookings collection
                renterId: userId,
                ownerId: owner_id,
                drivewayId: driveway_id,
                address: address,
                price: price,
                visiting_team: visiting_team,
                gameDate: gameDate,
                parkingTime: parkingTime
                
              })
              
              const response2 = await axios.put(`http://localhost:4000/api/driveways/${driveway_id}/${gameDate}`)
              setConfirmation(response.data.booking)
              
              
            }catch(error:any){
              console.log(error.response?.data);
            }
            finally{
              setLoading(false)
            }
          }
   return (
  <div className="payment-page">

    {!confirmation ? (
      <>
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

            <button className="pay-btn" onClick={handlePay} disabled={loading}>
              {loading ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                  Processing...
                </div>
              ) : (
                <>Pay ${price}</>
              )}
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

            <small className="ids-note">
              Driveway ID: {driveway_id} · Owner ID: {owner_id}
            </small>
          </div>
        </div>
      </>
    ) : (
      <div className="confirmation-screen">
        <h2>Booking Confirmed!</h2>
        <p><strong>Address:</strong> {confirmation.address}</p>
        <p><strong>Game Date:</strong> {confirmation.gameDate}</p>
        <p><strong>Parking Time:</strong> {confirmation.parkingTime}</p>
        <p><strong>Visiting Team:</strong> {confirmation.visiting_team}</p>

        <button className="pay-btn" onClick={sendHome}>
          Go Home
        </button>
      </div>
    )}

  </div>
);


}
