import { Link, useNavigate } from 'react-router-dom';
import '../style/Home.css';
import { QA } from './FQAitem';
import { Login } from './Login';
import { useContext, useState, useEffect } from "react";
import { UserContext } from '../userContext';
import { Nav, NavDropdown } from 'react-bootstrap';
import React, { Suspense, lazy } from "react";
import { ProfileDropdown } from './ProfileDropdown';
import Section from './Section';
import { FiSearch } from 'react-icons/fi';
import { PlaceAutocompleteTS } from './PlaceComplete';
import { FaHeartPulse, FaSackDollar, FaMapPin, FaShieldHalved } from 'react-icons/fa6';


export function Home() {
  const [Query, setQuery] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const userContext = useContext(UserContext);
  let user = userContext?.user;

  const navigate = useNavigate();

  const testimonials = [
    { text: "Easy booking, great prices, and I saved money on parking. Highly recommend Parkli to everyone!", author: "Sarah Martinez", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    { text: "The best driveway rental platform out there. Hosts are responsive and locations are perfect for events.", author: "Michael Chen", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
  ];

  useEffect(() => {
    // Testimonial carousel rotation
    const testimonialTimer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    // Scroll reveal for FAQ items
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animation = 'fadeInUp 0.6s ease forwards';
        }
      });
    }, { threshold: 0.1 });

    const faqItems = document.querySelectorAll('.QaA > *');
    faqItems.forEach((item, index) => {
      (item as HTMLElement).style.animationDelay = `${index * 0.1}s`;
      observer.observe(item);
    });

    return () => {
      clearInterval(testimonialTimer);
      observer.disconnect();
    };
  }, []);

 function logOut(){
   localStorage.removeItem("authToken")
   userContext?.setUser(null)
   navigate("/Home");
 }

  return (
    <div className='app-container'>
      {/* Logged-out banner */}
      {!user && (
        <div className="login-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h2>Earn money from your driveway</h2>
              <p>List your driveway and start earning with Parkli</p>
            </div>
            <Link to="/SignUp" className="banner-btn">Get Started</Link>
          </div>
        </div>
      )}
      
      <Section>
      <section className="firstSection">

  {user && (
    <div className="profile-wrapper">
      <ProfileDropdown />
    </div>
  )}
 


  {/* Centered navbar */}
  <div className="navbar-wrapper">
    <nav className="Navbar">
      <img src="/logo.png" alt="logo" className="homeLogo" />

      <section className="sectionA">
        <Link to="/Home" className="btnNav">Home</Link>
        <Link to="/Dashboard" className="btnNav">Find parking</Link>
        {user && <Link to="/AddDriveway" className="btnNav">Host Now</Link>}
        <Link to="/About" className="btnNav">About</Link>
        <Link to="/Help" className="btnNav">Help</Link>
      </section>

      <section className="sectionB">
        {!user ? (
          <>
            <Link to="/SignUp" className="btnNav">Sign up</Link>
            <Link to="/Login" className="btnNav">Login</Link>
          </>
        ) : (
          <>
            {user.roles?.includes('renter') && (
              <Link to="/Profile/renter" className="btnNav btnNav-accent">My Bookings</Link>
            )}
            {user.roles?.includes('host') && (
              <Link to="/Profile/DrivewayOwner" className="btnNav btnNav-accent">My Listings</Link>
            )}
          </>
        )}
      </section>
    </nav>
  </div>

  {/* Hero text */}
  <div className="text">
    <h1>Empty driveway. Full wallet.</h1>
    <p>It’s not just pavement, it’s potential.</p>
  </div>

  {/* Search bar or CTA Button */}
  {user ? (
    <section className="searching">
      <div className="search-container">
        <PlaceAutocompleteTS 
          onSelect={(addressData) => {
            setQuery(addressData.publicDisplay);
            navigate("/Dashboard", { state: { searchAddress: addressData.publicDisplay } });
          }} 
        />
        <FiSearch className="search-icon" />
      </div>
    </section>
  ) : (
    <section className="searching">
      <Link to="/SignUp" className="cta-button">
        Find Parking Now
      </Link>
    </section>
  )}

</section>



  <section className='middle'>
    {/* <p className='stars'>★★★★☆</p>
    <p className='reviews'>230,000+ Reviews | 4.2 stars</p> */}

    <p className='line3' style={{ animation: 'fadeInUp 0.6s ease' }}>
      "{testimonials[testimonialIndex].text}"
    </p>
    {/* <p className='line2' style={{ animation: 'fadeInUp 0.6s ease 0.1s both' }}>-{testimonials[testimonialIndex].author}-</p> */}

    <div className='container' style={{ animation: 'fadeIn 0.6s ease 0.2s both' }}>
      <img
        src={testimonials[testimonialIndex].image}
        alt={testimonials[testimonialIndex].author}
        className='image'
      />
    </div>

    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '1rem' }}>
      {testimonials.map((_, i) => (
        <div
          key={i}
          onClick={() => setTestimonialIndex(i)}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: i === testimonialIndex ? '#6557e0' : '#ccc',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  </section>
</Section>

      <Section>
  <Suspense fallback={<div>Loading section...</div>}>
    <section className='convincing'>
      <p className='convincing-title'>Why Choose Parkli Parking?</p>

      <section className='topRow'>
        <div className='quarter1'>
          <div className='iconBox'>
            <FaHeartPulse className='featureIcon' />
          </div>
          <div className='textBox'>
            <p className='biggerFont'>Stress Free</p>
            <p className='smallerFont'>Book instantly, no complications</p>
            <p className='statFont'>Effortless from start to finish</p>
            <Link to={user ? "/Dashboard" : "/SignUp"} className='btn-convincing'>
              {user ? "Start searching" : "Sign up to search"}
            </Link>
          </div>
        </div>

        <div className='quarter2'>
          <div className='iconBox'>
            <FaSackDollar className='featureIcon' />
          </div>
          <div className='textBox'>
            <p className='biggerFont'>Budget Friendly</p>
            <p className='smallerFont'>Save up to 40% vs traditional parking</p>
            <p className='statFont'>Avg. $8-15 per spot</p>
            <Link to={user ? "/Dashboard" : "/SignUp"} className='btn-convincing'>
              {user ? "Start searching" : "Sign up to search"}
            </Link>
          </div>
        </div>
      </section>

      <section className='bottomRow'>
        <div className='quarter1'>
          <div className='iconBox'>
            <FaMapPin className='featureIcon' />
          </div>
          <div className='textBox'>
            <p className='biggerFont'>Best Locations</p>
            <p className='smallerFont'>Close to stadiums and major events</p>
            <p className='statFont'>Right where you want to be</p>
            <Link to={user ? "/Dashboard" : "/SignUp"} className='btn-convincing'>
              {user ? "Start searching" : "Sign up to search"}
            </Link>
          </div>
        </div>

        <div className='quarter2'>
          <div className='iconBox'>
            <FaShieldHalved className='featureIcon' />
          </div>
          <div className='textBox'>
            <p className='biggerFont'>Secure & Safe</p>
            <p className='smallerFont'>Verified owners, secure payments</p>
            <p className='statFont'>100% Rated Transactions</p>
            <Link to={user ? "/Dashboard" : "/SignUp"} className='btn-convincing'>
              {user ? "Start searching" : "Sign up to search"}
            </Link>
          </div>
        </div>
      </section>

    </section>
  </Suspense>
</Section>


<Section>
  <div className='QAbox'>
    <p className='frequently'>Frequently asked questions</p>

    <section className='QaA' id="faq-section">
      <QA
        question={"How does Parkli work?"}
        answer={'Homeowners list their driveway, set availability and price. Drivers search, book, and park — all through our secure platform.'}
      />
      <QA question={'Can I set different prices for different events?'} answer={'Yes. You can adjust pricing based on demand, event type, or time of day.'} />
      <QA question={'What if someone overstays their booking?'} answer={'You can report it through your dashboard. We’ll handle the issue and support you.'} />
      <QA question={'Is my address visible to everyone?'} answer={'No. Your exact address is only shared with confirmed renters.'} />
      <QA question={'How do I get paid?'} answer={'Payments are processed securely and sent to your account after each completed booking.'} />
      <QA question={'Can I park overnight?'} answer={'It depends on the listing. Check the availability and duration set by the homeowner.'} />
      <QA question={'What if someone else is parked in my spot?'} answer={'Contact support immediately. We’ll help you find an alternative and issue a refund if needed.'} />
      <QA question={'Are there any hidden fees?'} answer={'No hidden fees. A small service fee is included in the final price shown before booking.'} />
      <QA question={'Can I cancel my booking?'} answer={'Yes. You can cancel up to 24 hours before the booking for a full refund.'} />
    </section>
  </div>
</Section>

<div className="footerHome">
  <div className="footer-container">

    <div className="footer-col">
      <h4>Company</h4>
      <Link to="/About">About Us</Link>

      <Link to="/our-mission">Our Mission</Link>
      <a href="/careers">Careers</a>
      <a href="/contact">Contact</a>
    </div>

    <div className="footer-col">
      <h4>Support</h4>
      <a href="#faq-section">FAQ</a>

      <a href="/help">Help Center</a>
      <a href="/PrivacyPolicy">Privacy Policy</a>
      <a href="/TermsOfUse">Terms of Service</a>
    </div>

<div className="footer-col">
  <h4>Follow Us</h4>
  <span className="coming-soon">Instagram (coming soon)</span>
  <span className="coming-soon">Facebook (coming soon)</span>
  <span className="coming-soon">LinkedIn (coming soon)</span>
  <span className="coming-soon">X (coming soon)</span>
</div>


  </div>

  <div className="footer-bottom">
    <p>© 2026 Parkli. All rights reserved.</p>
  </div>
</div>

     
    </div>
  );
}
