import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import axios from "axios";
import { act, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import '../style/ProfilePageOwner.css'
import { BookingDash } from "./BookingsDash";
import { MdEdit } from "react-icons/md";
import { UserDriveways } from "./UsersDriveways";

interface MyTokenPayload {
  _id: string;
  firstName: string;
  lastName:string;
  roles: string[];
  email: string;
  drivewayIds:string[];
  authProvider:string
}

type Game = {
  visiting_team: string;
  game_time: string;
  date: string;
  booked: boolean;
  blocked: boolean
};

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


export function ProfilePageOwner() {
  const navigate = useNavigate();
    const token = localStorage.getItem("authToken") || "";
        const [driveways,setDriveways] = useState<Driveway[]>([])
        const [errorMsg, setErrorMessage] = useState("");

  const [active, setActive] = useState("Host Bookings");
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames,setLoadingGames] = useState(false)
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null)
  const [lastNameError, setLastNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
  drivewayId: string;
  date: string;
  type: "block" | "unblock";
} | null>(null);
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [authProvider,setAuthProvider] = useState("")
  const [renterActive,setRenterActive] = useState("My Bookings")

  const [user, setUser] = useState<MyTokenPayload | null>(null);
 
  const [editingField, setEditingField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState("");
  const [messageDate, setMessageDate] = useState<string | null>(null);
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [userHasBookings,setUserHasBookings] = useState(false);
  const [loadingGameDate, setLoadingGameDate] = useState<string | null>(null);
const [selectedDrivewayId, setSelectedDrivewayId] = useState<string | null>(null);
 
    

  useEffect(() => {
    const decoded = jwtDecode<MyTokenPayload>(token);
    setUser(decoded); 
    setUserId(decoded._id);
    setFirstName(decoded.firstName);
    setLastName(decoded.lastName);
    setEmail(decoded.email);
    setAuthProvider(decoded.authProvider)
    fetchGames(decoded._id)
    setLoading(false)

  }, [token]);

useEffect(() => { 
  if (!userId) return;

  async function checkBooking() { 
    try { 

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/checkIfUserHasBookings/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserHasBookings(res.data);
    } catch (err) { 
      setUserHasBookings(false); 
    } finally { 
      setLoading(false);
    }
  }

  checkBooking(); 
}, [userId]);


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


function askToConfirm(
  drivewayId: string,
  date: string,
  booked: boolean,
  blocked: boolean
) {
  if (booked) return; // booked → no action allowed

  const type = blocked ? "unblock" : "block";

  setPendingAction({ drivewayId, date, type });
  setShowConfirm(true);
}


async function fetchGames(drivewayId: string) {
  try {
    setLoadingGames(true)
    setGamesError(null);
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/driveways/getGames/${drivewayId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"

        }
      }
    );

    const gamesData = res.data?.games;
    if (!Array.isArray(gamesData)) {
      console.warn("Backend did not return an array. Got:", gamesData);
      setGames([]);
      setGamesError("No games data available.");
      return;
    }

    setGames(gamesData);
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Failed to load games. Please try again.";
    setGamesError(errorMessage);
    setGames([]);
  } finally {
    setLoadingGames(false);
  }
}

async function handleUpdateFirstName(name: string) {
  if (!token) {
    setNameError("Please login again");
    return;
  }
  
  if (!name.trim()) {
    setNameError("First name cannot be empty");
    return;
  }

  try {
    setNameError(null); 
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/firstName/${name}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    setFirstName(name);
    setMessage("Changes saved");
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error: any) {
    const data = error.response?.data;
    const errorMessage = 
      typeof data === "string"
        ? data 
        : data?.message || 
          data?.error || 
          error.message || 
          "Failed to update first name. Try again.";
    
    setNameError(errorMessage);
    console.error("Error updating first name:", error);
  }
}


  // UPDATE LAST NAME
 async function handleUpdateLastName(name: string) {
  // Validation
  if (!token) {
    setLastNameError("Please login again");
    return;
  }
  
  if (!name.trim()) {
    setLastNameError("Last name cannot be empty");
    return;
  }

  try {
    setLastNameError(null); // Clear previous errors
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/lastName/${name}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    setLastName(name);
    setLastNameError(null);
    setMessage("Changes saved");
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error: any) {
    const data = error.response?.data;
    const errorMessage = 
      typeof data === "string"
        ? data 
        : data?.message || 
          data?.error || 
          error.message || 
          "Failed to update last name. Try again.";
    
    setLastNameError(errorMessage);
    console.error("Error updating last name:", error);
  }
}


