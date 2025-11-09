import '../style/Home.css'

export function Home(){
    return(
        <div>
         
          <div className='header'>
            <img src="https://copilot.microsoft.com/th/id/BCO.6be1ae1b-cfe5-43e0-bd6f-244454c0578c.png" alt="logo" className="logo"/>

            <nav className="btnNavbar">

                <section className='sectionA'>
                <button className='btn'>Menu</button>
                <button className='btn'>Find parking</button>
                <button className='btn'>Host now</button>
                <button className='btn'>About</button>
                </section>

                <section className='sectionB'>
                <button className='btn'>Sign up</button>
                <button className='btn'>Login</button>
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