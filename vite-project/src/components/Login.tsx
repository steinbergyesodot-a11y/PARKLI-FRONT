import { useContext, useState } from 'react'
import { useNavigate } from 'react-router';
import { UserContext } from '../userContext';
import {jwtDecode} from "jwt-decode";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css'

interface JwtPayload {
  exp: number;
  name: string;
  id: string
}



export function Login(){
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')

    const userContext = useContext(UserContext)


    
    function handleEmail(event: any){
        setEmail(event.target.value)
    }

    function handlePassword(event: any){
        setPassword(event.target.value)
    }

    function sendHome(){
        navigate('/Home')
    }


    
    function handleSubmit(event: any){
        event.preventDefault();


        fetch('http://localhost:4000/users/Login',{
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
               const token = data.token
               const payload = jwtDecode<JwtPayload>(token);
               const now = Math.floor(Date.now() / 1000)
               if(payload.exp > now){
                   userContext?.setUser({
                     name: payload.name
                   })
               }else{
                 userContext?.setUser(null)
               }

               localStorage.setItem('jwt',token)
               const logout = () => setUser(null);
               
               window.alert(data.message);
               sendHome();
  
            }
        })
        
    }


    return(
        <div className='app-container'>
             <div className="top">
               <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo" onClick={sendHome} />
            
            
            </div>
            <section className='containor2' >
                <form action="" onSubmit={handleSubmit} className='loginBox'>

                   <input type="email" id='email' placeholder='Your email' className='input myComp' onChange={handleEmail} />
                   <input type="password" id='password' placeholder='Your password' className='input myComp' onChange={handlePassword} />
                   <button type='submit' className='submitBtn'>Login</button>
                </form>
            </section>
            <section className="footer">
                   <section className="line"></section>
           
                   <section className="buttonWrapper"></section>
                                                       
          </section>
        </div>
    )
}

function setUser(arg0: null) {
    throw new Error('Function not implemented.');
}
