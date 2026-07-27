import { useContext, useState, useEffect } from "react";
import {dashboardService} from "../services/dashboardService";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../../../userContext"

interface Driveway {
  _id: string;
  address: string;
  publicDisplay: string;
  walk: number;
  name: string;
  stadium: string;
  price: number;
  images: string[];
  PostedAt: string;
}
export function useDashboard() {
    const [driveways,setDriveways] = useState<Driveway[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    function sendHome() {
      navigate("/Home");
    }

    async function getAllDriveways() {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await dashboardService.getAllDriveways();            
            // Handle response structure - backend returns {success: true, data: [...], error: null}
            // dashboardService already extracts response.data, so we get {success: true, data: [...], error: null}
            const drivewayArray = response?.data ? response.data : Array.isArray(response) ? response : [];
            setDriveways(drivewayArray);
        } catch (error: any) {
            const errorMsg = error.message || "Failed to load driveways";
            console.error("Error fetching driveways:", error);
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllDriveways();
    }, []);

    return {driveways,loading,errorMessage,message,user,getAllDriveways,sendHome}
}