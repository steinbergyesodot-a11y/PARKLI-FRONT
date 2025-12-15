import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../userContext';
import { jwtDecode } from "jwt-decode";
import '../style/Login.css';

interface JwtPayload {
  exp: number;
  name: string;
  id: string;
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

  function handleSubmit(event: any) {
    event.preventDefault();

    fetch('http://localhost:4000/api/users/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
    
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          window.alert(data.error);
        } else {
          const token = data.token;
          const payload = jwtDecode<JwtPayload>(token);
          const now = Math.floor(Date.now() / 1000);

          if (payload.exp > now) {
            userContext?.setUser({
              name: payload.name
            });
          } else {
            userContext?.setUser(null);
          }

          localStorage.setItem('jwt', token);

          window.alert(data.message);
          sendHome();
        }
      });
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
