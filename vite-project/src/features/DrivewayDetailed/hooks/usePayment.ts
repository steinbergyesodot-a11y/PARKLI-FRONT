import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { drivewayDetailedService } from "../services/drivewayDetailedService";
import { useDrivewayDetailed } from "./useDrivewayDetailed";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface MyTokenPayload {
  _id: string;
  name: string;
  role: string ;
  userType: string;
}

export function usePayment({game}:any){
    const [loading,setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage,setErrorMessage] = useState<string | null>(null);
    const [drivewayRules, setDrivewayRules] = useState([])
    const [bookingId, setBookingId] = useState<string | null>(null)
    const token = localStorage.getItem("authToken") || "";
    const decoded = jwtDecode<MyTokenPayload>(token);
    const userId = decoded._id;
    const params = useParams();
    const drivewayId =  params.drivewayId;
    const {driveway} = useDrivewayDetailed(drivewayId)
    const stripe = useStripe(); 
    const elements = useElements()

    async function handlePay(){
        setLoading(true);
        try{
           const token = localStorage.getItem("authToken");
           const response = await drivewayDetailedService.createPaymentIntent({
              renterId: userId,
              ownerId: driveway?.ownerId,
              drivewayId: drivewayId,
              address: driveway?.address,
              visiting_team: game.visiting_team,
              gameDate: game.date,
              parkingBegins: game.parkingBegins,
              price: driveway?.price
            });
            const apiResponse = response.data
            const clientSecret = apiResponse.data?.clientSecret || apiResponse.clientSecret;

            if (!clientSecret) {
            setErrorMessage("Failed to initialize payment. Missing client secret from server.");
            setLoading(false);
            return;
            }

            if (!stripe || !elements) return;

         const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(
       clientSecret,
        {
            payment_method: { card: cardElement }
        }
        );

     if (error) {
       // Surface Stripe error to user
       const msg = error.message || "Payment failed. Please check your card details and try again.";
       setErrorMessage(msg);
       setLoading(false);
       return;
     }

     if (paymentIntent?.status === "succeeded") {
       const formattedDate = new Date(game.date).toISOString().split("T")[0];
       const formattedTime = game.parkingBegins.slice(0, 5);

       try{
         const response = await drivewayDetailedService.createBooking({
             renterId: userId,
             ownerId: driveway?.ownerId,
             drivewayId: drivewayId,
             address: driveway?.address,
             visiting_team: game.visiting_team,
             gameDate: formattedDate,
             parkingBegins: formattedTime,
             price: driveway?.price,
             paymentIntentId: paymentIntent.id
         })
         const apiResponse = response.data
         const bookingId = apiResponse.data?._id || apiResponse._id;
         if (bookingId) {
           setBookingId(bookingId);
         }

           // ⭐ 4. Mark driveway unavailable
           if(drivewayId){

               const response = await drivewayDetailedService.updateDrivewayDate(drivewayId,formattedDate);
           }
           setShowSuccess(true)

           setErrorMessage(null);
           setLoading(false);

       }catch(err:any){
         const bookingError =
           err?.response?.data?.error ||
           err?.response?.data?.message ||
           err?.response?.data?.Message ||
           "Failed to create booking. Your payment was processed but we couldn't complete your reservation. Please contact support with your payment details.";
         setErrorMessage(typeof bookingError === 'string' ? bookingError : JSON.stringify(bookingError));
         setLoading(false);
       }

     }
        }catch(err:any){
         const backendError =
       err?.response?.data?.error ||
      err?.response?.data?.message ||
       err?.response?.data?.Message ||
       "Unknown error";
     setErrorMessage(typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
     setLoading(false);
     return;
   } finally {
     setLoading(false);
   }
    }
      
    


    async function getDrivewayRules(){
        try{
            if(drivewayId){
                const response = await drivewayDetailedService.getDrivewayRules(drivewayId);
                setDrivewayRules(response.data)
            }
        }catch(error:any){

        }
    }

     useEffect(() => {
        getDrivewayRules();
    }, []);

    return {
        loading,
        errorMessage,
        setLoading,
        setErrorMessage,
        drivewayRules,
        handlePay,
        showSuccess,
        bookingId
    }
}
