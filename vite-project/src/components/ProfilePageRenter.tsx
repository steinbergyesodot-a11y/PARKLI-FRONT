import '../style/profilePage.css'
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BookingDash } from "./BookingsDash";
import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { MdEdit } from "react-icons/md";


interface MyTokenPayload {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  userType: string;
  email: string;
}

export function ProfilePageRenter() {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  // USER STATE
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // UI STATE
  const [active, setActive] = useState("My Bookings");
  const [editingField, setEditingField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState("");

  // CONFIRMATION MODAL
  const [showConfirm, setShowConfirm] = useState(false);
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);

  const navigate = useNavigate();

  // LOAD USER DATA FROM TOKEN
  useEffect(() => {
    const decoded = jwtDecode<MyTokenPayload>(token);
    setUserId(decoded._id);
    setFirstName(decoded.firstName);
    setLastName(decoded.lastName);
    setEmail(decoded.email);
  }, [token]);

  // AUTO-HIDE SUCCESS MESSAGE
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  function sendHome() {
    navigate('/Home');
  }

  // UPDATE FIRST NAME
  async function handleUpdateFirstName(name: string) {
    try {
      await axios.put(`http://localhost:4000/api/users/${userId}/firstName/${name}`);
      setFirstName(name);
      setMessage("Changes saved");
    } catch (error) {
      console.error("Error updating first name:", error);
    }
  }

  // UPDATE LAST NAME
  async function handleUpdateLastName(name: string) {
    try {
      await axios.put(`http://localhost:4000/api/users/${userId}/lastName/${name}`);
      setLastName(name);
      setMessage("Changes saved");
    } catch (error) {
      console.error("Error updating last name:", error);
    }
  }

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
        <img src="/assets/avatar.png" className="profileAvatar" alt="avatar" />

        <div className="namemail">
          <p className="name">{firstName}</p>
          <p className="email">{email}</p>
          <button className='editBtn' onClick={() => setActive("My Profile")}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <section className="navs">
        <button
          className={`navsBtn ${active === "My Bookings" ? "active" : ""}`}
          onClick={() => setActive("My Bookings")}
        >
          My Bookings
        </button>

        <button
          className={`navsBtn ${active === "Payment Methods" ? "active" : ""}`}
          onClick={() => setActive("Payment Methods")}
        >
          Payment Methods
        </button>

        <button
          className={`navsBtn ${active === "My Profile" ? "active" : ""}`}
          onClick={() => setActive("My Profile")}
        >
          My Profile
        </button>

        <button
          className={`navsBtn ${active === "Settings" ? "active" : ""}`}
          onClick={() => setActive("Settings")}
        >
          Settings
        </button>
      </section>

      {/* BOOKINGS */}
      {active === "My Bookings" && (
        <div>{userId && <BookingDash renterId={userId} />}</div>
      )}

     
      {active === "My Profile" && (
        <div className='editSections'>

          {message && <div className="successMessage">{message}</div>}

          {/* FIRST NAME */}
          {editingField === "firstName" ? (
            <div className="row">
              <input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <div className='editButtons'>
                <button
                  className='saveBtn'
                  onClick={() => {
                    setOnConfirm(() => () => {
                      setEditingField("");
                      handleUpdateFirstName(tempValue);
                    });
                    setShowConfirm(true);
                  }}
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingField("")}
                  className='cancelBtn'
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='row'>
              <p> <span className='fn'>First Name:</span> {firstName}</p>
              <MdEdit
                className='editIcon'
                onClick={() => {
                  setEditingField("firstName");
                  setTempValue(firstName);
                }}
              />
            </div>
          )}

          {/* LAST NAME */}
          {editingField === "lastName" ? (
            <div className="row">
              <input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <div className='editButtons'>
                <button
                  className='saveBtn'
                  onClick={() => {
                    setOnConfirm(() => () => {
                      setEditingField("");
                      handleUpdateLastName(tempValue);
                    });
                    setShowConfirm(true);
                  }}
                >
                  Save
                </button>
                <button onClick={() => setEditingField("")} className='cancelBtn'>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='row'>
              <p><span className='fn'>Last Name:</span> {lastName}</p>
              <MdEdit
                className='editIcon'
                onClick={() => {
                  setEditingField("lastName");
                  setTempValue(lastName);
                }}
              />
            </div>
          )}

          {/* EMAIL */}
          {editingField === "email" ? (
            <div className="row">
              <input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
              <div className='editButtons'>
                <button className='saveBtn' onClick={() => setEditingField("")}>
                  Save
                </button>
                <button className='cancelBtn' onClick={() => setEditingField("")}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='row'>
              <p><span className='fn'>Email address:</span>{email}</p>
              <MdEdit
                className='editIcon'
                onClick={() => {
                  setEditingField("email");
                  setTempValue(email);
                }}
              />
            </div>
          )}

        </div>
      )}

      {/* PAYMENT METHODS */}
      {active === "Payment Methods" && (
        <div><p>My payment methods</p></div>
      )}

      {/* SETTINGS */}
      {active === "Settings" && (
        <div><p>My settings</p></div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="confirmOverlay">
          <div className="confirmBox">
            <p>Are you sure you want to save?</p>

            <div className="confirmButtons">
              <button
                className="yesBtn"
                onClick={() => {
                  if (onConfirm) onConfirm();
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>

              <button
                className="noBtn"
                onClick={() => setShowConfirm(false)}
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
