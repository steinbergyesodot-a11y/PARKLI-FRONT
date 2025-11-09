import '../style/Home.css'

export function Home(){
    return(
        <div>
           <video autoPlay loop muted className="background-video">
           <source src="/assets/carvideo.mp4" type="video/mp4" />
           </video>

          <div className='navbar'>
          <img src="https://copilot.microsoft.com/th/id/BCO.6be1ae1b-cfe5-43e0-bd6f-244454c0578c.png" alt="logo" className="logo"/>
          <nav className="btnNavbar">
                <button className='btn'>Menu</button>
                <button className='btn'>Find parking</button>
                <button className='btn'>About</button>
                <button className='btn'>Host now</button>
                <button className='btn'>Sign up</button>
                <button className='btn'>Login</button>
            </nav>
            </div>
        </div>
    )
}