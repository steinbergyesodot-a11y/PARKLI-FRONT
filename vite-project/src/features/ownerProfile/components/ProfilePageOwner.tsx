import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "../../../components/ProfileDropdown";
import { useProfilePageOwner } from "../hooks/useProfilePageOwner";
import { useEffect, useState } from "react";
import { GamesWindow, type Driveway } from "./gamesModal";
import "../../../style/ProfilePageOwner.css";
import { UserDriveways } from "./UsersDriveways";

type curActive = "My Profile" | "My Driveways" | "Host Bookings"
export function ProfilePageOwner() {
    const navigate = useNavigate();
    const [active, setActive] = useState<curActive>("Host Bookings");
    const [isGamesWindowOpen, setIsGamesWindowOpen] = useState(false);
    const [selectedDriveway, setSelectedDriveway] = useState<Driveway | null>(null);
    const {firstName,lastName,email,user,userId,authProvider,isStripeVerified,stripeOnboardingUrl,driveways} = useProfilePageOwner();   
    const tabs: curActive[] = ["Host Bookings", "My Driveways", "My Profile"];


    function sendHome() {
       navigate("/Home");
    }

    function openGamesWindow(driveway: Driveway) {
        setSelectedDriveway(driveway);
        setIsGamesWindowOpen(true);
    }

    function closeGamesWindow() {
        setIsGamesWindowOpen(false);
        setSelectedDriveway(null);
    }

    useEffect(() => {
        if (!isGamesWindowOpen) {
            return;
        }

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeGamesWindow();
            }
        };

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEsc);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isGamesWindowOpen]);

    return(
        <>
            <div className={`profile-owner-page ${isGamesWindowOpen ? "modal-open" : ""}`}>
            <div className="topAddDriveway">
              <img
                src="/logo.png"
                alt="logo"
                className="logo"
                onClick={sendHome}
              />
              <ProfileDropdown />
            </div>

            <div className="topLineProfile">
               <img src="/assets/user-interface.png" alt="avatar" className="profileAvatar" />
                <div className="namemail">
                    <p className="name">{firstName}</p>
                    <p className="email">{email}</p>
                    <button className="editBtn" onClick={() => setActive("My Profile")}>
                    Edit Profile
                    </button>
                </div>
            </div>

            <section className="navs">
                {tabs.map(tab => (
                    <button
                    key={tab}
                    className={`navsBtn ${active === tab ? "active" : ""}`}
                    onClick={() => setActive(tab as curActive)}
                    >
                    {tab}
                    </button>
                ))}
            </section>

            {isStripeVerified !== null && !isStripeVerified && (
                <div className="stripe-warning-container">
                    <div className="stripe-warning">
                    <div className="stripe-warning-icon">⚠️</div>
                    <div className="stripe-warning-content">
                        <h3 className="stripe-warning-title">Payment Setup Required</h3>
                        <p className="stripe-warning-text">Complete your Stripe verification to accept payments from renters.</p>
                        {stripeOnboardingUrl && (
                        <a href={stripeOnboardingUrl} target="_blank" rel="noopener noreferrer" className="stripe-link">
                            <button className="stripe-setup-btn">Complete Payment Setup →</button>
                        </a>
                        )}
                    </div>
                    </div>
                </div>
            )}

            {active === "Host Bookings" && (
                <section className="gamesss">
                    <h2 className="section-subtitle">View bookings by driveway</h2>
                    <div className="driveways-grid">
                            {driveways.length === 0 ? (
                                <div className="driveways-empty">
                                    <p className="driveways-empty-title">No driveways available yet</p>
                                    <p className="driveways-empty-text">Create a driveway to start managing host bookings.</p>
                                </div>
                            ) : (
                                driveways.map((driveway) => (
                                    <button
                                        key={driveway._id}
                                        className="driveway-card-btn"
                                        onClick={() => openGamesWindow(driveway)}
                                        type="button"
                                    >
                                        <span className="driveway-card-content">
                                            <span className="driveway-card-title">{driveway.name}</span>
                                            <span className="driveway-card-meta">View bookings</span>
                                        </span>
                                        <span className="driveway-card-action">Open</span>
                                    </button>
                                ))
                            )}
                    </div>
                </section>
            )}
            </div>

            {isGamesWindowOpen && selectedDriveway && (
                <div className="games-modal-overlay" onClick={closeGamesWindow}>
                    <GamesWindow onClose={closeGamesWindow} driveway={selectedDriveway} />
                </div>
            )}

            {active === "My Driveways" && (
              <UserDriveways userId={userId} driveways={driveways}/>
            
            )} 

        </>
    );
}