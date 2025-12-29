import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../userContext';
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import '../style/Login.css';

interface JwtPayload {
  exp: number;
  name: string;
  _id: string;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  function handleEmail(event: any) {
    setEmail(event.target.value);
  }

  function handlePassword(event: any) {
    setPassword(event.target.value);
  }

  function sendHome() {
    navigate('/Home');
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    try{
      const response = axios.post('http://localhost:4000/api/users/login', {
          password: password,
          email: email
      })
      const token = (await response).data.token
      console.log(token)

      localStorage.setItem("authToken", token);

      const decoded: JwtPayload = jwtDecode(token);
      const now = Date.now() / 1000;
      if(decoded.exp > now){
        userContext?.setUser({ 
          name: decoded.name,
          _id: decoded._id
        });
        sendHome();
        
      }else{
        localStorage.removeItem("authToken"); 
        userContext?.setUser(null);
      }
     
    }catch(error:any){
      console.error("error",error.response?.data || error.message);
      
    }
    
  }

    

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>

        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={handleEmail} 
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePassword} 
            placeholder="Enter your password"
          />
        </div>

        <button className="login-btn" type="submit">Log In</button>
      </form>

    </div>
  );
}
