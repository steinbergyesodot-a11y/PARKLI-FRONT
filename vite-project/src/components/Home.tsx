import { Link } from 'react-router'
import '../style/Home.css'

export function Home(){
    return(
        <div className='HomePage'>
         
          <div className='header'>
            <img src="https://copilot.microsoft.com/th/id/BCO.6be1ae1b-cfe5-43e0-bd6f-244454c0578c.png" alt="logo" className="logo"/>

            <nav className="btnNavbar">

                <section className='sectionA'>
                <Link to="/Menu" className='btn'>Menu</Link>
                <Link to="/FindParking" className='btn'>Find parking</Link>
                <Link to="/AddOwner" className='btn'>Host Now</Link>
                <Link to="/About" className='btn'>About</Link>
                </section>

                <section className='sectionB'>
                <Link to="SignUp" className='btn'>Sign up</Link>
                <Link to="Login" className='btn'>Login</Link>
                </section>
                
            </nav>
            </div>
            <p className='text'>
            <h1>Empty driveway. Full wallet.</h1>
            <h3>It’s not just pavement — it’s potential.</h3>
            </p>
           
        </div>
    )
}