import { useEffect, useState } from "react";
import { ownerProfileService } from "../services/ownerProfileService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

interface MyTokenPayload {
  _id: string;
  firstName: string;
  lastName:string;
  roles: string[];
  email: string;
  drivewayIds:string[];
  authProvider:string
}

export function useDrivewaysByUser() {
    const [driveways, setDriveways] = useState<Driveway[]>([]);
     
        const token = localStorage.getItem("authToken") || "";
        const navigate = useNavigate();
    
        const [user, setUser] = useState<MyTokenPayload | null>(null);
        const [userId, setUserId] = useState("");
    
        useEffect(() => {
          if (!token) {
            navigate("/Login");
          }
        }, [token, navigate]);
    
        useEffect(() => {
          const decoded = jwtDecode<MyTokenPayload>(token);
          setUser(decoded);
          setUserId(decoded._id);
        }, [token]);


        useEffect(() => {
        async function fetchDrivewaysByUserId() {
          try {
            const response = await ownerProfileService.fetchDrivewaysByUserId(userId);
            setDriveways(response.data);
          } catch (error: any) {
            console.log(error);
          }
        }
    
        fetchDrivewaysByUserId();
      }, [userId, token]);
    
      return { driveways };
}