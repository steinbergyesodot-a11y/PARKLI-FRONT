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
  authProvider: string;
}


export function ProfilePageRenter() {
  const token = localStorage.getItem("authToken") || "";
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [authProvider, setAuthProvider] = useState("");
  const [active, setActive] = useState("My Bookings");
  const [editingField, setEditingField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [message, setMessage] = useState("");
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const[isLoading,setIsLoading] = useState(false)
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);

  const navigate = useNavigate();

  // Token validation
  useEffect(() => {
    if (!token) {
      navigate("/Login");
    }
  }, [token, navigate]);

  // LOAD USER DATA FROM TOKEN
useEffect(() => {
  const decoded = jwtDecode<MyTokenPayload>(token);
  setAuthProvider(decoded.authProvider);
  setUserId(decoded._id);
}, [token]);

useEffect(() => {
  if (!userId) return;

  async function loadUser() {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const apiResponse = res.data
    setFirstName(apiResponse.data.firstName);
    setLastName(apiResponse.data.lastName);
    setEmail(apiResponse.data.email);
  }

  loadUser();
}, [userId]);

// FETCH PAYMENT METHODS FROM BOOKINGS



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
  // Validation
  if (!token) {
    setFirstNameError("Please login again");
    return;
  }
  
  if (!name.trim()) {
    setFirstNameError("First name cannot be empty");
    return;
  }

  try {
    setFirstNameError(null); // Clear previous errors
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

    const updated = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const apiResponse = updated.data
    setFirstName(apiResponse.data.firstName);
    setLastName(apiResponse.data.lastName);
    setEmail(apiResponse.data.email);
    setFirstNameError(null);
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
    
    setFirstNameError(errorMessage);
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
    
    const updated = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const apiResponse = updated.data
    setFirstName(apiResponse.data.firstName);
    setLastName(apiResponse.data.lastName);
    setEmail(apiResponse.data.email);
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

    const updated = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setFirstName(updated.data.user.firstName);
    setLastName(updated.data.user.lastName);
    setEmail(updated.data.user.email);
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
  }
}



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

      {/* HEADER */}
      <div className="topLineProfile">
        <img src="/assets/user-interface.png" className="profileAvatar" alt="avatar" />

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

      </section>

      {/* BOOKINGS */}
      {active === "My Bookings" && (
        <div>{userId && <BookingDash renterId={userId} />}</div>
      )}

     
      {active === "My Profile" && (
        <div className='editSections'>

          {message && <div className="successMessage">{message}</div>}          {firstNameError && <div className="errorMessage">{firstNameError}</div>}
          {lastNameError && <div className="errorMessage">{lastNameError}</div>}
          {emailError && <div className="errorMessage">{emailError}</div>}
          
          {/* FIRST NAME — only for local users */}
          {authProvider === "local" && (
            <>
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
                      disabled={showConfirm}
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingField("")}
                      className='cancelBtn'
                      disabled={showConfirm}

                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className='row'>
                  <p> <span className='fn'>First Name:  </span> <span className='fnValue'>{firstName}</span></p>
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
                  disabled={showConfirm}

                >
                  Save
                </button>
                <button onClick={() => setEditingField("")} className='cancelBtn'  disabled={showConfirm}
>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='row'>
              <p><span className='fn'>Last Name:</span> <span className='fnValue'>{lastName}</span></p>
              <MdEdit
                className='editIcon'
                onClick={() => {
                  setEditingField("lastName");
                  setTempValue(lastName);
                }}
              />
            </div>
          )}
            </>
          )}

          {/* EMAIL */}
          {editingField === "email" ? (
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
                      handleUpdateEmail(tempValue);
                    });
                    setShowConfirm(true);
                  }} 
                  disabled={showConfirm}
                >
                  Save
                </button>
                <button className='cancelBtn' onClick={() => setEditingField("")} disabled={showConfirm}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='row'>
              <p><span className='fn'>Email address:</span> <span className='fnValue'>{email}</span></p>
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

      {active === "Payment Methods" && (
    <p>payment</p>
      )}

      {active === "Settings" && (
        <div><p>My settings</p></div>
      )}

      {showConfirm && (
        <div className="confirmOverlay">
          <div className="confirmBox">
            <p>Are you sure you want to save?</p>

            <div className="confirmButtons">
         <button className="yesBtn" disabled={isLoading} onClick={async () => {
    setIsLoading(true);
    if (onConfirm) await onConfirm();
    setIsLoading(false);
    setShowConfirm(false);
  }}
>
  {isLoading ? <div className="spinner" /> : "Yes"}
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
