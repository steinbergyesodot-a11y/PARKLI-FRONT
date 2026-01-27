import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import '../style/ProfilePageOwner.css'
import { BookingDash } from "./BookingsDash";

interface MyTokenPayload {
  _id: string;
  name: string;
  roles: string[];
  email: string;
  drivewayIds:string
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

  const [active, setActive] = useState("Host Bookings");
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<MyTokenPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
  drivewayId: string;
  date: string;
  type: "block" | "unblock";
} | null>(null);
const[renterActive,setRenterActive] = useState("My Bookings")




  useEffect(() => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    setUser(decoded);
    fetchGames(decoded._id);
    setLoading(false);   
  } catch (err) {
    console.error("Invalid token", err);
    navigate("/login");
  }
}, []);

function askToConfirm(drivewayId: string, date: string, booked: boolean) {
  setPendingAction({
    drivewayId,
    date,
    type: booked ? "unblock" : "block"
  });
  setShowConfirm(true);
}


async function fetchGames(userId: string) {
  try {
    const res = await axios.get(
      `http://localhost:4000/api/driveways/getGames/${userId}`
    );
    console.log("RAW BACKEND RESPONSE:", res.data); // <-- ADD THIS

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





  function sendHome() {
    navigate("/Home");
  }


async function handleBlock(drivewayId: string, gameDate: string) {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/driveways/${drivewayId}/block/${gameDate}`
    );

    console.log("Updated driveway:", response.data.updatedDriveway);

    // 🔥 Refresh UI
    if (user) fetchGames(user._id);

  } catch (error) {
    console.error("Error blocking date:", error);
  }
}



async function handleUnblock(drivewayId: string, gameDate: string) {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/driveways/unblock/${drivewayId}/${gameDate}`
    );

    console.log("Unblocked:", response.data);

    // 🔥 Refresh UI
    if (user) fetchGames(user._id);

  } catch (error) {
    console.error("Error unblocking date:", error);
  }
}





  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <>
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
        <img
          src="/assets/avatar.png"
          alt="avatar"
          className="profileAvatar"
        />
        <div className="namemail">
          <p className="name">{user.name}</p>
          <p className="email">{user.email}</p>
          <button className="editBtn" onClick={() => setActive("My Profile")}>Edit Profile</button>

          
        </div>
      </div>
 
<p className="hostSection"></p>

      <section className="navs">
        {["Host Bookings", "My Driveways", "My Earnings","My Profile"].map(tab => (
          <button
            key={tab}
            className={`navsBtn ${active === tab ? "active" : ""}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </section>
      

      {active === "Host Bookings" && (
        <section className="games">
          <h2>Upcoming Bookings</h2>
<p className="block-info-text">
    If you don’t want your driveway booked for a specific game, you can block it by pressing <span className="block-info-keyword">Block</span> next to that game.
  </p>
          {games.length === 0 ? (
            <p>No upcoming bookings</p>
          ) : (
            games.map((game, index) => (
            <section className="gameRow2">

                <div className="gameData">
                    <span className="game-date">{game.date}</span>
                    <span className="game-vs">vs </span>
                    <span className="game-team">{game.visiting_team}</span>
                    <span className="game-date">@ {game.game_time}</span>
                </div>
                <button
                    className={`game-status ${game.booked ? "booked" : game.blocked ? "blocked":"available"}`}
                    onClick={() => askToConfirm(user.drivewayIds[0], game.date, game.booked)}

                    >
                    {game.booked
                    ? "Booked"
                    : game.blocked
                      ? "Blocked"
                      : "Available"
                    }

               </button>

            </section>
          ))
        )}


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
          : "Do you want to allow bookings for this game again?"}
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

<p className="hostSection"></p>

        </section>
      )}

      {active === "My Driveways" && <p>My driveways</p>}
      {active === "My Earnings" && <p>My Earnings</p>}



        <section className="navs">
        {["My Bookings", "Paymant method"].map(tab => (
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
        <>
        <div>
                    
                    <BookingDash renterId={user._id} />
                    </div>
                    </>
      )}
    </>
  );
}
