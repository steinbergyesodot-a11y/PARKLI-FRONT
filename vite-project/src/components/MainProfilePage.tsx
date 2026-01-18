import { ProfilePageOwner } from "./ProfilePageOwner"
import { ProfilePageRenter } from "./ProfilePageRenter"
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../userContext';
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  _id: string;
  name: string;
  roles: string[];
  userType: string;
  email: string;
  drivewayIds:string
}


export function MainProfilePage(){
    
    
    const userContext = useContext(UserContext);
    let user = userContext?.user;
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const navigate = useNavigate();




    useEffect(() => {
      const token = localStorage.getItem("authToken");
    
      if (!token) {
        navigate("/login");
        return;
      }
    
      try {
        const decoded = jwtDecode<MyTokenPayload>(token);
        setUserRoles(decoded.roles)

        
      } catch (err) {
        navigate("/login");
      }
    }, []);
 
if (userRoles.length === 0) {
  return <p>Loading...</p>;
}

    return(
        <div>
            
{userRoles.includes("host") ? 
<div>
<ProfilePageOwner/>
</div>
 :
<div> 
 <ProfilePageRenter/>
 </div>
 }
        </div>
    )
}