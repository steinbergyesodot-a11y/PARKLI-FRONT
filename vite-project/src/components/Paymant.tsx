import { Link, useLocation, useNavigate } from "react-router-dom";
import "../style/Paymant.css";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../userContext";
import { jwtDecode } from "jwt-decode";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import BookingSuccess from "./BookingConfirmed";

interface MyTokenPayload {
  _id: string;
  name: string;
  role: string;
  userType: string;
}

type PaymentState = {
  driveway_id: string;
  owner_id: string;
  address: string;
  price: number;
  visiting_team: string;
  gameDate: string;
  parkingBegins: string;
};

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentState | null;

  const stripe = useStripe(); 
  const elements = useElements()

  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [drivewayRules, setDrivewayRules] = useState([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const token = localStorage.getItem("authToken") || "";
  const decoded = jwtDecode<MyTokenPayload>(token);
  const userId = decoded._id;

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
    parkingBegins,
    visiting_team,
    gameDate,
  } = state;

async function handlePay() {
  setLoading(true);

  try {
    const token = localStorage.getItem("authToken");

    // 1. Create PaymentIntent
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/bookings/createPaymentIntent`,
      {
        renterId: userId,
        ownerId: owner_id,
        drivewayId: driveway_id,
        address,
        visiting_team,
        gameDate,
        price,
        parkingBegins
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const apiResponse = response.data
    
    // Handle both wrapped and unwrapped response structures
    const clientSecret = apiResponse.data?.clientSecret || apiResponse.clientSecret;

    if (!clientSecret) {
      setErrorMsg("Failed to initialize payment. Missing client secret from server.");
      setLoading(false);
      return;
    }

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // ⭐ 2. Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: cardElement }
      }
    );

    if (error) {
      // Surface Stripe error to user
      const msg = error.message || "Payment failed. Please check your card details and try again.";
      setErrorMsg(msg);
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const formattedDate = new Date(gameDate).toISOString().split("T")[0];
      const formattedTime = parkingBegins.slice(0, 5);

      try {
        // ⭐ 3. Create booking in MongoDB
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
          {
            renterId: userId,
            ownerId: owner_id,
            drivewayId: driveway_id,
            address,
            visiting_team,
            gameDate: formattedDate,
            price,
            parkingBegins: formattedTime,
            paymentIntentId: paymentIntent.id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // ⭐ 4. Mark driveway unavailable
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/driveways/${driveway_id}/${formattedDate}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setShowSuccess(true);

      } catch (err: any) {
        const backendError =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "Unknown error";
        // show backend error to user
        setErrorMsg(typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
        setLoading(false);
        return;
      }
    }

  } catch (err: any) {
    const backendError =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.response?.data?.Message ||
      "Unknown error";
    setErrorMsg(typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
    setLoading(false);
    return;
  } finally {
    setLoading(false);
  }
}


async function getDrivewayRules(){
  
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/driveways/rules/${driveway_id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const apiResponse = response.data
  setDrivewayRules(apiResponse.data)
  
}

useEffect(() => {
  getDrivewayRules();
}, []);


  function sendHome() {
    navigate("/Home");
  }

  return (
  <div className="payment-page">
    {!showSuccess ? (
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

            {errorMsg && (
              <div className="payment-error" role="alert">{errorMsg}</div>
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
                Pay ${price}
                </>
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
    <p className="summary-label">Parking Begins</p>
    <p>{parkingBegins}</p>
  </div>

  <div className="summary-item">
    <p className="summary-label">Visiting Team</p>
    <p>{visiting_team}</p>
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
    <p className="total-price">${price}</p>
  </div>

 
</div>

        </div>
      </>
    ) : (
      <BookingSuccess
        gameDate={gameDate}
        parkingBegins={parkingBegins}
        address={address}
        visitingTeam={visiting_team}
      />
    )}
  </div>
);

}
