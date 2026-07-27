import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ownerProfileService } from "../services/ownerProfileService";

interface MyTokenPayload {
  _id: string;
  firstName: string;
  lastName:string;
  roles: string[];
  email: string;
  drivewayIds:string[];
  authProvider:string
}

interface Driveway {
  _id: string;
  name: string;
  address: string;
  images: string[];
  walk: string;
  price: string;
  description: string;
  rules: string[]
}

export function useProfilePageOwner() {
    const token = localStorage.getItem("authToken") || "";
    const navigate = useNavigate();

    const [user, setUser] = useState<MyTokenPayload | null>(null);
    const [userId, setUserId] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");  
    const [authProvider, setAuthProvider] = useState("");  
    const [isStripeVerified, setIsStripeVerified] = useState<boolean | null>(null);
    const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState<string | null>(null);
    const [driveways,setDriveways] = useState<Driveway[]>([]);
    const [userHasBookings, setUserHasBookings] = useState(false);
  


    useEffect(() => {
          if (!token) {
            navigate("/Login");
          }
    }, [token, navigate]);

      useEffect(() => {
        const decoded = jwtDecode<MyTokenPayload>(token);
        setUser(decoded); 
        setUserId(decoded._id);
        setFirstName(decoded.firstName);
        setLastName(decoded.lastName);
        setEmail(decoded.email);
        setAuthProvider(decoded.authProvider)    
      }, [token]);


  useEffect(() => {
    async function fetchDriveways() {
      try {
        const response = await ownerProfileService.fetchDrivewaysByUserId(userId);
        setDriveways(response.data);
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchDriveways();
  }, [userId, token]);

  useEffect(() => {
    async function checkUserBookings() {
      if (!userId) {
        return;
      }

      try {
        const response = await ownerProfileService.checkBookings(userId);
        const hasBookings =
          Boolean(response?.success) && typeof response?.data === "boolean"
            ? response.data
            : false;
        setUserHasBookings(hasBookings);
      } catch (error) {
        console.log(error);
        setUserHasBookings(false);
      }
    }

    checkUserBookings();
  }, [userId]);

  useEffect(() => {
    async function checkStripeVerification() {
      if (!userId) {
        return;
      }

      try {
        const response = await ownerProfileService.checkStripeVerification(userId);
        const isVerified =
          Boolean(response?.success) && response?.data !== null
            ? Boolean(response.data.isStripeVerified)
            : false;
        const onboardingUrl =
          Boolean(response?.success) && response?.data !== null
            ? response.data.onboardingUrl || null
            : null;

        setIsStripeVerified(isVerified);
        setStripeOnboardingUrl(onboardingUrl);
      } catch (error) {
        console.log(error);
        setIsStripeVerified(false);
        setStripeOnboardingUrl(null);
      }
    }

    checkStripeVerification();
  }, [userId]);

    return {firstName,setFirstName,lastName,setLastName,email,setEmail,
        user,userId,authProvider,isStripeVerified,stripeOnboardingUrl,driveways,userHasBookings
    };
}