import { useState } from "react"
import { Link, useNavigate } from "react-router"
import '../style/SignUp.css'
import { Home } from "./Home"

export function SignUp(){
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const navigate = useNavigate();

    function handlefName(event:any){
        const fname = event.target.value
        setFname(fname)
    }

    function handlelName(event:any){
        const lname = event.target.value
        setLname(lname)
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

    function handleSubmit(event: any){
        event.preventDefault();
        fetch('http://localhost:4000/users/addUser',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: fname,
                lastName: lname,
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            window.alert(data.Message)
        })
        .catch(error => {
            console.log(error)
            window.alert("Something went wrong. Please try again.");
        })
    }


    return(
        <>
        <div className="top">
            <img src="assets/PARKLI LOGO.png" alt="logo" className="logo" onClick={sendHome} />
            
            
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="containor">
          <h2>Complete your registration</h2>
            <form onSubmit={handleSubmit} action="">
            
           <div className="signup">
           <section className="names">
            <input type="text" id="fname" placeholder="First name" onChange={handlefName} className="n"/>
            <input type="text" id="lname" placeholder="Last name" onChange={handlelName} className="n"/>
            </section>
           

             
           <input type="email" id="email"  placeholder="youremail@gmail.com" onChange={handleEmail} className="email"/>
           <input type="text" id="password" placeholder="Create a Password" onChange={handlePassword} className="password" />
           <button type="submit" className="submitBtn">Submit</button>
           </div>

           


           </form>

        </div>
        </>
    )
}