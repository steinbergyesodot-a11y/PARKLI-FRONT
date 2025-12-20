import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Home } from "./Home"
import axios from "axios";
import '../style/SignUp.css'

export function SignUp(){
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const navigate = useNavigate();

    function handlefirstName(event:any){
        const firstName = event.target.value
        setFirstName(firstName)
    }

    function handlelastName(event:any){
        const lastName = event.target.value
        setLastName(lastName)
    }

    function handleEmail(event:any){
        const email = event.target.value
        setEmail(email)
    }

    function handlePassword(event:any){
        const password = event.target.value
        setPassword(password)
    }

 

    function sendHome(){
        navigate('/Home')
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
       event.preventDefault(); 
       if (!firstName || !lastName || !email || !password) {
         window.alert("All fields are required.");
          return;
      }
       if(password.length < 8){
            window.alert("Password must be at least 8 characters long.");
             return;
       }
       try{
         const response = await axios.post("http://localhost:4000/api/users/addUser", { 
          firstName,
          lastName,
          email,
          password,
        }); 
        window.alert(response.data.Message);
        sendHome();
       } catch (error: any) {
        console.error(error); 
       window.alert("Something went wrong. Please try again."); 
      }
     }

    return(
        <>

       <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>

       <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Create Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Sign Up</button>
    </form>
    <div className="back-home">
        <button onClick={sendHome}>Back to Home</button>
      </div>
        
        </>
    )
}