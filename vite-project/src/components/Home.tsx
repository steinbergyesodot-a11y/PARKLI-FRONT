import { Link } from 'react-router'
import '../style/Home.css'
import { QA } from './FQAitem'

export function Home(){
    return(
        <div>
        <div className='header2'>
         
          <div className='header'>
            <img src="https://copilot.microsoft.com/th/id/BCO.3ed9eebf-b8d1-4d88-b6e0-2ba831a1eea3.png" alt="logo" className="logo"/>

            <nav className="btnNavbar">

                <section className='sectionA'>
                <Link to="/Menu" className='btn'>Menu</Link>
                <Link to="/FindParking" className='btn'>Find parking</Link>
                <Link to="/AddOwner" className='btn'>Host Now</Link>
                <Link to="/About" className='btn'>About</Link>
                </section>

                <section className='sectionB'>
                <Link to="/SignUp" className='btn'>Sign up</Link>
                <Link to="/Login" className='btn'>Login</Link>
                </section>
                
            </nav>
            </div>
            <p className='text'>
            <h1>Empty driveway. Full wallet.</h1>
            <h3>It’s not just pavement,  it’s potential.</h3>
            </p>
           
           
        </div>
        <section className='middle'>
            <p className='stars'>★★★★☆</p>
            <p className='reviews'>230,000+ Reviews | 4.2 stars</p>
            <p className='line1'>"This site is so clean and intuitive, I found exactly what I needed without even thinking.</p>
                 <p className='line2'>It feels like it was designed just for me!"</p>
                 <div className='container'>
                 <img src="https://tse1.mm.bing.net/th/id/OIP.zAibgViO82lC2GvdEFnX3QHaHa?w=168&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1" alt="trump" className='image'/>
                 </div>
                <p className='user'>-Donald J. Trump-</p>
        </section>

        <p className='frequently'>Frequently asked questions</p>
        <section className='QaA'>
            <QA question={"How does Parkli work?"} answer={'Homeowners list their driveway, set availability and price. Drivers search, book, and park — all through our secure platform.'}/>
             <QA question={'Can I set different prices for different events?'} answer={'Yes. You can adjust pricing based on demand, event type, or time of day.'}/>
             <QA question={'What if someone overstays their booking?'} answer={'You can report it through your dashboard. We’ll handle the issue and support you.'}/>
             <QA question={'Is my address visible to everyone?'} answer={'No. Your exact address is only shared with confirmed renters.'}/>
             <QA question={'How do I get paid?'} answer={'Payments are processed securely and sent to your account after each completed booking.'}/>
             <QA question={'Can I park overnight?'} answer={'It depends on the listing. Check the availability and duration set by the homeowner.'}/>
             <QA question={'What if someone else is parked in my spot?'} answer={'Contact support immediately. We’ll help you find an alternative and issue a refund if needed.'}/>
             <QA question={'Are there any hidden fees?'} answer={'No hidden fees. A small service fee is included in the final price shown before booking.'}/>
             <QA question={'Can I cancel my booking?'} answer={'Yes. You can cancel up to 24 hours before the booking for a full refund.'}/>

            

        </section>
        </div>


    )
}