async function handleUpdateEmail(email: string) {
  // Validation
  if (!token || !userId) {
    setEmailError("Please login again");
    return;
  }
  
  if (!email.trim()) {
    setEmailError("Email cannot be empty");
    return;
  }
  
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setEmailError("Please enter a valid email address");
    return;
  }

  try {
    setEmailError(null); // Clear previous errors
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/email/${email}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    setEmail(email);
    setEmailError(null);
    setMessage("Changes saved");
    
    // Auto-clear success message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error: any) {
    const data = error.response?.data;
    const errorMessage =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          error.message ||
          "Failed to update email. Try again.";

    setEmailError(errorMessage);
    console.error("Error updating email:", error);
  }
}



  function sendHome() {
    navigate("/Home");
  }



async function handleBlock(drivewayId: string, gameDate: string) {
  try {
    setLoadingGameDate(gameDate);
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/driveways/${drivewayId}/block/${gameDate}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    const successMsg = "Date blocked successfully!";
    console.log("Setting message:", successMsg);
    setMessage(successMsg);
    setMessageDate(gameDate);
    
    // 🔥 Refresh UI
    if (selectedDrivewayId) fetchGames(selectedDrivewayId);
    
    // Auto-clear message after 4 seconds
    setTimeout(() => {
      setMessage("");
      setMessageDate(null);
    }, 4000);

} catch (error:any) {
  
  const data = error.response?.data;
  const errorMessage = 
  typeof data === "string"
  ? data 
  : 
  data?.message || data?.error || error.message || 
  "block failed"; 
  console.error("Block error:", errorMessage);
  setMessage(errorMessage);
  setMessageDate(gameDate);
  
  // Auto-clear error message after 4 seconds
  setTimeout(() => {
    setMessage("");
    setMessageDate(null);
  }, 4000);
  }
  finally{
    setLoadingGameDate(null);
  }
}



