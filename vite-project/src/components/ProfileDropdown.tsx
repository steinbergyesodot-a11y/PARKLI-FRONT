import { useState, useEffect, useRef, useContext } from "react";
import '../style/ProfileDropdown.css'
import { UserContext } from "../userContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MainProfilePage } from "./MainProfilePage";



interface MyTokenPayload {
  _id: string;
  name: string;
  role: string;
  roles: string[];
  email: string
}


export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();


  const userContext = useContext(UserContext);
  let user = userContext?.user;

  const token = localStorage.getItem("authToken");
      if (!token) return; 
      const decoded = jwtDecode<MyTokenPayload>(token);
      const userId = decoded._id;
      const userRoles = decoded.roles
      const userName = decoded.name
      const userEmail = decoded.email
 
   function logOut(){
   localStorage.removeItem("authToken")
   userContext?.setUser(null)
   navigate("/Home");
 }



  return (
    <div className="profile-wrapper" ref={menuRef}>
      <img
        src="data:image/webp;base64,UklGRiYEAABXRUJQVlA4IBoEAABwKgCdASr1APUAPp1Oo0ulpKOhplhYqLATiWlu4Wlddqq7SCSh9XxkXBu0Z7LZR0PRkI/mzJ9u/fCCX/6SFISWhUwzX7IPJaFTDNfVf9/+GnvPoFUXOYuRcqr/JMaK6zF27/nVf5uvfSG0lHLfe5fA+WkxUkJYRKuhzL4G7wYdyBSCxG5O3fPGbXQWZHbOxJFS9Oym0qiwyajN6OiGq36Up7B/enSkXd9AeW0FbPR1a/SIKMYI14lTj/kXDIpINtApOv4fi1FEQwzxtOQhGCDaOO9Ov35XozzZ9RsgQokZFqlBEylSyhIEK6JTBElk3dU80ZGJEOSaR3d5qElsJXxApiy1wpnyUk13jhkMbQUzipV5v3lt2sF/LjF0oLQvcU6dv44armAlpCSU8iqPZwSyIl8hY4vSCr6rCjXf9JCkO+Ut0CkJkzzzV+hUwzX7IPJaFTDNfsg8loVMMugA/vxcgAAALbIzTNydQU+bnxThnBkDLH3CAQWGCS4hOdZNIdfpYrIyS9SaqfLvPNuYoABSDitWmcX/5vfRWkxTg9dyIkRYyj/+XN77SLgyxnACqTDzp7adm/3cRlenlU0ZQG6Ps4Et5+vAdir0cd26F5ESLbC5DdkLJzG8BLWhV1O1Nxlvpf6f//5gUhSkkDdfBQoMkFQhA4q3Mok99zv9z3PuqCb2eSdqtnhv/1IApAdsZ1wFhWJBRuhRq7zEsaTpxCE0pWgBje3EBB7CgXnZvZo3Bt99HnWdlU/3hESTgEncPwpi2Sr/UUNUwD08KHEpUyVzEe70gcHOiJARXklModlB6n4bhNQB3ajS4NhT0OHRRokDrROYOmPaADKOBmQUBxwuFLgBb2QiF6ql8XM4bRt3IPciV3Ze30HAqVk8tuJWDuEpSbaVAV9fGWTLJkLBDtWZNRcwTcorHwc0h77WjmhepJKWvVWmbxM8Y31Jvk+CVJBA1ggCEoKDsUiT8J8Kxm+Rr0Y+6d3omBXauU1g949XJdbYOmMdjvfkHfAi5ALPNIiTzsSRRABOBhdNV8rLQXCISyeT2Lw8JwhmOIs+7zLopMzYRMRtsdWSrGMSg0j8EN5mDAKUsxnD05sHc+ZJyE9gYoZkvv5fJNXAg7gcy45YFE+aM28zsEozHrT3xTyjx+Pls2bklHZQF4k0wuV5SJC1yYAoOfwl667bamj6yaCqQkA7R/ABEVPdWsOfpQhfwy/4gYXsIYgvjxgY2dHCRk7EhEFEkG7H0SUtvLpBpjIKqnBviqSLcb1vXVYD2vR1bz30whaybqb7ZsG5mC0v1bybs/PCHsic3ElAhMtyDU1ArvHMebYoxgkB6vYyyIaIY+e5X79d3ozLreEd2Q38381he94w3ySVhrQ3WnFGVxQLaBG7A4xZ+QAAAAA="
        alt="User Avatar"
        className="avatar"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="dropdown-menu">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button>Settings</button>
          <button>Help</button>
          <button className="logout" onClick={logOut}>Log out</button>
        </div>
      )}
    </div>
  );
}
