import "../style/UsersDriveways.css";
import { useNavigate } from "react-router-dom";

interface UserDrivewaysProps {
  userId: string;
  driveways: Driveway[]
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

export function UserDriveways({userId,driveways}:UserDrivewaysProps){


    const navigate = useNavigate()

  return(
    <>
          <section className="user-driveways-panel">
            <h2 className="user-driveways-title">Manage your driveways</h2>

            {driveways.length > 0 ? (
              <div className="user-driveways-grid">
                {driveways.map((driveway) => (
                  <div key={driveway._id} className="user-driveway-card">
                    <div className="user-driveway-content">
                      <h3 className="user-driveway-name">{driveway.name}</h3>
                      <p className="user-driveway-address">{driveway.address}</p>
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
            ) : (
              <div className="user-driveways-empty">
                <p className="user-driveways-empty-title">No driveways added yet</p>
                <p className="user-driveways-empty-text">Add your first driveway to start hosting bookings.</p>
              </div>
            )}
          </section>
        </>
    )}
