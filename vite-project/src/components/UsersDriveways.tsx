import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import "../style/UsersDriveways.css";
import { useNavigate } from "react-router-dom";

interface UserDrivewaysProps {
  userId: string;
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

interface MyTokenPayload {
  _id: string;
  name: string;
  role: string;
  userType: string;
}

export function UserDriveways({userId}:UserDrivewaysProps){
    const [driveways,setDriveways] = useState<Driveway[]>([])
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMessage] = useState("");

    const navigate = useNavigate()

    const token = localStorage.getItem("authToken") || "";

    useEffect(() => {
    async function fetchDriveways() {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/driveways/getAllDrivewaysByUserId/${userId}`,
          {
            headers: {
                Authorization: `Bearer ${token}`
            }
          }
        );
        setDriveways(response.data.driveways);
      } catch (error: any) {
        const data = error.response?.data;
        const errMessage = 
          typeof data === "string"
            ? data 
            : data?.message || 
              data?.error || 
              error.message || 
              "Error loading driveways";
        setErrorMessage(errMessage);
        setDriveways([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDriveways();
  }, [userId, token]);



    return(
        <>
          <section className="user-driveways-container">
            
            {loading && (
              <div className="loading-message">Loading driveways...</div>
            )}

            {errorMsg && !loading && (
              <div className="error-message">{errorMsg}</div>
            )}

            {!loading && !errorMsg && driveways.length === 0 && (
              <p className="no-driveways">No driveways found</p>
            )}

            {!loading && !errorMsg && driveways.length > 0 && (
              <div className="driveways-grid">
                {driveways.map((driveway) => (
                  <div key={driveway._id} className="driveway-card-small">
                    <div className="card-content">
                      <h3 className="driveway-name">{driveway.name}</h3>
                      <p className="driveway-address">📍 {driveway.address}</p>
                    </div>
                    <button 
                    className="more-details-btn"
                    onClick={() => navigate(`/EditDriveway/${driveway._id}`)
                    } 
                    >
                     Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
    )}