async function handleUnblock(drivewayId: string, gameDate: string) {
  try {
    setLoadingGameDate(gameDate);
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/driveways/${drivewayId}/unblock/${gameDate}`,
      {},
      {
        headers: {
            Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    const successMsg = "Date unblocked successfully!";
    console.log("Setting message:", successMsg);
    setMessage(successMsg);
    setMessageDate(gameDate);
    
    // 🔥 Refresh UI
    if (selectedDrivewayId) fetchGames(selectedDrivewayId);
    
    // Auto-clear message after 4 seconds
    setTimeout(() => {
      setMessage("");
      setMessageDate(null);
    }, 4000);
  } catch (error:any) {
     const data = error.response?.data;
    const errorMessage = 
      typeof data === "string"
        ? data 
        : 
        data?.message || data?.error || error.message || 
        "unblock failed"; 
    console.error("Unblock error:", errorMessage);
    setMessage(errorMessage);
    setMessageDate(gameDate);
    
    // Auto-clear error message after 4 seconds
    setTimeout(() => {
      setMessage("");
      setMessageDate(null);
    }, 4000);
  }finally{
    setLoadingGameDate(null);
  }
}

  if (loading) return <p>Loading...</p>;

return (
  <>
    {/* TOP BAR */}
    <div className="topAddDriveway">
      <img
        src="/logo.png"
        alt="logo"
        className="logo"
        onClick={sendHome}
      />
      <ProfileDropdown />
    </div>

    {/* HEADER */}
    <div className="topLineProfile">
      <img src="/assets/avatar.png" alt="avatar" className="profileAvatar" />
      <div className="namemail">
        <p className="name">{firstName}</p>
        <p className="email">{email}</p>
        <button className="editBtn" onClick={() => setActive("My Profile")}>
          Edit Profile
        </button>
      </div>
    </div>

    {/* OWNER NAV */}
    <section className="navs">
      {["Host Bookings", "My Driveways", "My Earnings", "My Profile"].map(tab => (
        <button
          key={tab}
          className={`navsBtn ${active === tab ? "active" : ""}`}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </section>

    {/* OWNER CONTENT */}
    {active === "Host Bookings" && (
      <section className="games">
          <h2 className="section-subtitle">View bookings by driveway</h2>
          <div className="driveways-grid">
                {driveways.map((driveway) => (
                  <div key={driveway._id} className={`driveway-card-small ${selectedDrivewayId === driveway._id ? 'selected' : ''}`}>
                    <button 
                    className="driveway-name-btn"
                    onClick={() => {
                      setSelectedDrivewayId(driveway._id)
                      fetchGames(driveway._id)
                    }}
                    >
                     {driveway.name}
                    </button>
                  </div>
                ))}
          </div>

          {selectedDrivewayId && (
            <div className="info-banner">
              <p>💡 Click on <strong>Available</strong> or <strong>Blocked</strong> to block/unblock bookings for that date.</p>
            </div>
          )}

        {loadingGames && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading games...</p>
          </div>
        )}

        {/* {gamesError && !loadingGames && (
          <div className="error-message">
            <p>⚠️ {gamesError}</p>
            <button onClick={() => fetchGames(userId)} className="retry-btn">
              Try Again
            </button>
          </div>
        )} */}

        {
           !loadingGames && !gamesError && games.map((game, index) => (
            <section className="gameRow2" key={index}>
              <div className="gameData">
                <span className="game-date">{game.date}</span>
                <span className="game-vs">vs </span>
                <span className="game-team">{game.visiting_team}</span>
                <span className="game-date">@ {game.game_time}</span>
              </div>

              {message && messageDate === game.date && <div className="successMessage">{message}</div>}

              <button
                disabled={game.booked || loadingGameDate === game.date}
                className={`game-status ${
                  game.booked ? "booked" :
                  game.blocked ? "blocked" :
                  "available"
                }`}
                onClick={() => {
                  if (game.booked) return;
                  askToConfirm(
                    selectedDrivewayId!,
                    game.date,
                    game.booked,
                    game.blocked
                  );
                }}
              >
                {loadingGameDate === game.date
                  ? "Loading..."
                  : game.booked
                  ? "Booked"
                  : game.blocked
                    ? "Blocked"
                    : "Available"}
              </button>
            </section>
          ))
        }


        {/* OWNER BLOCK/UNBLOCK MODAL */}
        {showConfirm && pendingAction && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h3>
                {pendingAction.type === "block"
                  ? "Block this date?"
                  : "Unblock this date?"}
              </h3>

              <p>
                {pendingAction.type === "block"
                  ? "Are you sure you want to block bookings for this game?"
                  : "Do you want to allow bookings again?"}
              </p>

              <div className="confirm-actions">
                <button
                  className="confirm-yes"
                  onClick={() => {
                    if (pendingAction.type === "block") {
                      handleBlock(pendingAction.drivewayId, pendingAction.date);
                    } else {
                      handleUnblock(pendingAction.drivewayId, pendingAction.date);
                    }
                    setShowConfirm(false);
                  }}
                >
                  Yes
                </button>

                <button
                  className="confirm-no"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      
    )}

{active === "My Driveways" && (
  <UserDriveways userId={userId}/>
)}

{active === "My Profile" && (
  <div className="editSections">
    {message && <div className="successMessage">{message}</div>}
    {nameError && <div className="errorMessage">{nameError}</div>}

    {/* FIRST NAME — only for local users */}
    {authProvider === "local" && (
      editingField === "firstName" ? (
        <div className="row">
          <input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <div className="editButtons">
            <button
              className="saveBtn"
              onClick={() => {
                setOnConfirm(() => () => {
                  setEditingField("");
                  handleUpdateFirstName(tempValue);
                });
                setShowProfileConfirm(true);
              }}
            >
              Save
            </button>
            <button onClick={() => setEditingField("")} className="cancelBtn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          <p>
            <span className="fn">First Name: </span>
            {firstName}
          </p>
          <MdEdit
            className="editIcon"
            onClick={() => {
              setEditingField("firstName");
              setTempValue(firstName);
            }}
          />
        </div>
      )
    )}

    {/* LAST NAME — only for local users */}
    {authProvider === "local" && (
      <>
        {lastNameError && <div className="errorMessage">{lastNameError}</div>}
        {editingField === "lastName" ? (
          <div className="row">
            <input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
            <div className="editButtons">
              <button
                className="saveBtn"
                onClick={() => {
                  setOnConfirm(() => () => {
                    setEditingField("");
                    handleUpdateLastName(tempValue);
                  });
                  setShowProfileConfirm(true);
                }}
              >
                Save
              </button>
              <button onClick={() => setEditingField("")} className="cancelBtn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            <p>
              <span className="fn">Last Name: </span>
              {lastName}
            </p>
            <MdEdit
              className="editIcon"
              onClick={() => {
                setEditingField("lastName");
                setTempValue(lastName);
              }}
            />
          </div>
        )}
      </>
    )}

  {/* EMAIL — always shown */}
{emailError && <div className="errorMessage">{emailError}</div>}
{editingField === "email" ? (
  <div className="row">
    <input
      value={tempValue}
      onChange={(e) => setTempValue(e.target.value)}
    />
    <div className="editButtons">
      <button
        className="saveBtn"
        onClick={() => {
          setOnConfirm(() => () => {
            setEditingField("");
            handleUpdateEmail(tempValue);   // <-- CALL THE FUNCTION
          });
          setShowProfileConfirm(true);       // <-- same confirmation modal pattern
        }}
      >
        Save
      </button>
      <button className="cancelBtn" onClick={() => setEditingField("")}>
        Cancel
      </button>
    </div>
  </div>
) : (
  <div className="row">
    <p>
      <span className="fn">Email address: </span>
      {email}
    </p>
    <MdEdit
      className="editIcon"
      onClick={() => {
        setEditingField("email");
        setTempValue(email);
      }}
    />
  </div>
)}

  </div>
)}


    {/* RENTER SECTION — ONLY IF USER IS ALSO A RENTER */}
    {/* {user?.roles.includes("renter") &&  userHasBookings &&(
      <>
        <section className="navs">
          {["My Bookings", "Payment method"].map(tab => (
            <button
              key={tab}
              className={`navsBtn ${renterActive === tab ? "active" : ""}`}
              onClick={() => setRenterActive(tab)}
            >
              {tab}
            </button>
          ))}
        </section>

        {renterActive === "My Bookings" && (
          <BookingDash renterId={userId} />
        )}
      </>
    )} */}

    {/* PROFILE CONFIRMATION MODAL */}
    {showProfileConfirm && (
      <div className="confirmOverlay">
        <div className="confirmBox">
          <p>Are you sure you want to save?</p>

          <div className="confirmButtons">
            <button
              className="yesBtn"
              onClick={() => {
                if (onConfirm) onConfirm();
                setShowProfileConfirm(false);
              }}
            >
              Yes
            </button>

            <button
              className="noBtn"
              onClick={() => setShowProfileConfirm(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

}
