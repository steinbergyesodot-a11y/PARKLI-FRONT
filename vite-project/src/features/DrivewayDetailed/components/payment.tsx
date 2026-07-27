import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDrivewayDetailed } from "../hooks/useDrivewayDetailed";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { usePayment } from "../hooks/usePayment";
import { useState } from "react";
import '../style/Paymant.css'
import BookingSuccess from "./BookingConfirmed";

interface MyTokenPayload {
  _id: string;
  name: string;
  role: string ;
  userType: string;
}

export function Payment(){
    const { drivewayId} = useParams()
    const {driveway} = useDrivewayDetailed(drivewayId)
    const location = useLocation();
    const game = location.state?.game;
    const navigate = useNavigate();
    const {drivewayRules,loading,errorMessage,handlePay,showSuccess,bookingId} = usePayment({
        game
    })

    
    if (!game) {
    return (
      <div className="payment-fallback">
        <p>Loading checkout details...</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if(showSuccess){
    return(
      <>
           <BookingSuccess
         gameDate={game.date}
        parkingBegins={game.parkingBegins}
        address={driveway?.publicDisplay}
        visitingTeam={game.visiting_team}
        bookingId={bookingId}
      />
      </>
    )
  }
  
  return(
    <div className="payment-page">
        {!showSuccess && (
            <>
               <h1 className="checkout-title">Checkout</h1>
               <div className="checkout-layout">
                <div className="payment-form">
                      <h2>Payment Details</h2>

             <label>
              Cardholder Name
              <input type="text" placeholder="John Doe" />
            </label>

               <label>
              Card Details
             <div className="card-element-wrapper">
               <CardElement />
             </div>
            </label>

          <p className="secure-text">🔒 Secure payment</p>

  <p className="agreementText">
   By completing this payment, you agree to the driveway rules, our{" "}
   <Link to="/CancellationPolicy" className="termsLink">Cancellation Policy</Link>, 
   and our{" "}
   <Link to="/TermsOfUse" className="termsLink">Terms of Use</Link>.
 </p>

              {errorMessage && (
              <div className="payment-error" role="alert">{errorMessage}</div>
            )}

            <button
              className="pay-btn"
               onClick={handlePay}
               disabled={loading}
            >
                 {loading ? (
                 <div className="spinner-container">
                   <div className="spinner"></div>
                   Processing...
                 </div>
               ) : (
                 <>
                 Pay ${driveway?.price}
                 </>
               )}
             </button>
            </div>


 <div className="order-summary">
   <h2>Order Summary</h2>

   <div className="summary-item">
         <p className="summary-label">Address</p>     <p>{driveway?.address}</p>
  </div>

   <div className="summary-item">
     <p className="summary-label">Game Date</p>
     <p>{game?.date}</p>
   </div>

   <div className="summary-item">
     <p className="summary-label">Parking Begins</p>
     <p>{game?.parkingBegins}</p>
  </div>

   <div className="summary-item">
   <p className="summary-label">Visiting Team</p>
     <p>{game?.visiting_team}</p>
   </div>

  {/* ⭐ Insert rules here */}
   {drivewayRules.length > 0 && (
    <div className="summary-item">
      <p className="summary-label">Driveway Rules</p>
      <ul className="rules-list">
        {drivewayRules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </div>
  )}

  <hr />

  <div className="total-row">
    <p>Total</p>
    <p className="total-price">${driveway?.price}</p>
  </div>

</div>
</div>

            </>
        )}

    </div>
  )
}