import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import axios from "axios";
import { act, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import '../style/ProfilePageOwner.css'
import { BookingDash } from "./BookingsDash";
import { MdEdit } from "react-icons/md";
import { AllDrivewaysByUser } from "./AllDrivewaysByUser";

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

export function ProfilePageOwner() {
  const navigate = useNavigate();
    const token = localStorage.getItem("authToken") || "";

  const [active, setActive] = useState("Host Bookings");
  const [games, setGames] = useState<Game[]>([]);
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
  const[authProvider,setAuthProvider] = useState("")
  const[renterActive,setRenterActive] = useState("My Bookings")

  const [user, setUser] = useState<MyTokenPayload | null>(null);
 
  const [editingField, setEditingField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [userHasBookings,setUserHasBookings] = useState(false)

 
    

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
      console.error("Error checking booking:", err); 
      setUserHasBookings(false); 
    } finally { 
      setLoading(false);
    }
  }

  checkBooking(); 
}, [userId]);


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


async function fetchGames(userId: string) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/driveways/getGames/${userId}`,
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
      return;
    }

    setGames(gamesData);
  } catch (err) {
    console.error("Failed to fetch games", err);
    setGames([]);
  }
}

async function handleUpdateFirstName(name: string) {
  if (!token) {
  console.error("No token found");
  return;
}
try {
    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/firstName/${name}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,   // <-- your JWT
          "Content-Type": "application/json"
        }
      }
    );

    setFirstName(name);
    setMessage("Changes saved");
  } catch (error:any) {
       const data = error.response?.data;
     const message = 
     typeof data === "string"
      ? data : 
      data?.message || 
      data?.error || 
      error.message || 
      "Login failed"; 
    console.error("Error updating first name:", error);
  }
}


  // UPDATE LAST NAME
 async function handleUpdateLastName(name: string) {
  if (!token) {
  console.error("No token found");
  return;
}

  try {
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
    setMessage("Changes saved");
  } catch (error) {
    console.error("Error updating last name:", error);
  }
}


async function handleUpdateEmail(email: string) {
  if (!token || !userId) {
    console.error("No token or userId found");
    return;
  }
   try {
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
    setMessage("Changes saved");
  } catch (error: any) {
    const data = error.response?.data;
    const message =
      typeof data === "string"
        ? data
        : data?.message ||
          data?.error ||
          error.message ||
          "Update failed";

    console.error("Error updating email:", message);
  }
}



  function sendHome() {
    navigate("/Home");
  }



async function handleBlock(drivewayId: string, gameDate: string) {
  try {
    setLoading(true)
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
        console.log("Setting message: Date blocked successfully!");  // ← Add this

    setMessage("Date blocked successfully!")
     // 🔥 Refresh UI
    if (user) fetchGames(user._id);

} catch (error:any) {
  
  const data = error.response?.data;
  const errorMessage = 
  typeof data === "string"
  ? data 
  : 
  data?.message || data?.error || error.message || 
  "block failed"; 
  console.log("Setting error message:", errorMessage);  // ← Add this
    setMessage(errorMessage)
    console.error("error blocking date", errorMessage)
  }
  finally{
    setLoading(false)
  }
}



async function handleUnblock(drivewayId: string, gameDate: string) {
  try {
    setLoading(true)
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
    // 🔥 Refresh UI
    if (user) fetchGames(user._id);
    setMessage("Date unblocked successfully!")
  } catch (error:any) {
     const data = error.response?.data;
    const errorMessage = 
      typeof data === "string"
        ? data 
        : 
        data?.message || data?.error || error.message || 
        "block failed"; 
    setMessage(errorMessage)
    console.error("error blocking date", errorMessage)
  }finally{
    setLoading(false)
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
        <h2>Upcoming Bookings</h2>
        <p className="block-info-text">
          If you don’t want your driveway booked for a specific game, you can block it.
        </p>

        {games.length === 0 ? (
          <p>No upcoming bookings</p>
        ) : (
          games.map((game, index) => (
            <section className="gameRow2" key={index}>
              <div className="gameData">
                <span className="game-date">{game.date}</span>
                <span className="game-vs">vs </span>
                <span className="game-team">{game.visiting_team}</span>
                <span className="game-date">@ {game.game_time}</span>
              </div>

              <button
                disabled={game.booked}
                className={`game-status ${
                  game.booked ? "booked" :
                  game.blocked ? "blocked" :
                  "available"
                }`}
                onClick={() => {
                  if (game.booked) return;
                  askToConfirm(
                    user!.drivewayIds[0],
                    game.date,
                    game.booked,
                    game.blocked
                  );
                }}
              >
                {game.booked
                  ? "Booked"
                  : game.blocked
                    ? "Blocked"
                    : "Available"}
              </button>
            </section>
          ))
        )}
            {message && <div className="successMessage">{message}</div>}


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
  <AllDrivewaysByUser user={userId}/>
)}

{active === "My Profile" && (
  <div className="editSections">
    {message && <div className="successMessage">{message}</div>}

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
      editingField === "lastName" ? (
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
      )
    )}

  {/* EMAIL — always shown */}
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
    {user?.roles.includes("renter") &&  userHasBookings &&(
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
    )}

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
