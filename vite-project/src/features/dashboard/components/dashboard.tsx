import { Nav } from "react-bootstrap";
import { useDashboard } from "../hooks/useDashboard";
import { ProfileDropdown } from "../../../components/ProfileDropdown";
import { DrivewayCard } from "./DrivewayCard";
import { DrivewayMap } from "./DrivewayMap";
import '../style/Dashboard.css';

export function Dashboard(){
    const {driveways,loading,errorMessage,message,user,getAllDriveways,sendHome} = useDashboard();
    
    return (
        <>
        <div className="app-container">
            <div className="topDashboard">
                <img
                src="/logo.png"
                alt="logo"
                className="logoDash"
                onClick={sendHome}
                />
                <Nav className="topRightCornerDashboard">
                {user && <ProfileDropdown />}
                </Nav>
            </div>

                {message && (
        <div className="dashboard-error-alert">
          <span className="alert-icon">⚠️</span>
          <span>{message}</span>
        </div>
      )}
          <section className="dashboard-wrapper">
            <div className="map-background">
              <DrivewayMap driveways={driveways} />
            </div>
            <div className="dashboard-overlay">
              <div className="dashboard-section">
                <h2 className="dashboard-title">Available Driveways</h2>
                <section className="dashboard">
                {loading ? (
                  <div className="dashboard-loading-state">
                    <div className="dashboard-spinner" aria-hidden="true"></div>
                    <div>Loading driveways…</div>
                  </div>
                ) : (
                  driveways.map((driveway) => (
                    <DrivewayCard
                      key={driveway._id}
                      name={driveway.name}
                      drivewayCardId={driveway._id}
                      address={driveway.publicDisplay}
                      distance={driveway.walk}
                      images={driveway.images}
                      price={driveway.price}
                    />
                  ))
                )}
                </section>
              </div>
            </div>
          </section>
          </div>
        </>
    )
}